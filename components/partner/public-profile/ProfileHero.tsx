import type { PublicPartner } from "./types";

type ProfileHeroProps = {
  partner: PublicPartner;
  mainImage: string;
  services: string[];
  averageRating: string | null;
  reviewCount: number;
};

export default function ProfileHero({
  partner,
  mainImage,
  services,
  averageRating,
  reviewCount,
}: ProfileHeroProps) {
  const companyName =
    partner.company ||
    "Palveluntarjoaja";

  return (
    <>
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#f4eadb] to-[#f2dfe3] sm:h-72 lg:h-[420px]">
        {mainImage ? (
          <img
            src={mainImage}
            alt={`${companyName} kansikuva`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <div
                aria-hidden="true"
                className="text-6xl"
              >
                ✨
              </div>

              <p className="mt-3 font-medium text-[#91877d]">
                Kansikuvaa ei ole vielä
                lisätty
              </p>
            </div>
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#211b16]/35 via-transparent to-transparent"
        />
      </div>

      <div className="border-b border-[#eee5d9] px-5 pb-8 sm:px-8 lg:px-10">
        <div className="relative -mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
          {partner.logo_url ? (
            <img
              src={partner.logo_url}
              alt={`${companyName} logo`}
              className="relative h-24 w-24 shrink-0 rounded-2xl border-4 border-white bg-white object-contain p-2 shadow-lg sm:h-28 sm:w-28"
            />
          ) : (
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#f4eadb] text-3xl font-black text-[#8a672f] shadow-lg sm:h-28 sm:w-28">
              {companyName
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1 sm:pb-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a773b]">
              OmatJuhlat-palveluntarjoaja
            </p>

            <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-[#211b16] sm:text-4xl lg:text-5xl">
              {companyName}
            </h1>

            {averageRating ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className="text-lg text-[#e0a321]"
                  aria-hidden="true"
                >
                  ★★★★★
                </span>

                <span className="font-bold text-[#211b16]">
                  {averageRating} / 5
                </span>

                <span className="text-sm text-[#70675e]">
                  ({reviewCount}{" "}
                  {reviewCount === 1
                    ? "arvostelu"
                    : "arvostelua"}
                  )
                </span>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#91877d]">
                Ei vielä arvosteluja
              </p>
            )}
          </div>
        </div>

        {services.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-[#e5d8c5] bg-[#fff9ef] px-3 py-1.5 text-sm font-semibold text-[#795a28]"
              >
                {service}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}