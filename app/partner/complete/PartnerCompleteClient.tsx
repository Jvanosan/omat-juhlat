"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import {
  useRouter,
} from "next/navigation";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

import {
  supabase,
} from "@/lib/supabase";

type CompleteState =
  | "checking"
  | "login-required"
  | "error";

export default function PartnerCompleteClient() {
  const router = useRouter();

  const [state, setState] =
    useState<CompleteState>(
      "checking",
    );

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let active = true;

    async function continueOnboarding() {
      try {
        const {
          data: { session },
          error,
        } =
          await supabase.auth.getSession();

        if (!active) {
          return;
        }

        if (error) {
          throw error;
        }

        if (!session) {
          setState(
            "login-required",
          );

          return;
        }

        router.replace(
          "/partner/onboarding",
        );
      } catch (error) {
        console.error(
          "PARTNER COMPLETE SESSION ERROR:",
          error,
        );

        if (!active) {
          return;
        }

        setErrorMessage(
          "Tilin tietoja ei voitu tarkistaa. Yritä uudelleen.",
        );

        setState("error");
      }
    }

    void continueOnboarding();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <>
      <PublicHeader />

      <main className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden bg-[#fbf8f2] px-4 py-12 text-[#211b16] sm:px-6">
        <div
          aria-hidden="true"
          className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#ead3ad]/35 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#edccd5]/30 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-xl">
          <section className="overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-[0_24px_70px_rgba(73,53,31,0.14)]">
            <div className="bg-gradient-to-br from-[#fffaf2] via-white to-[#f8eee5] px-6 py-9 text-center sm:px-9">
              <StatusIcon
                state={state}
              />

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
                OmatJuhlat Partner
              </p>

              <h1 className="mt-3 text-3xl font-bold text-[#211b16] sm:text-4xl">
                {state === "checking"
                  ? "Valmistellaan yritysprofiiliasi"
                  : state ===
                      "login-required"
                    ? "Kirjaudu jatkaaksesi"
                    : "Jatkaminen epäonnistui"}
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#70675e] sm:text-base">
                {state === "checking"
                  ? "Tarkistamme partneritilisi ja ohjaamme sinut turvallisesti profiilin käyttöönottoon."
                  : state ===
                      "login-required"
                    ? "Yritysprofiilin tietoja voi muokata vain kirjautuneena partneritilille."
                    : errorMessage}
              </p>
            </div>

            <div className="px-6 py-7 sm:px-9">
              {state === "checking" && (
                <div
                  role="status"
                  className="rounded-2xl border border-[#e8ded0] bg-[#fffaf2] p-5 text-center"
                >
                  <div
                    aria-hidden="true"
                    className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
                  />

                  <p className="mt-4 text-sm font-bold text-[#62584f]">
                    Tarkistetaan
                    kirjautumistietoja...
                  </p>
                </div>
              )}

              {state ===
                "login-required" && (
                <div className="space-y-4">
                  <Link
                    href="/partner/login?next=/partner/onboarding"
                    className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-4 font-bold text-white shadow-[0_10px_24px_rgba(180,138,69,0.24)] transition hover:bg-[#9f783a]"
                  >
                    Kirjaudu partneritilille
                  </Link>

                  <p className="text-center text-xs leading-5 text-[#91877d]">
                    Käytä hyväksymisen
                    yhteydessä saamaasi
                    partneritiliä.
                  </p>
                </div>
              )}

              {state === "error" && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() =>
                      window.location.reload()
                    }
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#b48a45] px-5 py-3 font-bold text-white transition hover:bg-[#9f783a]"
                  >
                    Yritä uudelleen
                  </button>

                  <Link
                    href="/partner/login?next=/partner/onboarding"
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#ded3c4] bg-white px-5 py-3 font-bold text-[#62584f] transition hover:border-[#b48a45] hover:bg-[#fffaf2]"
                  >
                    Siirry kirjautumiseen
                  </Link>
                </div>
              )}
            </div>
          </section>

          <p className="mt-5 text-center text-xs leading-5 text-[#91877d]">
            Partneritietoja ei avata pelkän
            URL-tunnisteen perusteella.
          </p>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}

function StatusIcon({
  state,
}: {
  state: CompleteState;
}) {
  if (state === "error") {
    return (
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#edcaca] bg] bg-[#fff0f0] text-4xl">
        ⚠️
      </div>
    );
  }

  if (
    state === "login-required"
  ) {
    return (
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#decba9] bg-[#fbf5e9] text-4xl">
        🔐
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#b9dfd0] bg-[#edf8f3] text-4xl">
      ✨
    </div>
  );
}