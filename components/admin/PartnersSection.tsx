"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  AdminPartner,
  PartnerStatus,
} from "./types";

type PartnersSectionProps = {
  partners: AdminPartner[];
  processingId: string | null;

  onUpdateStatus: (
    partnerId: string,
    status: PartnerStatus,
  ) => void;
};

type PartnerFilter =
  | "all"
  | "approved"
  | "pending"
  | "rejected";

export default function PartnersSection({
  partners,
  processingId,
  onUpdateStatus,
}: PartnersSectionProps) {
  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<PartnerFilter>(
      "all",
    );

  const visiblePartners =
    useMemo(() => {
      const searchTerm =
        search
          .trim()
          .toLowerCase();

      return partners
        .filter((partner) => {
          if (
            filter !== "all" &&
            partner.status !== filter
          ) {
            return false;
          }

          if (!searchTerm) {
            return true;
          }

          return [
            partner.company,
            partner.email,
            partner.area,
          ].some((value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(searchTerm),
          );
        })
        .sort((first, second) => {
          if (
            first.status ===
              "pending" &&
            second.status !==
              "pending"
          ) {
            return -1;
          }

          if (
            second.status ===
              "pending" &&
            first.status !==
              "pending"
          ) {
            return 1;
          }

          return first.company.localeCompare(
            second.company,
            "fi",
          );
        });
    }, [partners, search, filter]);

  function updateStatus(
    partner: AdminPartner,
    status: PartnerStatus,
  ) {
    const action =
      status === "approved"
        ? "hyväksytään"
        : "hylätään";

    const confirmed =
      window.confirm(
        `${action[0].toUpperCase()}${action.slice(
          1,
        )}kö yrityksen "${partner.company}" partneriprofiili?`,
      );

    if (confirmed) {
      onUpdateStatus(
        partner.id,
        status,
      );
    }
  }

  return (
    <section
      id="partners-section"
      className="scroll-mt-6 overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-sm"
    >
      <div className="flex flex-col gap-3 border-b border-[#eee5d9] bg-[#fffaf2] px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
            Kumppanit
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#211b16]">
            Palveluntarjoajat
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#70675e]">
            Etsi yrityksiä ja hallitse
            partneriprofiilien hyväksyntää.
          </p>
        </div>

        <span className="inline-flex w-fit rounded-full border border-[#b9dfd0] bg-[#edf8f3] px-3 py-1.5 text-xs font-bold text-[#11634d]">
          {partners.length}{" "}
          {partners.length === 1
            ? "kumppani"
            : "kumppania"}
        </span>
      </div>

      <div className="border-b border-[#eee5d9] px-4 py-4 sm:px-6">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <label className="block">
            <span className="sr-only">
              Etsi kumppania
            </span>

            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-4 flex items-center"
              >
                🔍
              </span>

              <input
                type="search"
                value={search}
                placeholder="Etsi yrityksen, sähköpostin tai alueen perusteella"
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                className="min-h-12 w-full rounded-xl border border-[#ded3c4] bg-[#fffdf9] py-3 pl-11 pr-4 text-sm text-[#211b16] outline-none transition placeholder:text-[#a69b90] focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35"
              />
            </div>
          </label>

          <label className="block">
            <span className="sr-only">
              Suodata tilan mukaan
            </span>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target
                    .value as PartnerFilter,
                )
              }
              className="min-h-12 w-full rounded-xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3 text-sm font-semibold text-[#3f362f] outline-none transition focus:border-[#b48a45] focus:ring-4 focus:ring-[#ead8b8]/35"
            >
              <option value="all">
                Kaikki tilat
              </option>

              <option value="pending">
                Odottaa
              </option>

              <option value="approved">
                Hyväksytyt
              </option>

              <option value="rejected">
                Hylätyt
              </option>
            </select>
          </label>
        </div>

        {(search ||
          filter !== "all") && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[#91877d]">
              Näytetään{" "}
              {visiblePartners.length}/
              {partners.length}
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="text-xs font-bold text-[#87652f] transition hover:text-[#5f451f]"
            >
              Tyhjennä suodattimet
            </button>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        {partners.length === 0 ? (
          <EmptyPartners
            title="Ei kumppaneita vielä"
            description="Hyväksytyt palveluntarjoajat näkyvät täällä."
          />
        ) : visiblePartners.length ===
          0 ? (
          <EmptyPartners
            title="Ei hakutuloksia"
            description="Muuta hakusanaa tai poista suodatin."
          />
        ) : (
          <>
            <div className="space-y-4 lg:hidden">
              {visiblePartners.map(
                (partner) => (
                  <PartnerMobileCard
                    key={partner.id}
                    partner={partner}
                    processing={
                      processingId ===
                      partner.id
                    }
                    onApprove={() =>
                      updateStatus(
                        partner,
                        "approved",
                      )
                    }
                    onReject={() =>
                      updateStatus(
                        partner,
                        "rejected",
                      )
                    }
                  />
                ),
              )}
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-[#e8ded0] lg:block">
              <table className="min-w-[900px] w-full border-collapse text-left text-sm">
                <thead className="bg-[#fffaf2] text-xs uppercase tracking-wide text-[#91877d]">
                  <tr>
                    <TableHeading>
                      Yritys
                    </TableHeading>

                    <TableHeading>
                      Sähköposti
                    </TableHeading>

                    <TableHeading>
                      Alue
                    </TableHeading>

                    <TableHeading>
                      Kapasiteetti
                    </TableHeading>

                    <TableHeading>
                      Tila
                    </TableHeading>

                    <TableHeading>
                      Toiminnot
                    </TableHeading>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee5d9]">
                  {visiblePartners.map(
                    (partner) => {
                      const processing =
                        processingId ===
                        partner.id;

                      return (
                        <tr
                          key={
                            partner.id
                          }
                          className="transition hover:bg-[#fffdf9]"
                        >
                          <td className="px-4 py-4 font-bold text-[#211b16]">
                            {
                              partner.company
                            }
                          </td>

                          <td className="px-4 py-4">
                            {partner.email ? (
                              <a
                                href={`mailto:${partner.email}`}
                                className="break-all font-semibold text-[#87652f] transition hover:text-[#5f451f]"
                              >
                                {
                                  partner.email
                                }
                              </a>
                            ) : (
                              <span className="text-[#91877d]">
                                Ei ilmoitettu
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4 text-[#62584f]">
                            {partner.area ||
                              "Ei ilmoitettu"}
                          </td>

                          <td className="px-4 py-4 text-[#62584f]">
                            {partner.max_guests
                              ? `${partner.max_guests} hlö`
                              : "Ei ilmoitettu"}
                          </td>

                          <td className="px-4 py-4">
                            <PartnerStatus
                              status={
                                partner.status
                              }
                            />
                          </td>

                          <td className="px-4 py-4">
                            <PartnerActions
                              status={
                                partner.status
                              }
                              processing={
                                processing
                              }
                              onApprove={() =>
                                updateStatus(
                                  partner,
                                  "approved",
                                )
                              }
                              onReject={() =>
                                updateStatus(
                                  partner,
                                  "rejected",
                                )
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

function PartnerMobileCard({
  partner,
  processing,
  onApprove,
  onReject,
}: {
  partner: AdminPartner;
  processing: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <article className="rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
            Palveluntarjoaja
          </p>

          <h3 className="mt-1 text-xl font-bold text-[#211b16]">
            {partner.company}
          </h3>
        </div>

        <PartnerStatus
          status={partner.status}
        />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <PartnerDetail
          label="Alue"
          value={
            partner.area ||
            "Ei ilmoitettu"
          }
        />

        <PartnerDetail
          label="Maksimikapasiteetti"
          value={
            partner.max_guests
              ? `${partner.max_guests} henkilöä`
              : "Ei ilmoitettu"
          }
        />
      </dl>

      {partner.email && (
        <a
          href={`mailto:${partner.email}`}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#decba9] bg-white px-4 py-3 text-sm font-bold text-[#87652f] transition hover:border-[#b48a45] hover:bg-[#fffaf2]"
        >
          ✉️ {partner.email}
        </a>
      )}

      <div className="mt-5">
        <PartnerActions
          status={partner.status}
          processing={processing}
          onApprove={onApprove}
          onReject={onReject}
          fullWidth
        />
      </div>
    </article>
  );
}

function PartnerActions({
  status,
  processing,
  onApprove,
  onReject,
  fullWidth = false,
}: {
  status: string;
  processing: boolean;
  onApprove: () => void;
  onReject: () => void;
  fullWidth?: boolean;
}) {
  if (status !== "pending") {
    return (
      <span className="inline-flex min-h-10 items-center text-xs font-semibold text-[#91877d]">
        Ei avoimia toimintoja
      </span>
    );
  }

  return (
    <div
      className={`flex gap-2 ${
        fullWidth
          ? "flex-col sm:flex-row"
          : "flex-wrap"
      }`}
    >
      <button
        type="button"
        disabled={processing}
        onClick={onApprove}
        className={`inline-flex min-h-10 items-center justify-center rounded-xl bg-[#168365] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#116b53] disabled:cursor-not-allowed disabled:opacity-50 ${
          fullWidth
            ? "flex-1"
            : ""
        }`}
      >
        {processing
          ? "Tallennetaan..."
          : "Hyväksy"}
      </button>

      <button
        type="button"
        disabled={processing}
        onClick={onReject}
        className={`inline-flex min-h-10 items-center justify-center rounded-xl border border-[#edcaca] bg-[#fff4f4] px-4 py-2 text-xs font-bold text-[#a33d3d] transition hover:bg-[#ffeaea] disabled:cursor-not-allowed disabled:opacity-50 ${
          fullWidth
            ? "flex-1"
            : ""
        }`}
      >
        {processing
          ? "Tallennetaan..."
          : "Hylkää"}
      </button>
    </div>
  );
}

function PartnerStatus({
  status,
}: {
  status: string;
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

function PartnerDetail({
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

function EmptyPartners({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8c7ad] bg-[#fffdf9] px-5 py-10 text-center">
      <div className="text-4xl">
        🤝
      </div>

      <p className="mt-4 font-bold text-[#3f362f]">
        {title}
      </p>

      <p className="mt-1 text-sm text-[#91877d]">
        {description}
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
  status: string,
) {
  switch (
    status
      .trim()
      .toLowerCase()
  ) {
    case "approved":
      return "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]";

    case "rejected":
      return "border-[#edcaca] bg-[#fff0f0] text-[#a33d3d]";

    default:
      return "border-[#ead29d] bg-[#fff8e8] text-[#795a28]";
  }
}

function getStatusLabel(
  status: string,
) {
  switch (
    status
      .trim()
      .toLowerCase()
  ) {
    case "approved":
      return "Hyväksytty";

    case "rejected":
      return "Hylätty";

    default:
      return "Odottaa";
  }
}