"use client";

import Link from "next/link";

import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

import ApplicationSuccess from "@/components/partner/apply/ApplicationSuccess";
import PartnerApplicationForm from "@/components/partner/apply/PartnerApplicationForm";

import {
  usePartnerApplication,
} from "./usePartnerApplication";

export default function PartnerApplyPage() {
  const {
    form,
    loading,
    error,
    success,
    updateField,
    submit,
  } = usePartnerApplication();

  if (success) {
    return (
      <>
        <PublicHeader />
        <ApplicationSuccess />
        <PublicFooter />
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
            className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#edccd5]/30 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#87652f] transition hover:text-[#5f451f]"
            >
              <span aria-hidden="true">
                ←
              </span>

              Takaisin etusivulle
            </Link>

            <div className="mx-auto mt-8 max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#decba9] bg-white/80 px-4 py-2 text-sm font-bold text-[#87652f] shadow-sm backdrop-blur">
                <span aria-hidden="true">
                  ✓
                </span>

                Luotettu kumppanihakemus
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#211b16] sm:text-5xl lg:text-6xl">
                Kasvata liiketoimintaasi{" "}
                <span className="text-[#b48a45]">
                  OmatJuhlat-kumppanina
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#70675e] sm:text-lg">
                Tavoita tapahtumia
                suunnittelevat asiakkaat,
                vastaanota sinulle sopivia
                tarjouspyyntöjä ja esittele
                yrityksesi palvelut yhdessä
                selkeässä profiilissa.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
              <BenefitCard
                icon="📨"
                title="Sopivia tarjouspyyntöjä"
                description="Näet yrityksellesi kohdistetut asiakaspyynnöt yhdessä paikassa."
              />

              <BenefitCard
                icon="✨"
                title="Parempi näkyvyys"
                description="Esittele palvelut, kuvat, hinnat ja asiakasarvostelut."
              />

              <BenefitCard
                icon="🤝"
                title="Sinä päätät"
                description="Valitset itse, mihin tarjouspyyntöihin haluat vastata."
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <PartnerApplicationForm
            form={form}
            loading={loading}
            errorMessage={error}
            onChange={updateField}
            onSubmit={() =>
              void submit()
            }
          />
        </section>

        <section className="border-t border-[#eadfce] bg-white px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 md:grid-cols-3">
              <ProcessStep
                number="1"
                title="Lähetä hakemus"
                description="Kerro yrityksestäsi ja tarjoamistasi juhlapalveluista."
              />

              <ProcessStep
                number="2"
                title="Tarkistamme tiedot"
                description="Käymme hakemuksen läpi ja olemme yhteydessä sähköpostitse."
              />

              <ProcessStep
                number="3"
                title="Julkaise profiilisi"
                description="Hyväksymisen jälkeen viimeistelet yritysprofiilin ja aloitat tarjouspyyntöjen vastaanottamisen."
              />
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-[#e8ded0] bg-white/80 p-5 text-left shadow-sm backdrop-blur">
      <div
        aria-hidden="true"
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fbf5e9] text-xl"
      >
        {icon}
      </div>

      <h2 className="mt-4 font-bold text-[#211b16]">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#70675e]">
        {description}
      </p>
    </article>
  );
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#b48a45] font-bold text-white shadow-sm">
        {number}
      </div>

      <h2 className="mt-4 text-lg font-bold text-[#211b16]">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#70675e]">
        {description}
      </p>
    </article>
  );
}