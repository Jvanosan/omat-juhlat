import Link from "next/link";

import type {
  AdminDirectRequestSummary,
} from "./direct-request-detail/types";

type DirectRequestsSectionProps = {
  requests:
    AdminDirectRequestSummary[];
};

export default function DirectRequestsSection({
  requests,
}: DirectRequestsSectionProps) {
  return (
    <section
      id="direct-requests-section"
      className="scroll-mt-6 overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-sm"
    >
      <div className="flex flex-col gap-3 border-b border-[#eee5d9] bg-[#fffaf2] px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
            Browse-pyynnöt
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#211b16]">
            Suorat tarjouspyynnöt
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#70675e]">
            Asiakkaat ovat valinneet
            palveluntarjoajat itse
            Browse-sivulta.
          </p>
        </div>

        <span className="inline-flex w-fit rounded-full border border-[#dfccec] bg-[#faf3ff] px-3 py-1.5 text-xs font-bold text-[#76508e]">
          {requests.length}{" "}
          {requests.length === 1
            ? "pyyntö"
            : "pyyntöä"}
        </span>
      </div>

      <div className="p-4 sm:p-6">
        {requests.length === 0 ? (
          <EmptyDirectRequests />
        ) : (
          <>
            <div className="space-y-4 md:hidden">
              {requests.map(
                (request) => (
                  <DirectRequestCard
                    key={request.id}
                    request={request}
                  />
                ),
              )}
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-[#e8ded0] md:block">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead className="bg-[#fffaf2] text-xs uppercase tracking-wide text-[#91877d]">
                  <tr>
                    <TableHeading>
                      Tapahtuma
                    </TableHeading>

                    <TableHeading>
                      Päivä
                    </TableHeading>

                    <TableHeading>
                      Alue
                    </TableHeading>

                    <TableHeading>
                      Vieraita
                    </TableHeading>

                    <TableHeading>
                      Tila
                    </TableHeading>

                    <TableHeading>
                      Tarjouksia
                    </TableHeading>

                    <TableHeading>
                      Tiedot
                    </TableHeading>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee5d9]">
                  {requests.map(
                    (request) => (
                      <tr
                        key={request.id}
                        className="transition hover:bg-[#fffdf9]"
                      >
                        <td className="px-4 py-4 font-bold text-[#211b16]">
                          {request.event_type ||
                            "Tapahtuma"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-[#62584f]">
                          {formatDate(
                            request.event_date,
                          )}
                        </td>

                        <td className="px-4 py-4 text-[#62584f]">
                          {request.location ||
                            "Ei ilmoitettu"}
                        </td>

                        <td className="px-4 py-4 text-[#62584f]">
                          {request.guests ??
                            "–"}
                        </td>

                        <td className="px-4 py-4">
                          <RequestStatus
                            status={
                              request.status
                            }
                          />
                        </td>

                        <td className="px-4 py-4">
                          <OfferCount
                            count={
                              request.offerCount
                            }
                          />
                        </td>

                        <td className="px-4 py-4">
                          <Link
                            href={`/admin/direct-requests/${request.id}`}
                            className="font-bold text-[#76508e] transition hover:text-[#58376d]"
                          >
                            Avaa tiedot
                          </Link>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function DirectRequestCard({
  request,
}: {
  request:
    AdminDirectRequestSummary;
}) {
  return (
    <article className="rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
            Tapahtuma
          </p>

          <h3 className="mt-1 text-xl font-bold text-[#211b16]">
            {request.event_type ||
              "Tapahtuma"}
          </h3>
        </div>

        <RequestStatus
          status={request.status}
        />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <RequestDetail
          icon="📅"
          label="Päivä"
          value={formatDate(
            request.event_date,
          )}
        />

        <RequestDetail
          icon="📍"
          label="Alue"
          value={
            request.location ||
            "Ei ilmoitettu"
          }
        />

        <RequestDetail
          icon="👥"
          label="Vieraita"
          value={String(
            request.guests ?? "–",
          )}
        />

        <RequestDetail
          icon="💬"
          label="Tarjouksia"
          value={String(
            request.offerCount,
          )}
        />
      </dl>

      <Link
        href={`/admin/direct-requests/${request.id}`}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#dfccec] bg-[#faf3ff] px-4 py-3 text-sm font-bold text-[#76508e] transition hover:border-[#b99ccc] hover:bg-[#f4e8fb]"
      >
        Avaa pyynnön tiedot
      </Link>
    </article>
  );
}

function RequestDetail({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#eee5d9] bg-white p-3">
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#91877d]">
        <span aria-hidden="true">
          {icon}
        </span>

        {label}
      </dt>

      <dd className="mt-2 break-words font-semibold text-[#3f362f]">
        {value}
      </dd>
    </div>
  );
}

function RequestStatus({
  status,
}: {
  status: string | null;
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${getStatusClasses(
        status,
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function OfferCount({
  count,
}: {
  count: number;
}) {
  return (
    <span
      className={`inline-flex min-w-8 items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ${
        count > 0
          ? "bg-[#edf8f3] text-[#11634d]"
          : "bg-[#f3f0ec] text-[#91877d]"
      }`}
    >
      {count}
    </span>
  );
}

function EmptyDirectRequests() {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8c7ad] bg-[#fffdf9] px-5 py-10 text-center">
      <div className="text-4xl">
        🔎
      </div>

      <p className="mt-4 font-bold text-[#3f362f]">
        Ei suoria tarjouspyyntöjä
      </p>

      <p className="mt-1 text-sm leading-6 text-[#91877d]">
        Browse-sivulta lähetetyt
        pyynnöt näkyvät täällä.
      </p>
    </div>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-4 font-bold">
      {children}
    </th>
  );
}

function getStatusClasses(
  status: string | null,
) {
  switch (
    status
      ?.trim()
      .toLowerCase()
  ) {
    case "accepted":
      return "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]";

    case "sent":
      return "border-[#cdddf1] bg-[#f1f6fd] text-[#284f87]";

    case "rejected":
    case "cancelled":
    case "closed":
      return "border-[#edcaca] bg-[#fff0f0] text-[#a33d3d]";

    default:
      return "border-[#ead29d] bg-[#fff8e8] text-[#795a28]";
  }
}

function getStatusLabel(
  status: string | null,
) {
  switch (
    status
      ?.trim()
      .toLowerCase()
  ) {
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

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Ei ilmoitettu";
  }

  const date = new Date(
    value.includes("T")
      ? value
      : `${value}T00:00:00`,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "fi-FI",
  ).format(date);
}