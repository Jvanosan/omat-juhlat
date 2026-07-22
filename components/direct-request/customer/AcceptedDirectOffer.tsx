import type {
  CustomerOffer,
} from "@/components/quote/customer/types";

import {
  formatOfferPrice,
} from "@/components/quote/customer/quoteUtils";

export default function AcceptedDirectOffer({
  offer,
}: {
  offer: CustomerOffer;
}) {
  const companyName =
    offer.partner?.company ||
    "Palveluntarjoaja";

  return (
    <section className="rounded-3xl border border-[#72bca2] bg-[#edf8f3] p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#168365] text-xl text-white shadow-sm">
            ✓
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#168365]">
              Tarjous valittu
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#11634d]">
              {companyName}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#41685d]">
              Palveluntarjoajalle on
              ilmoitettu valinnastasi. Hän
              ottaa sinuun yhteyttä
              yksityiskohtien sopimiseksi.
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl border border-[#b9dfd0] bg-white px-5 py-4 sm:text-right">
          <p className="text-xs font-bold uppercase tracking-wide text-[#5c7c70]">
            Valittu hinta
          </p>

          <p className="mt-1 text-2xl font-black text-[#168365]">
            {formatOfferPrice(
              offer.offer_price,
            )}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#b9dfd0] bg-white/70 p-4 text-sm leading-6 text-[#41685d]">
        Sopimus, maksaminen, peruutusehdot ja
        tapahtuman yksityiskohdat sovitaan
        suoraan palveluntarjoajan kanssa.
      </div>
    </section>
  );
}