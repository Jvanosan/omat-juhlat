import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  adminSupabase,
  isAuthorizedAdmin,
} from "@/lib/server/adminAuth";

const resend = new Resend(
  process.env.RESEND_API_KEY,
);

const ALLOWED_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

type AllowedStatus =
  (typeof ALLOWED_STATUSES)[number];

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function createPartnerAccessLink({
  email,
  authUserId,
  redirectTo,
}: {
  email: string;
  authUserId: string | null;
  redirectTo: string;
}) {
  let existingAuthUserId =
    authUserId;

  if (existingAuthUserId) {
    const {
      data,
      error,
    } =
      await adminSupabase.auth.admin.getUserById(
        existingAuthUserId,
      );

    if (
      error ||
      !data.user
    ) {
      existingAuthUserId =
        null;
    }
  }

  if (!existingAuthUserId) {
    const {
      data,
      error,
    } =
      await adminSupabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

    if (error) {
      throw error;
    }

    const existingUser =
      data.users.find(
        (user) =>
          user.email
            ?.trim()
            .toLowerCase() ===
          email.toLowerCase(),
      );

    existingAuthUserId =
      existingUser?.id ?? null;
  }

  const linkType =
    existingAuthUserId
      ? "recovery"
      : "invite";

  const {
    data,
    error,
  } =
    await adminSupabase.auth.admin.generateLink({
      type: linkType,
      email,
      options: {
        redirectTo,
      },
    });

  if (error) {
    throw error;
  }

  const actionLink =
    data.properties?.action_link;

  const generatedUserId =
    data.user?.id ??
    existingAuthUserId;

  if (
    !actionLink ||
    !generatedUserId
  ) {
    throw new Error(
      "Partnerin kirjautumislinkkiä ei voitu luoda.",
    );
  }

  return {
    actionLink,
    authUserId:
      generatedUserId,
  };
}

export async function POST(
  request: Request,
) {
  try {
    const authorized =
      await isAuthorizedAdmin(
        request,
      );

    if (!authorized) {
      return NextResponse.json(
        {
          error:
            "Sinulla ei ole oikeutta muuttaa partnerin tilaa.",
        },
        {
          status: 403,
        },
      );
    }

    const body =
      await request.json();

    const partnerId = String(
      body.partnerId ?? "",
    ).trim();

    const status = String(
      body.status ?? "",
    ).trim() as AllowedStatus;

    const resendInvite =
      body.resendInvite === true;

    if (
      !partnerId ||
      !status
    ) {
      return NextResponse.json(
        {
          error:
            "Partnerin tunnus tai tila puuttuu.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !ALLOWED_STATUSES.includes(
        status,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Partnerin tila ei ole kelvollinen.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      data: existingPartner,
      error: partnerError,
    } = await adminSupabase
      .from("partners")
      .select(`
        id,
        email,
        company,
        status,
        auth_user_id
      `)
      .eq("id", partnerId)
      .maybeSingle();

    if (partnerError) {
      console.error(
        "ADMIN PARTNER STATUS LOAD ERROR:",
        partnerError,
      );

      return NextResponse.json(
        {
          error:
            "Partnerin hakeminen epäonnistui.",
        },
        {
          status: 500,
        },
      );
    }

    if (!existingPartner) {
      return NextResponse.json(
        {
          error:
            "Partneria ei löytynyt.",
        },
        {
          status: 404,
        },
      );
    }

    const statusChanged =
      existingPartner.status !==
      status;

    const shouldSendInvite =
      status === "approved" &&
      (
        statusChanged ||
        resendInvite
      );

    if (
      !statusChanged &&
      !shouldSendInvite
    ) {
      return NextResponse.json({
        success: true,
        status,
        emailSent: false,
        unchanged: true,
      });
    }

    let authUserId =
      existingPartner.auth_user_id ??
      null;

    let actionLink = "";

    if (shouldSendInvite) {
      const email = String(
        existingPartner.email ?? "",
      )
        .trim()
        .toLowerCase();

      if (!email) {
        return NextResponse.json(
          {
            error:
              "Partnerin sähköpostiosoite puuttuu.",
          },
          {
            status: 400,
          },
        );
      }

      const siteUrl =
        process.env
          .NEXT_PUBLIC_SITE_URL
          ?.replace(/\/$/, "") ||
        new URL(
          request.url,
        ).origin;

      const linkResult =
        await createPartnerAccessLink({
          email,
          authUserId,
          redirectTo:
            `${siteUrl}/partner/reset-password`,
        });

      authUserId =
        linkResult.authUserId;

      actionLink =
        linkResult.actionLink;
    }

    const updates: {
      status: AllowedStatus;
      auth_user_id?: string;
    } = {
      status,
    };

    if (authUserId) {
      updates.auth_user_id =
        authUserId;
    }

    const {
      error: updateError,
    } = await adminSupabase
      .from("partners")
      .update(updates)
      .eq("id", partnerId);

    if (updateError) {
      console.error(
        "ADMIN PARTNER STATUS UPDATE ERROR:",
        updateError,
      );

      return NextResponse.json(
        {
          error:
            "Partnerin tilan päivittäminen epäonnistui.",
        },
        {
          status: 500,
        },
      );
    }

    let emailSent = false;

    if (
      shouldSendInvite &&
      actionLink
    ) {
      const {
        error: emailError,
      } =
        await resend.emails.send({
          from:
            "OmatJuhlat <noreply@omatjuhlat.fi>",

          to:
            existingPartner.email,

          subject:
            "Sinut on hyväksytty OmatJuhlat-kumppaniksi!",

          html: `
            <div style="margin:0;background:#fbf8f2;padding:32px 16px;font-family:Arial,sans-serif;color:#211b16;">
              <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e8ded0;border-radius:20px;padding:32px;">
                <p style="margin:0 0 8px;color:#9a773b;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                  OmatJuhlat
                </p>

                <h1 style="margin:0 0 20px;font-size:26px;">
                  Tervetuloa mukaan,
                  ${escapeHtml(
                    existingPartner.company,
                  )}!
                </h1>

                <p style="line-height:1.7;color:#62584f;">
                  Partnerihakemuksenne on hyväksytty.
                  Luo salasana alla olevasta henkilökohtaisesta linkistä ja täydennä sen jälkeen yritysprofiilisi.
                </p>

                <p style="margin:28px 0;">
                  <a
                    href="${escapeHtml(
                      actionLink,
                    )}"
                    style="display:inline-block;padding:14px 22px;border-radius:12px;background:#b48a45;color:#ffffff;font-weight:700;text-decoration:none;"
                  >
                    Luo salasana ja jatka
                  </a>
                </p>

                <p style="margin:0;color:#91877d;font-size:13px;line-height:1.6;">
                  Linkki on henkilökohtainen. Älä jaa sitä muille.
                </p>
              </div>
            </div>
          `,
        });

      if (emailError) {
        console.error(
          "ADMIN PARTNER APPROVAL EMAIL ERROR:",
          emailError,
        );

        return NextResponse.json(
          {
            error:
              "Partneri hyväksyttiin, mutta kutsusähköpostin lähettäminen epäonnistui.",
            status,
            emailSent: false,
          },
          {
            status: 502,
          },
        );
      }

      emailSent = true;
    }

    return NextResponse.json({
      success: true,
      status,
      emailSent,
      unchanged:
        !statusChanged,
    });
  } catch (error) {
    console.error(
      "ADMIN PARTNER STATUS API ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Palvelimella tapahtui odottamaton virhe.",
      },
      {
        status: 500,
      },
    );
  }
}