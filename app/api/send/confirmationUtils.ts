import "server-only";

import { Resend } from "resend";

import type {
  EmailPayload,
} from "./types";

const resendApiKey =
  process.env.RESEND_API_KEY;

const resend = resendApiKey
  ? new Resend(resendApiKey)
  : null;

export const EMAIL_FROM =
  process.env.RESEND_FROM_EMAIL ||
  "OmatJuhlat <noreply@omatjuhlat.fi>";

export function escapeHtml(
  value: unknown,
): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll(
      "'",
      "&#039;",
    );
}

export function isExpired(
  value: string | null,
): boolean {
  if (!value) {
    return false;
  }

  const expirationDate =
    new Date(value);

  if (
    Number.isNaN(
      expirationDate.getTime(),
    )
  ) {
    return true;
  }

  return (
    expirationDate.getTime() <=
    Date.now()
  );
}

export function formatPrice(
  value: unknown,
): string {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "Ei ilmoitettu";
  }

  return `${new Intl.NumberFormat(
    "fi-FI",
    {
      minimumFractionDigits:
        Number.isInteger(price)
          ? 0
          : 2,
      maximumFractionDigits: 2,
    },
  ).format(price)} €`;
}

export async function sendEmail(
  payload: EmailPayload,
): Promise<boolean> {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY puuttuu. Sähköpostia ei lähetetty.",
    );

    return false;
  }

  try {
    const { error } =
      await resend.emails.send(
        payload,
      );

    if (error) {
      console.error(
        "RESEND EMAIL ERROR:",
        error,
      );

      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "RESEND EMAIL ERROR:",
      error,
    );

    return false;
  }
}