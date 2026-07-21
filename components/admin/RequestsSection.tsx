"use client";

import Link from "next/link";

import type {
  AdminQuote,
  QuoteStatus,
} from "./types";

type RequestsSectionProps = {
  requests: AdminQuote[];
  processingId: string | null;
  onUpdateStatus: (
    quoteId: string,
    status: QuoteStatus
  ) => void;
};

function getStatusClasses(status: string | null) {
  switch (status) {
    case "confirmed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "suljettu":
      return "border-slate-200 bg-slate-100 text-slate-700";

    case "käsittelyssä":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-blue-200 bg-blue-50 text-blue-700";
  }
}

function getStatusLabel(status: string | null) {
  switch (status) {
    case "confirmed":
      return "Vahvistettu";

    case "suljettu":
      return "Suljettu";

    case "käsittelyssä":
      return "Käsittelyssä";

    default:
      return "Avoin";
  }
}

export default function RequestsSection({
  requests,
  processingId,
  onUpdateStatus,
}: RequestsSectionProps) {
  return (
    <section
      id="requests-section"
      className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          Tarjouspyynnöt
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Asiakkaiden tarjouspyynnöt
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Seuraa pyyntöjen tilaa ja niihin saapuneita
          tarjouksia.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-slate-500">
          Ei tarjouspyyntöjä.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-[850px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-4 font-semibold">
                  Päivä
                </th>
                <th className="px-4 py-4 font-semibold">
                  Alue
                </th>
                <th className="px-4 py-4 font-semibold">
                  Vieraita
                </th>
                <th className="px-4 py-4 font-semibold">
                  Tila
                </th>
                <th className="px-4 py-4 font-semibold">
                  Tarjouksia
                </th>
                <th className="px-4 py-4 font-semibold">
                  Tiedot
                </th>
                <th className="px-4 py-4 font-semibold">
                  Toiminnot
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {requests.map((request) => {
                const requestId = String(request.id);
                const processing =
                  processingId === requestId;

                return (
                  <tr
                    key={requestId}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                      {request.date || "Ei ilmoitettu"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {request.location ||
                        "Ei ilmoitettu"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {request.guests ?? "–"}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          request.status
                        )}`}
                      >
                        {getStatusLabel(
                          request.status
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-700">
                      {request.offerCount}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/quotes/${requestId}`}
                        className="font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Avaa
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      {request.status === "avoin" && (
                        <button
                          type="button"
                          disabled={processing}
                          onClick={() =>
                            onUpdateStatus(
                              requestId,
                              "käsittelyssä"
                            )
                          }
                          className="rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-amber-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processing
                            ? "Tallennetaan..."
                            : "Merkitse käsittelyyn"}
                        </button>
                      )}

                      {request.status ===
                        "käsittelyssä" && (
                        <button
                          type="button"
                          disabled={processing}
                          onClick={() =>
                            onUpdateStatus(
                              requestId,
                              "suljettu"
                            )
                          }
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processing
                            ? "Tallennetaan..."
                            : "Sulje pyyntö"}
                        </button>
                      )}

                      {request.status !== "avoin" &&
                        request.status !==
                          "käsittelyssä" && (
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