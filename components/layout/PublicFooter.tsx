import Image from "next/image";
import Link from "next/link";

import type {
  ReactNode,
} from "react";

export default function PublicFooter() {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer className="border-t border-[#e8ded0] bg-[#fffdf9] text-[#211b16]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              href="/"
              aria-label="OmatJuhlat – etusivu"
              className="inline-flex rounded-xl transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b48a45] focus-visible:ring-offset-2"
            >
              <Image
                src="/omatjuhlat-logo-glass.svg"
                alt="OmatJuhlat"
                width={620}
                height={160}
                unoptimized
                className="h-auto w-[210px] sm:w-[240px]"
              />
            </Link>

            <p className="mt-5 max-w-md leading-7 text-[#70675e]">
              Löydä juhlapalvelut, vertaile
              tarjouksia ja valitse
              tapahtumaasi sopivat
              palveluntarjoajat helposti
              yhdestä paikasta.
            </p>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#62584f]">
              <span>
                ✓ Maksuton tarjouspyyntö
              </span>

              <span>
                ✓ Vahvistetut yritykset
              </span>

              <span>
                ✓ Turvalliset asiakaslinkit
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#9a773b]">
              Asiakkaalle
            </h2>

            <nav
              aria-label="Asiakkaan linkit"
              className="mt-4 grid gap-3 text-sm"
            >
              <FooterLink href="/">
                Etusivu
              </FooterLink>

              <FooterLink href="/#tarjouspyynto">
                Pyydä tarjoukset
              </FooterLink>

              <FooterLink href="/browse">
                Selaa palveluita
              </FooterLink>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#9a773b]">
              Palveluntarjoajalle
            </h2>

            <nav
              aria-label="Partnerin linkit"
              className="mt-4 grid gap-3 text-sm"
            >
              <FooterLink href="/partner/apply">
                Ryhdy partneriksi
              </FooterLink>

              <FooterLink href="/partner/login">
                Partnerikirjautuminen
              </FooterLink>
            </nav>

            <a
              href="mailto:info@omatjuhlat.fi"
              className="mt-5 inline-flex text-sm font-bold text-[#795a28] transition hover:text-[#b48a45]"
            >
              info@omatjuhlat.fi
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-[#e8ded0] pt-6">
          <div className="flex flex-col gap-5 text-xs leading-5 text-[#91877d] sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p>
                © {currentYear} OmatJuhlat.
                Kaikki oikeudet pidätetään.
              </p>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                <Link
                  href="/tietosuoja"
                  className="font-bold text-[#795a28] transition hover:text-[#b48a45]"
                >
                  Tietosuojaseloste
                </Link>

                <a
                  href="mailto:tietosuoja@omatjuhlat.fi"
                  className="font-bold text-[#795a28] transition hover:text-[#b48a45]"
                >
                  Tietosuoja-asiat
                </a>

                <Link
                  href="/kayttoehdot"
                  className="font-bold text-[#795a28] transition hover:text-[#b48a45]"
                >
                  Käyttöehdot
                </Link>
              </div>
            </div>

            <p className="max-w-2xl sm:text-right">
              OmatJuhlat toimii asiakkaiden
              ja palveluntarjoajien
              yhdistäjänä. Sopimukset ja
              maksut hoidetaan suoraan
              palveluntarjoajan kanssa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="w-fit font-semibold text-[#70675e] transition hover:text-[#8a672f]"
    >
      {children}
    </Link>
  );
}