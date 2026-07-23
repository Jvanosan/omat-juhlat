"use client";

import {
  FormEvent,
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

export default function PartnerLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (session) {
        router.replace(
          getSafeDestination(),
        );

        return;
      }

      setCheckingSession(false);
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  async function login(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (
      !cleanEmail ||
      !password
    ) {
      setError(
        "Anna sähköpostiosoite ja salasana.",
      );

      return;
    }

    try {
      setLoading(true);

      const {
        error: loginError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email: cleanEmail,
            password,
          },
        );

      if (loginError) {
        throw loginError;
      }

      router.replace(
        getSafeDestination(),
      );

      router.refresh();
    } catch (loginError) {
      console.error(
        "PARTNER LOGIN ERROR:",
        loginError,
      );

      setError(
        getLoginErrorMessage(
          loginError,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PublicHeader />

      <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#fbf8f2] px-4 py-12 text-[#211b16] sm:px-6 sm:py-16">
        <div
          aria-hidden="true"
          className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#ead3ad]/35 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#edccd5]/30 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_440px]">
          <section className="hidden lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a47c3c]">
              OmatJuhlat Partner
            </p>

            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight text-[#211b16]">
              Hallitse yrityksesi{" "}
              <span className="text-[#b48a45]">
                juhlapalveluita
              </span>{" "}
              helposti.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#70675e]">
              Vastaa tarjouspyyntöihin,
              ylläpidä yritysprofiilia ja
              hallitse saatavuuttasi yhdestä
              selkeästä näkymästä.
            </p>

            <div className="mt-8 space-y-4">
              <Feature
                icon="📨"
                text="Tarjouspyynnöt ja tarjoukset yhdessä paikassa"
              />

              <Feature
                icon="📅"
                text="Helppokäyttöinen saatavuuskalenteri"
              />

              <Feature
                icon="✨"
                text="Julkinen yritysprofiili asiakkaille"
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-[0_24px_70px_rgba(73,53,31,0.14)]">
            <div className="border-b border-[#eee5d9] bg-[#fffaf2] px-6 py-7 sm:px-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fbf1df] text-2xl">
                🔐
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
                Partneriportaali
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#211b16]">
                Kirjaudu sisään
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#70675e]">
                Käytä partneritilisi
                sähköpostiosoitetta ja
                salasanaa.
              </p>
            </div>

            <form
              onSubmit={login}
              className="space-y-5 px-6 py-7 sm:px-8"
            >
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-4 text-[#a33d3d]"
                >
                  <span aria-hidden="true">
                    ⚠️
                  </span>

                  <p className="text-sm leading-6">
                    {error}
                  </p>
                </div>
              )}

              <label
                htmlFor="partner-email"
                className="block"
              >
                <span className="mb-2 block text-sm font-bold text-[#3f362f]">
                  Sähköposti
                </span>

                <input
                  id="partner-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="sinä@yritys.fi"
                  value={email}
                  disabled={
                    loading ||
                    checkingSession
                  }
                  onChange={(event) => {
                    setEmail(
                      event.target.value,
                    );

                    setError("");
                  }}
                  className="min-h-13 w-full rounded-xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3 text-[#211b16] outline-none transition placeholder:text-[#a69b90] focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>

              <label
                htmlFor="partner-password"
                className="block"
              >
                <span className="mb-2 block text-sm font-bold text-[#3f362f]">
                  Salasana
                </span>

                <div className="relative">
                  <input
                    id="partner-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="current-password"
                    placeholder="Salasanasi"
                    value={password}
                    disabled={
                      loading ||
                      checkingSession
                    }
                    onChange={(event) => {
                      setPassword(
                        event.target.value,
                      );

                      setError("");
                    }}
                    className="min-h-13 w-full rounded-xl border border-[#ded3c4] bg-[#fffdf9] py-3 pl-4 pr-20 text-[#211b16] outline-none transition placeholder:text-[#a69b90] focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current,
                      )
                    }
                    className="absolute inset-y-0 right-0 px-4 text-xs font-bold text-[#87652f] transition hover:text-[#5f451f]"
                  >
                    {showPassword
                      ? "Piilota"
                      : "Näytä"}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={
                  loading ||
                  checkingSession
                }
                className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-4 font-bold text-white shadow-[0_10px_24px_rgba(180,138,69,0.24)] transition hover:-translate-y-0.5 hover:bg-[#9f783a] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {checkingSession
                  ? "Tarkistetaan kirjautumista..."
                  : loading
                    ? "Kirjaudutaan..."
                    : "Kirjaudu sisään"}
              </button>

              <div className="border-t border-[#eee5d9] pt-5 text-center">
                <p className="text-sm text-[#70675e]">
                  Eikö yrityksesi ole vielä
                  mukana?
                </p>

                <Link
                  href="/partner/apply"
                  className="mt-2 inline-flex font-bold text-[#87652f] transition hover:text-[#5f451f]"
                >
                  Lähetä kumppanihakemus →
                </Link>
              </div>
            </form>
          </section>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}

function Feature({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e8ded0] bg-white text-lg shadow-sm"
      >
        {icon}
      </div>

      <p className="font-semibold text-[#62584f]">
        {text}
      </p>
    </div>
  );
}

function getSafeDestination() {
  if (
    typeof window === "undefined"
  ) {
    return "/partner/dashboard";
  }

  const next =
    new URLSearchParams(
      window.location.search,
    ).get("next");

  if (
    next &&
    next.startsWith("/partner/") &&
    !next.startsWith(
      "/partner/login",
    )
  ) {
    return next;
  }

  return "/partner/dashboard";
}

function getLoginErrorMessage(
  error: unknown,
) {
  if (!(error instanceof Error)) {
    return "Kirjautuminen epäonnistui. Yritä uudelleen.";
  }

  const message =
    error.message.toLowerCase();

  if (
    message.includes(
      "invalid login credentials",
    )
  ) {
    return "Sähköposti tai salasana on väärin.";
  }

  if (
    message.includes(
      "email not confirmed",
    )
  ) {
    return "Sähköpostiosoitetta ei ole vielä vahvistettu.";
  }

  if (
    message.includes(
      "too many requests",
    )
  ) {
    return "Liian monta kirjautumisyritystä. Odota hetki ja yritä uudelleen.";
  }

  return "Kirjautuminen epäonnistui. Tarkista tiedot ja yritä uudelleen.";
}