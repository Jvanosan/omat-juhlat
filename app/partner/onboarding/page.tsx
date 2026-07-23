"use client";

import Link from "next/link";
import {
  useRouter,
} from "next/navigation";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

import CompanyDetailsStep from "./components/CompanyDetailsStep";
import ImagesStep from "./components/ImagesStep";
import OnboardingProgress from "./components/OnboardingProgress";
import PricingStep from "./components/PricingStep";
import ReviewStep from "./components/ReviewStep";
import ServicesStep from "./components/ServicesStep";

import {
  STEP_TITLES,
} from "./constants";

import {
  useOnboarding,
} from "./hooks/useOnboarding";

export default function PartnerOnboardingPage() {
  const router = useRouter();

  const {
    step,
    form,
    completion,
    loadingProfile,
    validationError,
    submitState,

    updateCompany,
    setLogoUrl,
    setCoverImageUrl,
    setGalleryUrls,
    toggleCategory,
    toggleOption,
    setPricingItems,

    nextStep,
    previousStep,
    submit,
  } = useOnboarding();

  const finalStep =
    step ===
    STEP_TITLES.length - 1;

  async function handleSubmit() {
    const success =
      await submit();

    if (success) {
      router.replace(
        "/partner/dashboard",
      );
    }
  }

  if (loadingProfile) {
    return (
      <>
        <PublicHeader />

        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#fbf8f2] px-4 text-[#211b16]">
          <div
            role="status"
            className="rounded-3xl border border-[#e2d5c4] bg-white px-9 py-8 text-center shadow-[0_20px_60px_rgba(73,53,31,0.12)]"
          >
            <div
              aria-hidden="true"
              className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
            />

            <p className="mt-4 font-bold text-[#3f362f]">
              Ladataan yritysprofiilia...
            </p>

            <p className="mt-1 text-sm text-[#91877d]">
              Odota hetki.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PublicHeader />

      <main className="min-h-screen bg-[#fbf8f2] text-[#211b16]">
        <section className="relative overflow-hidden border-b border-[#eadfce] bg-gradient-to-br from-white via-[#fffaf0] to-[#f7ebe1]">
          <div
            aria-hidden="true"
            className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#ead3ad]/35 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#edccd5]/30 blur-3xl"
          />

          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a47c3c]">
                  OmatJuhlat Partner
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#211b16] sm:text-4xl">
                  Viimeistele yritysprofiilisi
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#70675e] sm:text-base">
                  Täydennä yrityksesi tiedot,
                  palvelut, kuvat ja hinnat.
                  Voit muokata tietoja myöhemmin
                  partneriportaalissa.
                </p>
              </div>

              <Link
                href="/partner/dashboard"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-[#ded3c4] bg-white px-4 py-2 text-sm font-bold text-[#62584f] shadow-sm transition hover:border-[#b48a45] hover:bg-[#fffaf2]"
              >
                Siirry dashboardille
              </Link>
            </div>

            <div className="mt-7 rounded-2xl border border-[#e2d5c4] bg-white/85 p-4 shadow-sm backdrop-blur sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#3f362f]">
                    Profiilin valmius
                  </p>

                  <p className="mt-1 text-xs text-[#91877d]">
                    Vaihe {step + 1}/
                    {STEP_TITLES.length}
                  </p>
                </div>

                <span className="text-2xl font-bold text-[#b48a45]">
                  {completion} %
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eee5d9]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c8a96a] to-[#b48a45] transition-all duration-300"
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <OnboardingProgress
            currentStep={step}
            steps={STEP_TITLES}
          />

          <section className="mt-7 overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-[0_20px_60px_rgba(73,53,31,0.1)]">
            <div className="border-b border-[#eee5d9] bg-[#fffaf2] px-5 py-5 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
                Vaihe {step + 1}
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#211b16] sm:text-2xl">
                {STEP_TITLES[step]}
              </h2>
            </div>

            <div className="px-5 py-7 text-[#211b16] sm:px-8 sm:py-9">
              {step === 0 && (
                <CompanyDetailsStep
                  form={form.company}
                  onChange={
                    updateCompany
                  }
                />
              )}

              {step === 1 && (
                <ImagesStep
                  logoUrl={form.logoUrl}
                  coverImageUrl={
                    form.coverImageUrl
                  }
                  galleryUrls={
                    form.galleryUrls
                  }
                  onLogoChange={
                    setLogoUrl
                  }
                  onCoverChange={
                    setCoverImageUrl
                  }
                  onGalleryChange={
                    setGalleryUrls
                  }
                />
              )}

              {step === 2 && (
                <ServicesStep
                  selectedCategories={
                    form.selectedCategories
                  }
                  selectedOptions={
                    form.selectedOptions
                  }
                  onToggleCategory={
                    toggleCategory
                  }
                  onToggleOption={
                    toggleOption
                  }
                />
              )}

              {step === 3 && (
                <PricingStep
                  selectedCategories={
                    form.selectedCategories
                  }
                  pricingItems={
                    form.pricingItems
                  }
                  onChange={
                    setPricingItems
                  }
                />
              )}

              {step === 4 && (
                <ReviewStep
                  company={form.company}
                  logoUrl={form.logoUrl}
                  coverImageUrl={
                    form.coverImageUrl
                  }
                  galleryUrls={
                    form.galleryUrls
                  }
                  selectedCategories={
                    form.selectedCategories
                  }
                  selectedOptions={
                    form.selectedOptions
                  }
                  pricingItems={
                    form.pricingItems
                  }
                  isSubmitting={
                    submitState.loading
                  }
                  submitError={
                    submitState.error
                  }
                />
              )}

              {validationError && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-4 text-[#a33d3d]"
                >
                  <span aria-hidden="true">
                    ⚠️
                  </span>

                  <p className="text-sm font-semibold leading-6">
                    {validationError}
                  </p>
                </div>
              )}

              {submitState.error &&
                step !== 4 && (
                  <div
                    role="alert"
                    className="mt-6 flex items-start gap-3 rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-4 text-[#a33d3d]"
                  >
                    <span aria-hidden="true">
                      ⚠️
                    </span>

                    <p className="text-sm font-semibold leading-6">
                      {submitState.error}
                    </p>
                  </div>
                )}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#eee5d9] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={
                    step === 0 ||
                    submitState.loading
                  }
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#ded3c4] bg-white px-5 py-3 text-sm font-bold text-[#62584f] transition hover:border-[#b48a45] hover:bg-[#fffaf2] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  ← Edellinen
                </button>

                {finalStep ? (
                  <button
                    type="button"
                    onClick={() =>
                      void handleSubmit()
                    }
                    disabled={
                      submitState.loading
                    }
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#168365] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#116b53] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitState.loading
                      ? "Tallennetaan..."
                      : "Tallenna ja siirry dashboardille"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      submitState.loading
                    }
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#b48a45] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#9f783a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Tallenna vaihe ja jatka →
                  </button>
                )}
              </div>
            </div>
          </section>

          <p className="mt-5 text-center text-xs leading-5 text-[#91877d]">
            Tietosi tallennetaan turvallisesti
            partneriprofiiliisi.
          </p>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}