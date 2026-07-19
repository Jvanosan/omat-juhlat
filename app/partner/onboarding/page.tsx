"use client";

import { useRouter } from "next/navigation";

import OnboardingProgress from "./components/OnboardingProgress";
import CompanyDetailsStep from "./components/CompanyDetailsStep";
import ImagesStep from "./components/ImagesStep";
import ServicesStep from "./components/ServicesStep";
import PricingStep from "./components/PricingStep";
import ReviewStep from "./components/ReviewStep";

import { STEP_TITLES } from "./constants";
import { useOnboarding } from "./hooks/useOnboarding";

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

  async function handleSubmit() {
    const success = await submit();

    if (success) {
      router.push("/partner/dashboard");
    }
  }

  if (loadingProfile) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f8f7f5",
          color: "#2c241c",
          padding: 20,
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
            }}
          >
            ⏳
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 26,
            }}
          >
            Ladataan partneriprofiilia...
          </h2>

          <p
            style={{
              marginTop: 10,
              color: "#6c655d",
            }}
          >
            Odota hetki.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f7f5",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "grid",
          gap: 30,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              color: "#2c241c",
            }}
          >
            Kumppanin käyttöönotto
          </h1>

          <p
            style={{
              marginTop: 10,
              color: "#6c655d",
              lineHeight: 1.6,
            }}
          >
            Täytä yrityksesi tiedot. Profiili lähetetään tämän
            jälkeen adminin tarkistettavaksi ennen julkaisua.
          </p>
        </div>

        <OnboardingProgress
          currentStep={step}
          steps={STEP_TITLES}
        />

        <div
          style={{
            padding: 30,
            background: "#ffffff",
            borderRadius: 18,
            border: "1px solid #e5dfd7",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
          }}
        >
          {step === 0 && (
            <CompanyDetailsStep
              form={form.company}
              onChange={updateCompany}
            />
          )}

          {step === 1 && (
            <ImagesStep
              logoUrl={form.logoUrl}
              coverImageUrl={form.coverImageUrl}
              galleryUrls={form.galleryUrls}
              onLogoChange={setLogoUrl}
              onCoverChange={setCoverImageUrl}
              onGalleryChange={setGalleryUrls}
            />
          )}

          {step === 2 && (
            <ServicesStep
              selectedCategories={form.selectedCategories}
              selectedOptions={form.selectedOptions}
              onToggleCategory={toggleCategory}
              onToggleOption={toggleOption}
            />
          )}

          {step === 3 && (
            <PricingStep
              selectedCategories={form.selectedCategories}
              pricingItems={form.pricingItems}
              onChange={setPricingItems}
            />
          )}

          {step === 4 && (
            <ReviewStep
              company={form.company}
              logoUrl={form.logoUrl}
              coverImageUrl={form.coverImageUrl}
              galleryUrls={form.galleryUrls}
              selectedCategories={form.selectedCategories}
              selectedOptions={form.selectedOptions}
              pricingItems={form.pricingItems}
              isSubmitting={submitState.loading}
              submitError={submitState.error}
            />
          )}

          {validationError && (
            <div
              style={{
                marginTop: 24,
                padding: 16,
                borderRadius: 12,
                background: "#fff4f4",
                border: "1px solid #f0b7b7",
                color: "#b42318",
                fontWeight: 600,
              }}
            >
              {validationError}
            </div>
          )}

          {submitState.error && step !== 4 && (
            <div
              style={{
                marginTop: 24,
                padding: 16,
                borderRadius: 12,
                background: "#fff4f4",
                border: "1px solid #f0b7b7",
                color: "#b42318",
                fontWeight: 600,
              }}
            >
              {submitState.error}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid #ece7df",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 0 || submitState.loading}
              style={{
                padding: "12px 22px",
                borderRadius: 10,
                border: "1px solid #d8d3cb",
                background:
                  step === 0 ? "#f3f4f6" : "#ffffff",
                color: "#374151",
                fontWeight: 600,
                cursor:
                  step === 0 || submitState.loading
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  step === 0 || submitState.loading
                    ? 0.6
                    : 1,
              }}
            >
              ← Edellinen
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                Profiili valmis: {completion} %
              </div>

              {step < STEP_TITLES.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={submitState.loading}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 10,
                    border: "none",
                    background: "#111827",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: submitState.loading
                      ? "not-allowed"
                      : "pointer",
                    opacity: submitState.loading ? 0.7 : 1,
                  }}
                >
                  Seuraava →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitState.loading}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 10,
                    border: "none",
                    background: "#16a34a",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: submitState.loading
                      ? "not-allowed"
                      : "pointer",
                    opacity: submitState.loading ? 0.7 : 1,
                  }}
                >
                  {submitState.loading
                    ? "Lähetetään..."
                    : "Lähetä tarkistettavaksi"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}