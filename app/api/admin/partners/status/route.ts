import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  adminSupabase,
  isAuthorizedAdmin,
} from "@/lib/server/adminAuth";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const ALLOWED_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const authorized =
      await isAuthorizedAdmin(request);

    if (!authorized) {
      return NextResponse.json(
        {
          error:
            "Sinulla ei ole oikeutta muuttaa partnerin tilaa.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const partnerId = String(
      body.partnerId ?? ""
    ).trim();

    const status = String(
      body.status ?? ""
    ).trim();

    if (!partnerId || !status) {
      return NextResponse.json(
        { error: "Partnerin tunnus tai tila puuttuu." },
        { status: 400 }
      );
    }

    if (
      !ALLOWED_STATUSES.includes(
        status as (typeof ALLOWED_STATUSES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Partnerin tila ei ole kelvollinen." },
        { status: 400 }
      );
    }

    const { data: existingPartner, error: partnerError } =
      await adminSupabase
        .from("partners")
        .select("id, email, company, status")
        .eq("id", partnerId)
        .maybeSingle();

    if (partnerError) {
      console.error(
        "ADMIN PARTNER STATUS LOAD ERROR:",
        partnerError
      );

      return NextResponse.json(
        { error: "Partnerin hakeminen epäonnistui." },
        { status: 500 }
      );
    }

    if (!existingPartner) {
      return NextResponse.json(
        { error: "Partneria ei löytynyt." },
        { status: 404 }
      );
    }

    if (existingPartner.status === status) {
      return NextResponse.json({
        success: true,
        status,
        emailSent: false,
        unchanged: true,
      });
    }

    const { error: updateError } =
      await adminSupabase
        .from("partners")
        .update({ status })
        .eq("id", partnerId);

    if (updateError) {
      console.error(
        "ADMIN PARTNER STATUS UPDATE ERROR:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Partnerin tilan päivittäminen epäonnistui.",
        },
        { status: 500 }
      );
    }

    let emailSent = false;

    if (
      status === "approved" &&
      existingPartner.email
    ) {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(
          /\/$/,
          ""
        ) || new URL(request.url).origin;

      const completionUrl =
        `${siteUrl}/partner/complete` +
        `?partnerId=${encodeURIComponent(partnerId)}`;

      const { error: emailError } =
        await resend.emails.send({
          from:
            "OmatJuhlat <onboarding@resend.dev>",
          to: existingPartner.email,
          subject:
            "Teidät on hyväksytty OmatJuhlat-kumppaniksi!",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>
                Tervetuloa mukaan,
                ${escapeHtml(existingPartner.company)}! 🎉
              </h2>

              <p>
                Yrityksenne on hyväksytty
                OmatJuhlat-kumppaniksi.
              </p>

              <p>
                Täydennä yritysprofiilisi kirjautumalla
                partneritilillesi.
              </p>

              <p style="margin: 24px 0;">
                <a
                  href="${escapeHtml(completionUrl)}"
                  style="
                    display: inline-block;
                    padding: 14px 20px;
                    border-radius: 10px;
                    background: #059669;
                    color: #ffffff;
                    text-decoration: none;
                    font-weight: bold;
                  "
                >
                  Täydennä profiilisi
                </a>
              </p>
            </div>
          `,
        });

      emailSent = !emailError;

      if (emailError) {
        console.error(
          "ADMIN PARTNER APPROVAL EMAIL ERROR:",
          emailError
        );
      }
    }

    return NextResponse.json({
      success: true,
      status,
      emailSent,
    });
  } catch (error) {
    console.error(
      "ADMIN PARTNER STATUS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Palvelimella tapahtui odottamaton virhe.",
      },
      { status: 500 }
    );
  }
}