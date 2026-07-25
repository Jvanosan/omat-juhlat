"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

import { supabase } from "@/lib/supabase";

export default function PartnerForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  async function sendResetLink(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (sending) {
      return;
    }

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage(
        "Anna partneritilisi sähköpostiosoite.",
      );

      return;
    }

    try {
      setSending(true);
      setErrorMessage("");

      const redirectTo =
        `${window.location.origin}/partner/reset-password`;

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo,
          },
        );

      if (error) {
        throw error;
      }

      /*
       * Näytetään sama onnistumisviesti riippumatta siitä,
       * löytyykö sähköpostilla käyttäjää. Tämä estää
       * partneritilien sähköpostiosoitteiden selvittämisen.
       */
      setSuccess(true);
    } catch (error) {
      console.error(
        "PARTNER PASSWORD RESET REQUEST ERROR:",
        error,
      );

      setErrorMessage(
        getResetErrorMessage(error),
      );
    } finally {
      setSending(false);
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
          <Link
            href="/partner/login"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#87652f] transition hover:text-[#5f451f]"
          >
            <span aria-hidden="true">
              ←
            </span>

            Takaisin kirjautumiseen
          </Link>

          <section className="overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-[0_24px_70px_rgba(73,53,31,0.14)]">
            <div className="border-b border-[#eee5d9] bg-[#fffaf2] px-6 py-7 sm:px-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fbf1df] text-2xl">
                🔑
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
                Partneriportaali
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#211b16]">
                Unohditko salasanasi?
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#70675e]">
                Anna partneritilisi
                sähköpostiosoite. Lähetämme
                sähköpostiisi turvallisen
                linkin uuden salasanan
                asettamista varten.
              </p>
            </div>

            {success ? (
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
                        Tarkista sähköpostisi
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-[#41685d]">
                        Jos osoitteella{" "}
                        <strong>
                          {email.trim()}
                        </strong>{" "}
                        on partneritili,
                        lähetimme siihen
                        salasanan palautuslinkin.
                      </p>

                      <p className="mt-3 text-xs leading-5 text-[#5c7c70]">
                        Tarkista myös
                        roskapostikansio. Linkki
                        voi saapua muutaman
                        minuutin viiveellä.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/partner/login"
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-5 py-3 font-bold text-white transition hover:bg-[#9f783a]"
                >
                  Takaisin kirjautumiseen
                </Link>
              </div>
            ) : (
              <form
                onSubmit={sendResetLink}
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
                  htmlFor="reset-email"
                  className="block"
                >
                  <span className="mb-2 block text-sm font-bold text-[#3f362f]">
                    Sähköposti
                  </span>

                  <input
                    id="reset-email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="sinä@yritys.fi"
                    value={email}
                    disabled={sending}
                    onChange={(event) => {
                      setEmail(
                        event.target.value,
                      );

                      setErrorMessage("");
                    }}
                    className="min-h-13 w-full rounded-xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3 text-[#211b16] outline-none transition placeholder:text-[#a69b90] focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-4 font-bold text-white shadow-[0_10px_24px_rgba(180,138,69,0.24)] transition hover:-translate-y-0.5 hover:bg-[#9f783a] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {sending
                    ? "Lähetetään linkkiä..."
                    : "Lähetä palautuslinkki"}
                </button>

                <div className="border-t border-[#eee5d9] pt-5 text-center">
                  <Link
                    href="/partner/login"
                    className="font-bold text-[#87652f] transition hover:text-[#5f451f]"
                  >
                    Muistin salasanani →
                  </Link>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}

function getResetErrorMessage(
  error: unknown,
) {
  if (!(error instanceof Error)) {
    return "Palautuslinkin lähettäminen epäonnistui. Yritä uudelleen.";
  }

  const message =
    error.message.toLowerCase();

  if (
    message.includes(
      "rate limit",
    ) ||
    message.includes(
      "too many requests",
    )
  ) {
    return "Palautuslinkkiä on pyydetty liian monta kertaa. Odota hetki ja yritä uudelleen.";
  }

  return "Palautuslinkin lähettäminen epäonnistui. Yritä uudelleen.";
}