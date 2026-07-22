import PartnerCard from "./PartnerCard";
import PartnerGrid from "./PartnerGrid";

import { getPartnerServices } from "./browseUtils";

import type {
  AvailabilityState,
  BrowsePartner,
  GroupedPartners,
} from "./types";

type PartnerGroupsProps = {
  groupedPartners: GroupedPartners;
  selectedPartners: string[];
  eventDate: string;
  checkingAvailability: boolean;
  availabilityError: string;
  unavailablePartnerIds: string[];
  onTogglePartner: (
    partner: BrowsePartner,
    availability: AvailabilityState,
  ) => void;
};

export default function PartnerGroups({
  groupedPartners,
  selectedPartners,
  eventDate,
  checkingAvailability,
  availabilityError,
  unavailablePartnerIds,
  onTogglePartner,
}: PartnerGroupsProps) {
  const serviceGroups = Object.entries(
    groupedPartners,
  );

  if (serviceGroups.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#d8c7ad] bg-white px-6 py-16 text-center shadow-sm">
        <div
          aria-hidden="true"
          className="text-4xl"
        >
          🔎
        </div>

        <h2 className="mt-4 text-xl font-bold text-[#211b16]">
          Sopivia palveluntarjoajia ei löytynyt
        </h2>

        <p className="mx-auto mt-2 max-w-lg leading-7 text-[#70675e]">
          Kokeile vaihtaa aluetta, palvelua tai
          tapahtuman päivämäärää.
        </p>
      </div>
    );
  }

  return (
    <PartnerGrid>
      {serviceGroups.map(
        ([service, areaGroups]) => (
          <section
            key={service}
            aria-labelledby={`service-${createId(
              service,
            )}`}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#ded3c4]" />

              <h2
                id={`service-${createId(service)}`}
                className="text-center text-2xl font-bold tracking-tight text-[#211b16] sm:text-3xl"
              >
                {service}
              </h2>

              <div className="h-px flex-1 bg-[#ded3c4]" />
            </div>

            {Object.entries(areaGroups).map(
              ([area, companies]) => (
                <div
                  key={area}
                  className="mb-10"
                >
                  <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#9a773b]">
                    <span aria-hidden="true">
                      📍
                    </span>

                    <span>{area}</span>

                    <span className="font-medium normal-case tracking-normal text-[#8b8177]">
                      ({companies.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {companies.map((company) => {
                      const companyId = String(
                        company.id,
                      );

                      const checked =
                        selectedPartners.includes(
                          companyId,
                        );

                      const availability =
                        getAvailability({
                          companyId,
                          eventDate,
                          checkingAvailability,
                          availabilityError,
                          unavailablePartnerIds,
                        });

                      return (
                        <PartnerCard
                          key={`${service}-${area}-${companyId}`}
                          company={{
                            ...company,
                            area:
                              company.area ||
                              "Alue ei ilmoitettu",
                          }}
                          checked={checked}
                          normalizedServices={getPartnerServices(
                            company,
                          )}
                          availability={availability}
                          onToggle={() =>
                            onTogglePartner(
                              company,
                              availability,
                            )
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              ),
            )}
          </section>
        ),
      )}
    </PartnerGrid>
  );
}

function getAvailability({
  companyId,
  eventDate,
  checkingAvailability,
  availabilityError,
  unavailablePartnerIds,
}: {
  companyId: string;
  eventDate: string;
  checkingAvailability: boolean;
  availabilityError: string;
  unavailablePartnerIds: string[];
}): AvailabilityState {
  if (!eventDate || availabilityError) {
    return "unknown";
  }

  if (checkingAvailability) {
    return "loading";
  }

  if (
    unavailablePartnerIds.includes(companyId)
  ) {
    return "unavailable";
  }

  return "available";
}

function createId(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}