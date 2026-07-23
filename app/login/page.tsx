"use client";

import {
  FormEvent,
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

export default function LoginPage() {
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

  const [error, setError] =
    useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

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
      setError("");

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

      router.replace("/admin");
      router.refresh();
    } catch (loginError) {
      console.error(
        "ADMIN LOGIN ERROR:",
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

      <main className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden bg-[#fbf8f2] px-4 py-12 text-[#211b16] sm:px-6">
        <div
          aria-hidden="true"
          className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#ead3ad]/35 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#edccd5]/30 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-md">
          <section className="overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-[0_24px_70px_rgba(73,53,31,0.14)]">
            <div className="border-b border-[#eee5d9] bg-gradient-to-br from-[#fffaf2] via-white to-[#f8eee5] px-6 py-8 text-center sm:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#decba9] bg-white text-3xl shadow-sm">
                🔐
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a47c3c]">
                OmatJuhlat Admin
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#211b16]">
                Kirjaudu hallintaan
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#70675e]">
                Tämä näkymä on vain
                valtuutetulle ylläpitäjälle.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
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

                  <p className="text-sm font-semibold leading-6">
                    {error}
                  </p>
                </div>
              )}

              <label
                htmlFor="admin-email"
                className="block"
              >
                <span className="mb-2 block text-sm font-bold text-[#3f362f]">
                  Sähköposti
                </span>

                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="admin@omatjuhlat.fi"
                  value={email}
                  disabled={loading}
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
                htmlFor="admin-password"
                className="block"
              >
                <span className="mb-2 block text-sm font-bold text-[#3f362f]">
                  Salasana
                </span>

                <div className="relative">
                  <input
                    id="admin-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="current-password"
                    placeholder="Salasanasi"
                    value={password}
                    disabled={loading}
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
                disabled={loading}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-4 font-bold text-white shadow-[0_10px_24px_rgba(180,138,69,0.24)] transition hover:-translate-y-0.5 hover:bg-[#9f783a] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading
                  ? "Kirjaudutaan..."
                  : "Kirjaudu adminiin"}
              </button>

              <div className="rounded-2xl border border-[#e8ded0] bg-[#fffaf2] p-4">
                <p className="text-center text-xs leading-5 text-[#70675e]">
                  Admin-oikeus tarkistetaan
                  kirjautumisen jälkeen
                  turvallisesti palvelimella.
                  Tavallinen partneritili ei
                  pääse hallintapaneeliin.
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex min-h-11 w-full items-center justify-center text-sm font-bold text-[#87652f] transition hover:text-[#5f451f]"
              >
                ← Palaa etusivulle
              </Link>
            </form>
          </section>
        </div>
      </main>

      <PublicFooter />
    </>
  );
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