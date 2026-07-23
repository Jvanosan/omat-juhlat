"use client";

import type {
  PartnerApplication,
} from "./types";

type ApplicationsSectionProps = {
  applications:
    PartnerApplication[];

  processingId: string | null;

  onApprove: (
    application:
      PartnerApplication,
  ) => void;

  onReject: (
    applicationId: string,
  ) => void;
};

export default function ApplicationsSection({
  applications,
  processingId,
  onApprove,
  onReject,
}: ApplicationsSectionProps) {
  function approve(
    application:
      PartnerApplication,
  ) {
    const confirmed =
      window.confirm(
        `Hyväksytäänkö yrityksen "${application.company_name}" partnerihakemus?`,
      );

    if (confirmed) {
      onApprove(application);
    }
  }

  function reject(
    application:
      PartnerApplication,
  ) {
    const confirmed =
      window.confirm(
        `Hylätäänkö yrityksen "${application.company_name}" hakemus? Tätä toimintoa ei tule tehdä vahingossa.`,
      );

    if (confirmed) {
      onReject(application.id);
    }
  }

  return (
    <section
      id="applications-section"
      className="scroll-mt-6 overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-sm"
    >
      <div className="flex flex-col gap-3 border-b border-[#eee5d9] bg-[#fffaf2] px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
            Hakemukset
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#211b16]">
            Partnerihakemukset
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#70675e]">
            Tarkista yrityksen tiedot ja
            yhteystiedot ennen päätöksen
            tekemistä.
          </p>
        </div>

        <ApplicationCount
          applications={
            applications
          }
        />
      </div>

      <div className="p-4 sm:p-6">
        {applications.length === 0 ? (
          <EmptyApplications />
        ) : (
          <>
            <div className="space-y-4 lg:hidden">
              {applications.map(
                (application) => (
                  <ApplicationCard
                    key={
                      application.id
                    }
                    application={
                      application
                    }
                    processing={
                      processingId ===
                      application.id
                    }
                    onApprove={() =>
                      approve(
                        application,
                      )
                    }
                    onReject={() =>
                      reject(
                        application,
                      )
                    }
                  />
                ),
              )}
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-[#e8ded0] lg:block">
              <table className="min-w-[1050px] w-full border-collapse text-left text-sm">
                <thead className="bg-[#fffaf2] text-xs uppercase tracking-wide text-[#91877d]">
                  <tr>
                    <TableHeading>
                      Yritys
                    </TableHeading>

                    <TableHeading>
                      Yhteyshenkilö
                    </TableHeading>

                    <TableHeading>
                      Yhteystiedot
                    </TableHeading>

                    <TableHeading>
                      Alue
                    </TableHeading>

                    <TableHeading>
                      Palvelu
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
                  {applications.map(
                    (application) => {
                      const processing =
                        processingId ===
                        application.id;

                      return (
                        <tr
                          key={
                            application.id
                          }
                          className="align-top transition hover:bg-[#fffdf9]"
                        >
                          <td className="px-4 py-4">
                            <p className="font-bold text-[#211b16]">
                              {
                                application.company_name
                              }
                            </p>

                            {application.description && (
                              <p className="mt-1 max-w-xs line-clamp-2 text-xs leading-5 text-[#91877d]">
                                {
                                  application.description
                                }
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-4 text-[#62584f]">
                            {application.contact_name ||
                              "Ei ilmoitettu"}
                          </td>

                          <td className="px-4 py-4">
                            <ContactLinks
                              email={
                                application.email
                              }
                              phone={
                                application.phone
                              }
                              compact
                            />
                          </td>

                          <td className="px-4 py-4 text-[#62584f]">
                            {application.city ||
                              "Ei ilmoitettu"}
                          </td>

                          <td className="px-4 py-4 text-[#62584f]">
                            {application.service_category ||
                              "Ei ilmoitettu"}
                          </td>

                          <td className="px-4 py-4">
                            <ApplicationStatus
                              status={
                                application.status
                              }
                            />
                          </td>

                          <td className="px-4 py-4">
                            <ApplicationActions
                              status={
                                application.status
                              }
                              processing={
                                processing
                              }
                              onApprove={() =>
                                approve(
                                  application,
                                )
                              }
                              onReject={() =>
                                reject(
                                  application,
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

function ApplicationCard({
  application,
  processing,
  onApprove,
  onReject,
}: {
  application:
    PartnerApplication;
  processing: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <article className="rounded-2xl border border-[#e8ded0] bg-[#fffdf9] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
            Yritys
          </p>

          <h3 className="mt-1 text-xl font-bold text-[#211b16]">
            {application.company_name}
          </h3>
        </div>

        <ApplicationStatus
          status={
            application.status
          }
        />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <ApplicationDetail
          label="Yhteyshenkilö"
          value={
            application.contact_name ||
            "Ei ilmoitettu"
          }
        />

        <ApplicationDetail
          label="Kaupunki tai alue"
          value={
            application.city ||
            "Ei ilmoitettu"
          }
        />

        <ApplicationDetail
          label="Palvelukategoria"
          value={
            application.service_category ||
            "Ei ilmoitettu"
          }
        />
      </dl>

      {application.description && (
        <div className="mt-4 rounded-xl border border-[#eee5d9] bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
            Yrityksen kuvaus
          </p>

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#62584f]">
            {application.description}
          </p>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#91877d]">
          Yhteystiedot
        </p>

        <ContactLinks
          email={application.email}
          phone={application.phone}
        />
      </div>

      <div className="mt-5">
        <ApplicationActions
          status={
            application.status
          }
          processing={processing}
          onApprove={onApprove}
          onReject={onReject}
          fullWidth
        />
      </div>
    </article>
  );
}

function ApplicationActions({
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
        Hakemus on käsitelty
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
          : "Hyväksy hakemus"}
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

function ContactLinks({
  email,
  phone,
  compact = false,
}: {
  email: string;
  phone: string | null;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex ${
        compact
          ? "flex-col items-start"
          : "flex-col gap-2 sm:flex-row sm:flex-wrap"
      }`}
    >
      <a
        href={`mailto:${email}`}
        className={`break-all font-semibold text-[#87652f] transition hover:text-[#5f451f] ${
          compact
            ? "text-xs"
            : "rounded-xl border border-[#decba9] bg-white px-3 py-2 text-sm"
        }`}
      >
        ✉️ {email}
      </a>

      {phone && (
        <a
          href={`tel:${normalizePhone(
            phone,
          )}`}
          className={`font-semibold text-[#11634d] transition hover:text-[#0c4f3e] ${
            compact
              ? "mt-2 text-xs"
              : "rounded-xl border border-[#b9dfd0] bg-white px-3 py-2 text-sm"
          }`}
        >
          📞 {phone}
        </a>
      )}
    </div>
  );
}

function ApplicationDetail({
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

function ApplicationStatus({
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

function ApplicationCount({
  applications,
}: {
  applications:
    PartnerApplication[];
}) {
  const pending =
    applications.filter(
      (application) =>
        application.status ===
        "pending",
    ).length;

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${
        pending > 0
          ? "border-[#ead29d] bg-[#fff8e8] text-[#795a28]"
          : "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]"
      }`}
    >
      {pending > 0
        ? `${pending} odottaa päätöstä`
        : "Ei odottavia hakemuksia"}
    </span>
  );
}

function EmptyApplications() {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8c7ad] bg-[#fffdf9] px-5 py-10 text-center">
      <div className="text-4xl">
        📋
      </div>

      <p className="mt-4 font-bold text-[#3f362f]">
        Ei partnerihakemuksia
      </p>

      <p className="mt-1 text-sm text-[#91877d]">
        Uudet hakemukset näkyvät
        täällä tarkistettavina.
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

function normalizePhone(
  value: string,
) {
  return value.replace(
    /[^\d+]/g,
    "",
  );
}