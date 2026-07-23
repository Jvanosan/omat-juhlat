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
    status: QuoteStatus,
  ) => void;
};

export default function RequestsSection({
  requests,
  processingId,
  onUpdateStatus,
}: RequestsSectionProps) {
  return (
    <section
      id="requests-section"
      className="scroll-mt-6 overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-sm"
    >
      <div className="flex flex-col gap-3 border-b border-[#eee5d9] bg-[#fffaf2] px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
            Tarjouspyynnöt
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#211b16]">
            Asiakkaiden tarjouspyynnöt
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#70675e]">
            Seuraa pyyntöjen tilaa ja
            niihin saapuneita tarjouksia.
          </p>
        </div>

        <span className="inline-flex w-fit rounded-full border border-[#decba9] bg-white px-3 py-1.5 text-xs font-bold text-[#87652f]">
          {requests.length}{" "}
          {requests.length === 1
            ? "pyyntö"
            : "pyyntöä"}
        </span>
      </div>

      <div className="p-4 sm:p-6">
        {requests.length === 0 ? (
          <EmptyRequests />
        ) : (
          <>
            <div className="space-y-4 md:hidden">
              {requests.map(
                (request) => (
                  <RequestMobileCard
                    key={String(
                      request.id,
                    )}
                    request={request}
                    processing={
                      processingId ===
                      String(
                        request.id,
                      )
                    }
                    onUpdateStatus={
                      onUpdateStatus
                    }
                  />
                ),
              )}
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-[#e8ded0] md:block">
              <table className="min-w-[880px] w-full border-collapse text-left text-sm">
                <thead className="bg-[#fffaf2] text-xs uppercase tracking-wide text-[#91877d]">
                  <tr>
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

                    <TableHeading>
                      Toiminnot
                    </TableHeading>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee5d9]">
                  {requests.map(
                    (request) => {
                      const requestId =
                        String(
                          request.id,
                        );

                      const processing =
                        processingId ===
                        requestId;

                      return (
                        <tr
                          key={
                            requestId
                          }
                          className="transition hover:bg-[#fffdf9]"
                        >
                          <td className="whitespace-nowrap px-4 py-4 font-bold text-[#3f362f]">
                            {formatDate(
                              request.date,
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
                              href={`/admin/quotes/${requestId}`}
                              className="font-bold text-[#87652f] transition hover:text-[#5f451f]"
                            >
                              Avaa tiedot
                            </Link>
                          </td>

                          <td className="px-4 py-4">
                            <StatusAction
                              requestId={
                                requestId
                              }
                              status={
                                request.status
                              }
                              processing={
                                processing
                              }
                              onUpdateStatus={
                                onUpdateStatus
                              }
                            />
                          </td>
                        </tr>
                      );
                    },
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

function RequestMobileCard({
  request,
  processing,
  onUpdateStatus,
}: {
  request: AdminQuote;
  processing: boolean;

  onUpdateStatus: (
    quoteId: string,
    status: QuoteStatus,
  ) => void;
}) {
  const requestId = String(
    request.id,
  );

  return (
    <article className="rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
            Tapahtumapäivä
          </p>

          <p className="mt-1 font-bold text-[#211b16]">
            {formatDate(
              request.date,
            )}
          </p>
        </div>

        <RequestStatus
          status={request.status}
        />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <MobileDetail
          label="Alue"
          value={
            request.location ||
            "Ei ilmoitettu"
          }
        />

        <MobileDetail
          label="Vieraita"
          value={String(
            request.guests ?? "–",
          )}
        />
      </dl>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-[#eee5d9] bg-white px-4 py-3">
        <span className="text-sm font-semibold text-[#70675e]">
          Saapuneita tarjouksia
        </span>

        <OfferCount
          count={request.offerCount}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          href={`/admin/quotes/${requestId}`}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#decba9] bg-[#fbf5e9] px-4 py-3 text-sm font-bold text-[#87652f] transition hover:border-[#b48a45] hover:bg-[#f5ead8]"
        >
          Avaa kaikki tiedot
        </Link>

        <StatusAction
          requestId={requestId}
          status={request.status}
          processing={processing}
          onUpdateStatus={
            onUpdateStatus
          }
          fullWidth
        />
      </div>
    </article>
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

function StatusAction({
  requestId,
  status,
  processing,
  fullWidth = false,
  onUpdateStatus,
}: {
  requestId: string;
  status: string | null;
  processing: boolean;
  fullWidth?: boolean;

  onUpdateStatus: (
    quoteId: string,
    status: QuoteStatus,
  ) => void;
}) {
  const widthClass =
    fullWidth ? "w-full" : "";

  if (status === "avoin") {
    return (
      <button
        type="button"
        disabled={processing}
        onClick={() =>
          onUpdateStatus(
            requestId,
            "käsittelyssä",
          )
        }
        className={`inline-flex min-h-10 items-center justify-center rounded-xl bg-[#d6a94f] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#bd913c] disabled:cursor-not-allowed disabled:opacity-50 ${widthClass}`}
      >
        {processing
          ? "Tallennetaan..."
          : "Ota käsittelyyn"}
      </button>
    );
  }

  if (
    status === "käsittelyssä"
  ) {
    return (
      <button
        type="button"
        disabled={processing}
        onClick={() =>
          onUpdateStatus(
            requestId,
            "suljettu",
          )
        }
        className={`inline-flex min-h-10 items-center justify-center rounded-xl bg-[#168365] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#116b53] disabled:cursor-not-allowed disabled:opacity-50 ${widthClass}`}
      >
        {processing
          ? "Tallennetaan..."
          : "Sulje pyyntö"}
      </button>
    );
  }

  return (
    <span
      className={`inline-flex min-h-10 items-center justify-center text-xs font-semibold text-[#91877d] ${widthClass}`}
    >
      Ei avoimia toimintoja
    </span>
  );
}

function MobileDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#eee5d9] bg-white p-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
        {label}
      </dt>

      <dd className="mt-1 break-words font-semibold text-[#3f362f]">
        {value}
      </dd>
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

function EmptyRequests() {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8c7ad] bg-[#fffdf9] px-5 py-10 text-center">
      <div className="text-4xl">
        📨
      </div>

      <p className="mt-4 font-bold text-[#3f362f]">
        Ei tarjouspyyntöjä
      </p>

      <p className="mt-1 text-sm text-[#91877d]">
        Uudet asiakkaiden
        tarjouspyynnöt näkyvät täällä.
      </p>
    </div>
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
    case "confirmed":
      return "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]";

    case "suljettu":
      return "border-[#ddd6ce] bg-[#f3f0ec] text-[#62584f]";

    case "käsittelyssä":
      return "border-[#ead29d] bg-[#fff8e8] text-[#795a28]";

    default:
      return "border-[#cdddf1] bg-[#f1f6fd] text-[#284f87]";
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