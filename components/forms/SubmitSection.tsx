"use client";

import Button from "@/components/ui/Button";

type SubmitSectionProps = {
  loading: boolean;
  errorMsg: string;
  eventComplete: boolean;
  servicesComplete: boolean;
  onSubmit: () => void;
};

export default function SubmitSection({
  loading,
  errorMsg,
  eventComplete,
  servicesComplete,
  onSubmit,
}: SubmitSectionProps) {
  const readyToSubmit = eventComplete && servicesComplete;

  return (
    <section className="bg-[#faf8f5] px-5 pb-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
            <div className="text-sm font-semibold text-gray-500">Vaihe 1</div>
            <div className="mt-1 font-bold text-gray-900">
              {eventComplete ? "✓ Tapahtuma" : "Tapahtuma"}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
            <div className="text-sm font-semibold text-gray-500">Vaihe 2</div>
            <div className="mt-1 font-bold text-gray-900">
              {servicesComplete ? "✓ Palvelut" : "Palvelut"}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
            <div className="text-sm font-semibold text-gray-500">Vaihe 3</div>
            <div className="mt-1 font-bold text-gray-900">Lähetä</div>
          </div>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800"
          >
            {errorMsg}
          </div>
        )}

        <div className="rounded-3xl border border-[#eadfc7] bg-white p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-gray-950">
            Valmis lähettämään tarjouspyynnön?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600">
            Saat tarjoukset sähköpostiisi ja voit vertailla niitä rauhassa ilman
            sitoumuksia.
          </p>

          <Button
            size="lg"
            fullWidth
            loading={loading}
            disabled={!readyToSubmit}
            onClick={onSubmit}
            className="mt-7"
          >
            ✨ Lähetä tarjouspyyntö
          </Button>

          {!readyToSubmit && (
            <p className="mt-3 text-sm text-amber-700">
              Täytä pakolliset tapahtumatiedot ja valitse vähintään yksi palvelu.
            </p>
          )}

          <div className="mt-6 grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
            <span>🔒 Tietosi käsitellään turvallisesti</span>
            <span>📧 Saat tarjoukset sähköpostiisi</span>
            <span>💬 Ei sitoumuksia</span>
          </div>
        </div>
      </div>
    </section>
  );
}