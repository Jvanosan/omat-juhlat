"use client";

import Link from "next/link";

import SectionHeader from "@/components/partner/SectionHeader";

import {
  AccountSettingsCard,
  NotificationSettingsCard,
  PasswordSettingsCard,
  SessionSettingsCard,
} from "@/components/partner/settings/SettingsCards";

import {
  usePartnerSettings,
} from "./usePartnerSettings";

export default function PartnerSettingsPage() {
  const {
    account,
    loading,
    updatingPassword,
    loggingOut,
    errorMessage,
    successMessage,

    updatePassword,
    logout,
    reload,
    clearMessages,
  } = usePartnerSettings();

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div
          role="status"
          className="rounded-3xl border border-[#e2d5c4] bg-white px-8 py-10 text-center shadow-sm"
        >
          <div
            aria-hidden="true"
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
          />

          <p className="mt-4 font-bold text-[#3f362f]">
            Ladataan asetuksia...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <Link
          href="/partner/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#87652f] transition hover:text-[#5f451f]"
        >
          <span aria-hidden="true">
            ←
          </span>

          Takaisin dashboardille
        </Link>
      </div>

      <SectionHeader
        title="Asetukset"
        description="Hallitse partneritiliäsi, salasanaa ja kirjautumista."
      />

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-5 text-[#a33d3d] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <span aria-hidden="true">
              ⚠️
            </span>

            <p className="text-sm font-semibold leading-6">
              {errorMessage}
            </p>
          </div>

          {!account && (
            <button
              type="button"
              onClick={() =>
                void reload()
              }
              className="shrink-0 rounded-xl bg-[#a33d3d] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#8d3030]"
            >
              Yritä uudelleen
            </button>
          )}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-5 text-[#11634d]"
        >
          <span aria-hidden="true">
            ✅
          </span>

          <p className="text-sm font-semibold leading-6">
            {successMessage}
          </p>
        </div>
      )}

      {account ? (
        <div className="space-y-6">
          <AccountSettingsCard
            company={
              account.company
            }
            email={account.email}
            slug={account.slug}
            status={account.status}
            profileCompleted={
              account.profile_completed
            }
          />

          <PasswordSettingsCard
            processing={
              updatingPassword
            }
            onUpdate={
              updatePassword
            }
            onClearMessages={
              clearMessages
            }
          />

          <NotificationSettingsCard />

          <SessionSettingsCard
            loggingOut={loggingOut}
            onLogout={() =>
              void logout()
            }
          />
        </div>
      ) : (
        <section className="rounded-3xl border border-[#e2d5c4] bg-white p-8 text-center shadow-sm">
          <div className="text-4xl">
            ⚠️
          </div>

          <h2 className="mt-4 text-xl font-bold text-[#211b16]">
            Tilin tietoja ei voitu näyttää
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#70675e]">
            Päivitä tiedot tai kirjaudu
            uudelleen partneritilille.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                void reload()
              }
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#b48a45] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#9f783a]"
            >
              Päivitä tiedot
            </button>

            <Link
              href="/partner/login"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#ded3c4] bg-white px-5 py-3 text-sm font-bold text-[#62584f] transition hover:border-[#b48a45] hover:bg-[#fffaf2]"
            >
              Siirry kirjautumiseen
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}