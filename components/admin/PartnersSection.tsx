"use client";

import type {
  AdminPartner,
  PartnerStatus,
} from "./types";

type PartnersSectionProps = {
  partners: AdminPartner[];
  processingId: string | null;
  onUpdateStatus: (
    partnerId: string,
    status: PartnerStatus
  ) => void;
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

export default function PartnersSection({
  partners,
  processingId,
  onUpdateStatus,
}: PartnersSectionProps) {
  return (
    <section
      id="partners-section"
      className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          Kumppanit
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Palveluntarjoajat
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Hallitse alustalle luotuja partneriprofiileja.
        </p>
      </div>

      {partners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-slate-500">
          Ei kumppaneita vielä.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-[850px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-4 font-semibold">
                  Yritys
                </th>
                <th className="px-4 py-4 font-semibold">
                  Sähköposti
                </th>
                <th className="px-4 py-4 font-semibold">
                  Alue
                </th>
                <th className="px-4 py-4 font-semibold">
                  Maks. vieraita
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
              {partners.map((partner) => {
                const processing =
                  processingId === partner.id;

                return (
                  <tr
                    key={partner.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {partner.company}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {partner.email || "–"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {partner.area || "–"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {partner.max_guests ?? "–"}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          partner.status
                        )}`}
                      >
                        {getStatusLabel(
                          partner.status
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {partner.status ===
                      "pending" ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={processing}
                            onClick={() =>
                              onUpdateStatus(
                                partner.id,
                                "approved"
                              )
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
                              onUpdateStatus(
                                partner.id,
                                "rejected"
                              )
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
                          Ei toimintoja
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