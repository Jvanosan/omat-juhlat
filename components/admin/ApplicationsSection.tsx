"use client";

import type { PartnerApplication } from "./types";

type ApplicationsSectionProps = {
  applications: PartnerApplication[];
  processingId: string | null;
  onApprove: (
    application: PartnerApplication
  ) => void;
  onReject: (applicationId: string) => void;
};

function getStatusClasses(status: string) {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "approved":
      return "Hyväksytty";

    case "rejected":
      return "Hylätty";

    default:
      return "Odottaa";
  }
}

export default function ApplicationsSection({
  applications,
  processingId,
  onApprove,
  onReject,
}: ApplicationsSectionProps) {
  return (
    <section
      id="applications-section"
      className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
          Hakemukset
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Partnerihakemukset
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tarkista uusien yritysten tiedot ennen
          hyväksymistä.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-slate-500">
          Ei partnerihakemuksia.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-[1000px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-4 font-semibold">
                  Yritys
                </th>
                <th className="px-4 py-4 font-semibold">
                  Yhteyshenkilö
                </th>
                <th className="px-4 py-4 font-semibold">
                  Sähköposti
                </th>
                <th className="px-4 py-4 font-semibold">
                  Kaupunki
                </th>
                <th className="px-4 py-4 font-semibold">
                  Palvelu
                </th>
                <th className="px-4 py-4 font-semibold">
                  Tila
                </th>
                <th className="px-4 py-4 font-semibold">
                  Toiminnot
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {applications.map((application) => {
                const processing =
                  processingId === application.id;

                return (
                  <tr
                    key={application.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {application.company_name}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {application.contact_name || "–"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {application.email}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {application.city || "–"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {application.service_category ||
                        "–"}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          application.status
                        )}`}
                      >
                        {getStatusLabel(
                          application.status
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {application.status ===
                      "pending" ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={processing}
                            onClick={() =>
                              onApprove(application)
                            }
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {processing
                              ? "Tallennetaan..."
                              : "Hyväksy"}
                          </button>

                          <button
                            type="button"
                            disabled={processing}
                            onClick={() =>
                              onReject(application.id)
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {processing
                              ? "Tallennetaan..."
                              : "Hylkää"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Käsitelty
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}