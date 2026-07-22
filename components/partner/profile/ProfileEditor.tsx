"use client";

import { useState } from "react";

import CompanyDetailsStep from "@/app/partner/onboarding/components/CompanyDetailsStep";
import ImagesStep from "@/app/partner/onboarding/components/ImagesStep";
import PricingStep from "@/app/partner/onboarding/components/PricingStep";
import ServicesStep from "@/app/partner/onboarding/components/ServicesStep";

import { useOnboarding } from "@/app/partner/onboarding/hooks/useOnboarding";

export default function ProfileEditor() {
  const {
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
    submit,
  } = useOnboarding();

  const [saved, setSaved] =
    useState(false);

  const safeCompletion = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        Number(completion) || 0,
      ),
    ),
  );

  async function handleSave() {
    setSaved(false);

    const success = await submit({
      validateAllSteps: true,
      updateOnboardingTimestamp: false,
    });

    if (!success) {
      return;
    }

    setSaved(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (loadingProfile) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-[#e8ded0] bg-white p-10 text-center shadow-sm"
      >
        <span
          aria-hidden="true"
          className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
        />

        <p className="mt-4 font-bold text-[#211b16]">
          Ladataan yritysprofiilia...
        </p>

        <p className="mt-1 text-sm text-[#70675e]">
          Haetaan tallennetut tiedot.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <section className="rounded-3xl border border-[#e8ded0] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a773b]">
              Profiilin näkyvyys
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#211b16]">
              Profiilin valmius
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#70675e]">
              Täydennä kaikki olennaiset
              tiedot, jotta asiakkaat saavat
              yrityksestäsi luotettavan ja
              kattavan kuvan.
            </p>
          </div>

          <span className="text-3xl font-black text-[#168365]">
            {safeCompletion} %
          </span>
        </div>

        <div
          className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#eee8df]"
          role="progressbar"
          aria-label="Profiilin valmius"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={
            safeCompletion
          }
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#20a77c] to-[#64c7a8] transition-all"
            style={{
              width: `${safeCompletion}%`,
            }}
          />
        </div>
      </section>

      <ProfileNavigation />

      {saved && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-5 text-[#11634d]"
        >
          <span
            aria-hidden="true"
            className="text-xl"
          >
            ✓
          </span>

          <div>
            <p className="font-bold">
              Yritysprofiili tallennettiin
            </p>

            <p className="mt-1 text-sm leading-6 text-[#41685d]">
              Päivitetyt tiedot ovat nyt
              tallessa.
            </p>
          </div>
        </div>
      )}

      {(validationError ||
        submitState.error) && (
        <div
          role="alert"
          className="rounded-2xl border border-[#edcaca] bg-[#fff3f3] p-5 text-[#a33d3d]"
        >
          <p className="font-bold">
            Tarkista profiilin tiedot
          </p>

          <p className="mt-1 text-sm leading-6">
            {validationError ||
              submitState.error}
          </p>
        </div>
      )}

      <EditorSection
        id="profile-company"
        icon="🏢"
        title="Yrityksen perustiedot"
        description="Yrityksen nimi, yhteystiedot, toiminta-alueet ja esittely."
      >
        <CompanyDetailsStep
          form={form.company}
          onChange={updateCompany}
        />
      </EditorSection>

      <EditorSection
        id="profile-images"
        icon="📷"
        title="Logo ja kuvat"
        description="Lisää laadukas logo, kansikuva ja kuvia palveluistasi."
      >
        <ImagesStep
          logoUrl={form.logoUrl}
          coverImageUrl={
            form.coverImageUrl
          }
          galleryUrls={
            form.galleryUrls
          }
          onLogoChange={setLogoUrl}
          onCoverChange={
            setCoverImageUrl
          }
          onGalleryChange={
            setGalleryUrls
          }
        />
      </EditorSection>

      <EditorSection
        id="profile-services"
        icon="✨"
        title="Palvelut"
        description="Valitse vain palvelut, joita yrityksesi todella tarjoaa."
      >
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
      </EditorSection>

      <EditorSection
        id="profile-pricing"
        icon="💶"
        title="Hinnoittelu"
        description="Anna asiakkaille selkeä kuva palvelujesi hinnoittelusta."
      >
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
      </EditorSection>

      <div className="sticky bottom-4 z-20 rounded-2xl border border-[#dfcfb6] bg-white/95 p-4 shadow-[0_18px_50px_rgba(73,53,31,0.18)] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[#70675e]">
            Tarkista tiedot ennen
            tallentamista. Pakolliset kentät
            on merkitty tähdellä.
          </p>

          <button
            type="button"
            onClick={() =>
              void handleSave()
            }
            disabled={
              submitState.loading
            }
            className="inline-flex min-h-13 shrink-0 items-center justify-center rounded-xl bg-[#168365] px-6 py-3 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#116b53] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {submitState.loading
              ? "Tallennetaan..."
              : "Tallenna profiilin muutokset"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileNavigation() {
  const links = [
    {
      href: "#profile-company",
      label: "Perustiedot",
      icon: "🏢",
    },
    {
      href: "#profile-images",
      label: "Kuvat",
      icon: "📷",
    },
    {
      href: "#profile-services",
      label: "Palvelut",
      icon: "✨",
    },
    {
      href: "#profile-pricing",
      label: "Hinnoittelu",
      icon: "💶",
    },
  ];

  return (
    <nav
      aria-label="Profiilin osiot"
      className="flex gap-2 overflow-x-auto rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-3"
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#e8ded0] bg-white px-4 text-sm font-bold text-[#62584f] transition hover:border-[#b48a45] hover:text-[#795a28]"
        >
          <span aria-hidden="true">
            {link.icon}
          </span>

          {link.label}
        </a>
      ))}
    </nav>
  );
}

function EditorSection({
  id,
  icon,
  title,
  description,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-40 overflow-hidden rounded-3xl border border-[#e8ded0] bg-white shadow-sm"
    >
      <div className="border-b border-[#eee5d9] bg-[#fffdf9] px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2d8]"
          >
            {icon}
          </span>

          <div>
            <h2 className="text-xl font-bold text-[#211b16]">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#70675e]">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 text-[#211b16] sm:p-7">
        {children}
      </div>
    </section>
  );
}