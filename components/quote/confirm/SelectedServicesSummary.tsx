import type {
  CustomerOffer,
} from "@/components/quote/customer/types";

import {
  formatOfferPrice,
} from "@/components/quote/customer/quoteUtils";

import SelectedServiceCard from "./SelectedServiceCard";

export default function SelectedServicesSummary({
  offers,
  total,
}: {
  offers: CustomerOffer[];
  total: number;
}) {
  return (
    <section>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a773b]">
            Valintasi
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#211b16] sm:text-3xl">
            Valitsemasi palvelut
          </h2>
        </div>

        <p className="text-sm font-semibold text-[#70675e]">
          {offers.length}{" "}
          {offers.length === 1
            ? "palvelu"
            : "palvelua"}
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#d8c7ad] bg-white p-8 text-center">
          <div
            aria-hidden="true"
            className="text-4xl"
          >
            📭
          </div>

          <h3 className="mt-4 text-xl font-bold text-[#211b16]">
            Valintoja ei löytynyt
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#70675e]">
            Palaa tarjoussivulle ja valitse
            vähintään yksi tarjous ennen
            vahvistamista.
          </p>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-6 ${
              offers.length > 1
                ? "lg:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {offers.map((offer) => (
              <SelectedServiceCard
                key={offer.id}
                offer={offer}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-[#e1cfad] bg-gradient-to-br from-[#fff8eb] to-[#f7ead5] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a773b]">
                Valintojen yhteishinta
              </p>

              <p className="mt-1 text-sm text-[#70675e]">
                Lopulliset maksuehdot sovitaan
                suoraan palveluntarjoajien kanssa.
              </p>
            </div>

            <p className="shrink-0 text-3xl font-black text-[#8a672f] sm:text-4xl">
              {formatOfferPrice(total)}
            </p>
          </div>
        </>
      )}
    </section>
  );
}