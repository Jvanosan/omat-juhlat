import "server-only";

import {
  EMAIL_FROM,
  escapeHtml,
  formatPrice,
} from "./confirmationUtils";

import type {
  ConfirmationPartner,
  ConfirmationQuote,
  EmailPayload,
  QuotePartnerOffer,
} from "./types";

type PartnerWithEmail =
  ConfirmationPartner & {
    email: string;
  };

type QuoteWithEmail =
  ConfirmationQuote & {
    email: string;
  };

export function createWinnerEmail({
  partner,
  offers,
  quote,
}: {
  partner: PartnerWithEmail;
  offers: QuotePartnerOffer[];
  quote: ConfirmationQuote;
}): EmailPayload {
  const offerRows = offers
    .map(
      (offer) => `
        <div style="margin-top:12px;padding:14px;border:1px solid #e8ded0;border-radius:12px;background:#fffdf9;">
          <p style="margin:0 0 6px;">
            <strong>Palvelu:</strong>
            ${escapeHtml(
              offer.service ||
                "Palvelu",
            )}
          </p>

          <p style="margin:0;">
            <strong>Hinta:</strong>
            ${escapeHtml(
              formatPrice(
                offer.offer_price,
              ),
            )}
          </p>
        </div>
      `,
    )
    .join("");

  return {
    from: EMAIL_FROM,
    to: partner.email,
    subject:
      "Asiakas valitsi tarjouksesi – OmatJuhlat",
    html: `
      <div style="margin:0;background:#fbf8f2;padding:32px 16px;font-family:Arial,sans-serif;color:#211b16;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e8ded0;border-radius:20px;padding:32px;">
          <p style="margin:0 0 8px;color:#9a773b;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
            OmatJuhlat
          </p>

          <h1 style="margin:0 0 16px;font-size:26px;">
            Onneksi olkoon!
          </h1>

          <p>
            Asiakas vahvisti tarjouksesi.
          </p>

          ${offerRows}

          <h2 style="margin-top:28px;font-size:18px;">
            Asiakkaan yhteystiedot
          </h2>

          ${
            quote.name
              ? `
                <p>
                  <strong>Nimi:</strong>
                  ${escapeHtml(
                    quote.name,
                  )}
                </p>
              `
              : ""
          }

          <p>
            <strong>Sähköposti:</strong>
            ${escapeHtml(
              quote.email,
            )}
          </p>

          ${
            quote.phone
              ? `
                <p>
                  <strong>Puhelin:</strong>
                  ${escapeHtml(
                    quote.phone,
                  )}
                </p>
              `
              : ""
          }

          <p style="margin-top:22px;color:#62584f;line-height:1.7;">
            Ota yhteyttä asiakkaaseen mahdollisimman pian sopiaksenne tapahtuman yksityiskohdista.
          </p>
        </div>
      </div>
    `,
  };
}

export function createLoserEmail({
  partner,
}: {
  partner: PartnerWithEmail;
}): EmailPayload {
  return {
    from: EMAIL_FROM,
    to: partner.email,
    subject:
      "Kiitos tarjouksestasi – OmatJuhlat",
    html: `
      <div style="margin:0;background:#fbf8f2;padding:32px 16px;font-family:Arial,sans-serif;color:#211b16;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e8ded0;border-radius:20px;padding:32px;">
          <p style="margin:0 0 8px;color:#9a773b;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
            OmatJuhlat
          </p>

          <h1 style="margin:0 0 16px;font-size:24px;">
            Kiitos tarjouksestasi
          </h1>

          <p style="color:#62584f;line-height:1.7;">
            Tällä kertaa asiakas valitsi toisen palveluntarjoajan. Kiitos osallistumisesta – uusia tarjouspyyntöjä tulee myöhemmin.
          </p>
        </div>
      </div>
    `,
  };
}

export function createCustomerEmail({
  quote,
  winners,
  partnersById,
}: {
  quote: QuoteWithEmail;
  winners: QuotePartnerOffer[];
  partnersById: Map<
    string,
    ConfirmationPartner
  >;
}): EmailPayload {
  const selectedRows = winners
    .map((winner) => {
      const partner =
        partnersById.get(
          String(
            winner.partner_id,
          ),
        );

      return `
        <div style="margin-top:12px;padding:14px;border:1px solid #e8ded0;border-radius:12px;background:#fffdf9;">
          <p style="margin:0 0 6px;">
            <strong>Palveluntarjoaja:</strong>
            ${escapeHtml(
              partner?.company ||
                "Palveluntarjoaja",
            )}
          </p>

          <p style="margin:0 0 6px;">
            <strong>Palvelu:</strong>
            ${escapeHtml(
              winner.service ||
                "Palvelu",
            )}
          </p>

          <p style="margin:0;">
            <strong>Hinta:</strong>
            ${escapeHtml(
              formatPrice(
                winner.offer_price,
              ),
            )}
          </p>
        </div>
      `;
    })
    .join("");

  return {
    from: EMAIL_FROM,
    to: quote.email,
    subject:
      "Palveluntarjoajien valinta vahvistettu – OmatJuhlat",
    html: `
      <div style="margin:0;background:#fbf8f2;padding:32px 16px;font-family:Arial,sans-serif;color:#211b16;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e8ded0;border-radius:20px;padding:32px;">
          <p style="margin:0 0 8px;color:#9a773b;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
            OmatJuhlat
          </p>

          <h1 style="margin:0 0 16px;font-size:26px;">
            Valintasi on vahvistettu
          </h1>

          <p style="color:#62584f;line-height:1.7;">
            Valituille palveluntarjoajille on ilmoitettu. He ottavat sinuun yhteyttä sopiakseen yksityiskohdista.
          </p>

          <p>
            <strong>Päivämäärä:</strong>
            ${escapeHtml(
              quote.date,
            )}
          </p>

          <p>
            <strong>Paikkakunta:</strong>
            ${escapeHtml(
              quote.location,
            )}
          </p>

          <p>
            <strong>Vierasmäärä:</strong>
            ${escapeHtml(
              quote.guests,
            )}
          </p>

          <div style="margin-top:24px;">
            ${selectedRows}
          </div>

          <p style="margin-top:24px;color:#91877d;font-size:13px;line-height:1.6;">
            Sopimus ja maksaminen hoidetaan suoraan palveluntarjoajan kanssa.
          </p>
        </div>
      </div>
    `,
  };
}