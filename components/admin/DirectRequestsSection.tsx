import Link from "next/link";

import type { AdminDirectRequestSummary } from "./direct-request-detail/types";

type DirectRequestsSectionProps = {
  requests: AdminDirectRequestSummary[];
};

function getStatusClasses(status: string | null) {
  switch (status?.toLowerCase()) {
    case "accepted":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "sent":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "rejected":
    case "cancelled":
    case "closed":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getStatusLabel(status: string | null) {
  switch (status?.toLowerCase()) {
    case "new":
    case "pending":
      return "Uusi";

    case "sent":
      return "Tarjouksia lähetetty";

    case "accepted":
      return "Hyväksytty";

    case "rejected":
      return "Hylätty";

    case "cancelled":
      return "Peruutettu";

    case "closed":
      return "Suljettu";

    default:
      return status || "Uusi";
  }
}

function formatDate(value: string | null) {
  if (!value) return "Ei ilmoitettu";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fi-FI").format(date);
}

export default function DirectRequestsSection({
  requests,
}: DirectRequestsSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600">
          Browse-pyynnöt
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Suorat tarjouspyynnöt
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Asiakkaat ovat valinneet palveluntarjoajat itse
          Browse-sivulta.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-slate-500">
          Ei suoria tarjouspyyntöjä.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-4 font-semibold">
                  Tapahtuma
                </th>

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
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {request.event_type || "Tapahtuma"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {formatDate(request.event_date)}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {request.location || "Ei ilmoitettu"}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {request.guests ?? "–"}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        request.status,
                      )}`}
                    >
                      {getStatusLabel(request.status)}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-semibold text-slate-700">
                    {request.offerCount}
                  </td>

                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/direct-requests/${request.id}`}
                      className="font-semibold text-purple-600 transition hover:text-purple-800"
                    >
                      Avaa tiedot
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}