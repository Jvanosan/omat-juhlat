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

import { supabase } from "@/lib/supabase";

export default function PartnerResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    checkingLink,
    setCheckingLink,
  ] = useState(true);

  const [
    linkIsValid,
    setLinkIsValid,
  ] = useState(false);

  const [
    updating,
    setUpdating,
  ] = useState(false);

  const [
    completed,
    setCompleted,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    let active = true;

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (event, session) => {
          if (!active) {
            return;
          }

          if (
            event ===
              "PASSWORD_RECOVERY" &&
            session
          ) {
            setLinkIsValid(true);
            setCheckingLink(false);
          }
        },
      );

    async function checkRecoverySession() {
      /*
       * Supabase käsittelee palautuslinkin tokenit
       * automaattisesti URL-osoitteesta ja luo
       * lyhytaikaisen palautusistunnon.
       */
      const {
        data: { session },
        error,
      } =
        await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (error) {
        console.error(
          "PASSWORD RECOVERY SESSION ERROR:",
          error,
        );

        setLinkIsValid(false);
        setCheckingLink(false);

        return;
      }

      if (session) {
        setLinkIsValid(true);
      }

      setCheckingLink(false);
    }

    void checkRecoverySession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function updatePassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (updating) {
      return;
    }

    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "Salasanassa täytyy olla vähintään 8 merkkiä.",
      );

      return;
    }

    if (
      password !==
      passwordConfirmation
    ) {
      setErrorMessage(
        "Salasanat eivät täsmää.",
      );

      return;
    }

    try {
      setUpdating(true);

      const {
        data: { session },
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (
        sessionError ||
        !session
      ) {
        throw new Error(
          "Palautuslinkki ei ole enää voimassa.",
        );
      }

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        throw error;
      }

      setCompleted(true);
      setPassword("");
      setPasswordConfirmation("");

      /*
       * Palautusistunto suljetaan, jotta käyttäjä
       * kirjautuu uudella salasanalla normaalisti.
       */
      await supabase.auth.signOut();
    } catch (error) {
      console.error(
        "PARTNER PASSWORD RESET ERROR:",
        error,
      );

      setErrorMessage(
        getPasswordResetErrorMessage(
          error,
        ),
      );
    } finally {
      setUpdating(false);
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

        <div className="relative mx-auto max-w-md">
          <section className="overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-[0_24px_70px_rgba(73,53,31,0.14)]">
            <div className="border-b border-[#eee5d9] bg-[#fffaf2] px-6 py-7 sm:px-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fbf1df] text-2xl">
                🔐
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
                Partneriportaali
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#211b16]">
                Aseta uusi salasana
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#70675e]">
                Valitse partneritilillesi
                uusi turvallinen salasana.
              </p>
            </div>

            {checkingLink ? (
              <div
                role="status"
                className="px-6 py-10 text-center sm:px-8"
              >
                <div
                  aria-hidden="true"
                  className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
                />

                <p className="mt-4 font-bold text-[#3f362f]">
                  Tarkistetaan
                  palautuslinkkiä...
                </p>
              </div>
            ) : completed ? (
              <div className="px-6 py-8 sm:px-8">
                <div
                  role="status"
                  className="rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-5 text-[#11634d]"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="text-xl"
                    >
                      ✅
                    </span>

                    <div>
                      <h2 className="font-bold">
                        Salasana vaihdettu
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-[#41685d]">
                        Uusi salasanasi on
                        tallennettu. Voit nyt
                        kirjautua sillä
                        partneriportaaliin.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    router.replace(
                      "/partner/login",
                    );

                    router.refresh();
                  }}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-5 py-3 font-bold text-white transition hover:bg-[#9f783a]"
                >
                  Siirry kirjautumaan
                </button>
              </div>
            ) : !linkIsValid ? (
              <div className="px-6 py-8 sm:px-8">
                <div
                  role="alert"
                  className="rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-5 text-[#a33d3d]"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="text-xl"
                    >
                      ⚠️
                    </span>

                    <div>
                      <h2 className="font-bold">
                        Linkki ei ole voimassa
                      </h2>

                      <p className="mt-2 text-sm leading-6">
                        Salasanan
                        palautuslinkki on
                        vanhentunut, käytetty
                        tai virheellinen.
                        Pyydä uusi linkki.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/partner/forgot-password"
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-5 py-3 text-center font-bold text-white transition hover:bg-[#9f783a]"
                >
                  Pyydä uusi palautuslinkki
                </Link>

                <Link
                  href="/partner/login"
                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center text-sm font-bold text-[#87652f] transition hover:text-[#5f451f]"
                >
                  Takaisin kirjautumiseen
                </Link>
              </div>
            ) : (
              <form
                onSubmit={updatePassword}
                className="space-y-5 px-6 py-7 sm:px-8"
              >
                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-4 text-[#a33d3d]"
                  >
                    <span aria-hidden="true">
                      ⚠️
                    </span>

                    <p className="text-sm leading-6">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <label
                  htmlFor="new-password"
                  className="block"
                >
                  <span className="mb-2 block text-sm font-bold text-[#3f362f]">
                    Uusi salasana
                  </span>

                  <div className="relative">
                    <input
                      id="new-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Vähintään 8 merkkiä"
                      value={password}
                      disabled={updating}
                      onChange={(event) => {
                        setPassword(
                          event.target.value,
                        );

                        setErrorMessage("");
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
                      disabled={updating}
                      className="absolute inset-y-0 right-0 px-4 text-xs font-bold text-[#87652f] transition hover:text-[#5f451f] disabled:opacity-60"
                    >
                      {showPassword
                        ? "Piilota"
                        : "Näytä"}
                    </button>
                  </div>
                </label>

                <label
                  htmlFor="new-password-confirmation"
                  className="block"
                >
                  <span className="mb-2 block text-sm font-bold text-[#3f362f]">
                    Uusi salasana uudelleen
                  </span>

                  <input
                    id="new-password-confirmation"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Kirjoita salasana uudelleen"
                    value={
                      passwordConfirmation
                    }
                    disabled={updating}
                    onChange={(event) => {
                      setPasswordConfirmation(
                        event.target.value,
                      );

                      setErrorMessage("");
                    }}
                    className="min-h-13 w-full rounded-xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3 text-[#211b16] outline-none transition placeholder:text-[#a69b90] focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <div className="rounded-2xl border border-[#ead29d] bg-[#fff8e8] p-4 text-sm leading-6 text-[#795a28]">
                  Salasanassa täytyy olla
                  vähintään 8 merkkiä. Käytä
                  mieluiten kirjaimia,
                  numeroita ja erikoismerkkejä.
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-4 font-bold text-white shadow-[0_10px_24px_rgba(180,138,69,0.24)] transition hover:-translate-y-0.5 hover:bg-[#9f783a] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {updating
                    ? "Tallennetaan salasanaa..."
                    : "Tallenna uusi salasana"}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}

function getPasswordResetErrorMessage(
  error: unknown,
) {
  if (!(error instanceof Error)) {
    return "Salasanan vaihtaminen epäonnistui. Pyydä uusi palautuslinkki.";
  }

  const message =
    error.message.toLowerCase();

  if (
    message.includes(
      "same password",
    )
  ) {
    return "Uuden salasanan täytyy olla eri kuin nykyinen salasanasi.";
  }

  if (
    message.includes(
      "weak password",
    )
  ) {
    return "Salasana ei ole riittävän turvallinen. Valitse vahvempi salasana.";
  }

  if (
    message.includes(
      "expired",
    ) ||
    message.includes(
      "not valid",
    ) ||
    message.includes(
      "session",
    )
  ) {
    return "Palautuslinkki ei ole enää voimassa. Pyydä uusi linkki.";
  }

  return "Salasanan vaihtaminen epäonnistui. Yritä uudelleen.";
}