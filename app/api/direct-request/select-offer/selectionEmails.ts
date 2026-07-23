import "server-only";

import {
  EMAIL_FROM,
  escapeHtml,
  formatPrice,
  type EmailPayload,
} from "./selectionUtils";

export type DirectSelectionRequest = {
  id: string;
  status: string | null;
  email: string | null;
  customer_name: string | null;
  phone: string | null;
  event_date: string | null;
  location: string | null;
  guests: number | null;
  event_type: string | null;
};

export type SelectedDirectOffer = {
  id: string;
  direct_request_id: string;
  partner_id: string;
  status: string;
  price: number;
  message: string | null;
  expires_at: string | null;
};

export type SelectedDirectPartner = {
  id: string;
  company: string | null;
  email: string | null;
};

export function createCustomerSelectionEmail({
  request,
  offer,
  partner,
}: {
  request:
    DirectSelectionRequest & {
      email: string;
    };
  offer: SelectedDirectOffer;
  partner: SelectedDirectPartner;
}): EmailPayload {
  return {
    from: EMAIL_FROM,
    to: request.email,
    subject:
      "Palveluntarjoajan valinta vahvistettu – OmatJuhlat",
    html: `
      <div style="margin:0;background:#fbf8f2;padding:32px 16px;font-family:Arial,sans-serif;color:#211b16;">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e8ded0;border-radius:20px;padding:32px;">
          <p style="margin:0 0 8px;color:#9a773b;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
            OmatJuhlat
          </p>

          <h1 style="margin:0 0 16px;font-size:26px;">
            Valintasi on vahvistettu
          </h1>

          <p>
            Valitsit palveluntarjoajan
            <strong>${escapeHtml(
              partner.company ||
                "Palveluntarjoaja",
            )}</strong>.
          </p>

          <p>
            <strong>Tapahtuma:</strong>
            ${escapeHtml(
              request.event_type,
            )}
          </p>

          <p>
            <strong>Päivämäärä:</strong>
            ${escapeHtml(
              request.event_date,
            )}
          </p>

          <p>
            <strong>Paikkakunta:</strong>
            ${escapeHtml(
              request.location,
            )}
          </p>

          <p>
            <strong>Vierasmäärä:</strong>
            ${escapeHtml(
              request.guests,
            )}
          </p>

          <p>
            <strong>Hinta:</strong>
            ${escapeHtml(
              formatPrice(
                offer.price,
              ),
            )}
          </p>

          ${
            offer.message
              ? `
                <p>
                  <strong>Palveluntarjoajan viesti:</strong><br>
                  ${escapeHtml(
                    offer.message,
                  )}
                </p>
              `
              : ""
          }

          <p style="margin-top:24px;color:#62584f;line-height:1.7;">
            Palveluntarjoaja saa nyt yhteystietosi ja ottaa sinuun yhteyttä yksityiskohtien sopimiseksi.
          </p>

          <p style="color:#91877d;font-size:13px;">
            Sopimus ja maksaminen hoidetaan suoraan palveluntarjoajan kanssa.
          </p>
        </div>
      </div>
    `,
  };
}

export function createPartnerSelectionEmail({
  request,
  offer,
  partner,
}: {
  request: DirectSelectionRequest;
  offer: SelectedDirectOffer;
  partner:
    SelectedDirectPartner & {
      email: string;
    };
}): EmailPayload {
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

          <p>
            <strong>Hinta:</strong>
            ${escapeHtml(
              formatPrice(
                offer.price,
              ),
            )}
          </p>

          <p>
            <strong>Tapahtuma:</strong>
            ${escapeHtml(
              request.event_type,
            )}
          </p>

          <p>
            <strong>Päivämäärä:</strong>
            ${escapeHtml(
              request.event_date,
            )}
          </p>

          <p>
            <strong>Paikkakunta:</strong>
            ${escapeHtml(
              request.location,
            )}
          </p>

          <p>
            <strong>Vierasmäärä:</strong>
            ${escapeHtml(
              request.guests,
            )}
          </p>

          <h2 style="margin-top:26px;font-size:18px;">
            Asiakkaan yhteystiedot
          </h2>

          ${
            request.customer_name
              ? `
                <p>
                  <strong>Nimi:</strong>
                  ${escapeHtml(
                    request.customer_name,
                  )}
                </p>
              `
              : ""
          }

          <p>
            <strong>Sähköposti:</strong>
            ${escapeHtml(
              request.email,
            )}
          </p>

          ${
            request.phone
              ? `
                <p>
                  <strong>Puhelin:</strong>
                  ${escapeHtml(
                    request.phone,
                  )}
                </p>
              `
              : ""
          }

          <p style="margin-top:22px;color:#62584f;line-height:1.7;">
            Ota yhteyttä asiakkaaseen mahdollisimman pian.
          </p>
        </div>
      </div>
    `,
  };
}