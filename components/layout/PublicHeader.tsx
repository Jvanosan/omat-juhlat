"use client";

import {
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function handleQuoteClick(
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    setMenuOpen(false);

    if (pathname !== "/") {
      return;
    }

    event.preventDefault();

    window.history.replaceState(
      null,
      "",
      "/#tarjouspyynto",
    );

    document
      .getElementById("tarjouspyynto")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8ded0] bg-[#fffdf9]/95 text-[#211b16] shadow-[0_6px_24px_rgba(73,53,31,0.06)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-18 items-center justify-between gap-4 py-3">
          <Link
            href="/"
            aria-label="OmatJuhlat – etusivu"
            className="shrink-0 text-xl font-black tracking-tight text-[#211b16] sm:text-2xl"
          >
            Omat
            <span className="text-[#b48a45]">
              Juhlat
            </span>
          </Link>

          <nav
            aria-label="Päänavigaatio"
            className="hidden items-center gap-1 lg:flex"
          >
            <DesktopLink
              href="/"
              active={pathname === "/"}
            >
              Etusivu
            </DesktopLink>

            <DesktopLink
              href="/browse"
              active={pathname === "/browse"}
            >
              Selaa palveluita
            </DesktopLink>

            <Link
              href="/#tarjouspyynto"
              onClick={handleQuoteClick}
              className="ml-2 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#b48a45] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#9f783a] hover:shadow-md"
            >
              Pyydä tarjoukset
            </Link>

            <Link
              href="/partner/apply"
              className="ml-1 inline-flex min-h-11 items-center justify-center rounded-xl border border-[#d8c7ad] bg-white px-4 py-2.5 text-sm font-semibold text-[#6f5328] transition hover:border-[#b48a45] hover:bg-[#fff9ef]"
            >
              Partneriksi
            </Link>

            <Link
              href="/partner/login"
              className="inline-flex min-h-11 items-center px-3 py-2.5 text-sm font-semibold text-[#70675e] transition hover:text-[#211b16]"
            >
              Kirjaudu
            </Link>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/#tarjouspyynto"
              onClick={handleQuoteClick}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#b48a45] px-3.5 py-2 text-sm font-bold text-white sm:px-4"
            >
              Pyydä tarjous
            </Link>

            <button
              type="button"
              aria-label={
                menuOpen
                  ? "Sulje valikko"
                  : "Avaa valikko"
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() =>
                setMenuOpen((current) => !current)
              }
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#ded3c4] bg-white text-xl text-[#3c332b] transition hover:bg-[#fff9ef]"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobiilinavigaatio"
            className="border-t border-[#eee5d9] py-4 lg:hidden"
          >
            <div className="grid gap-2">
              <MobileLink
                href="/"
                active={pathname === "/"}
              >
                🏠 Etusivu
              </MobileLink>

              <MobileLink
                href="/browse"
                active={pathname === "/browse"}
              >
                🔍 Selaa palveluita
              </MobileLink>

              <Link
                href="/#tarjouspyynto"
                onClick={handleQuoteClick}
                className="rounded-xl px-4 py-3 font-semibold text-[#51463d] transition hover:bg-[#f8efe2]"
              >
                ✨ Pyydä tarjoukset
              </Link>

              <MobileLink
                href="/partner/apply"
                active={pathname === "/partner/apply"}
              >
                🤝 Ryhdy partneriksi
              </MobileLink>

              <MobileLink
                href="/partner/login"
                active={pathname === "/partner/login"}
              >
                🔐 Partnerikirjautuminen
              </MobileLink>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function DesktopLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-[#f4eadb] text-[#795a28]"
          : "text-[#70675e] hover:bg-[#f8f2e9] hover:text-[#211b16]"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-xl px-4 py-3 font-semibold transition ${
        active
          ? "bg-[#f4eadb] text-[#795a28]"
          : "text-[#51463d] hover:bg-[#f8efe2]"
      }`}
    >
      {children}
    </Link>
  );
}