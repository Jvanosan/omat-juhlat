import {
  parseServiceAreas,
} from "@/lib/locations";

import { SERVICE_NAMES } from "./constants";

import type {
  BrowsePartner,
  GroupedPartners,
} from "./types";

export function cleanAndNormalizeServices(
  raw: unknown,
): string[] {
  if (!raw) {
    return [];
  }

  const source = Array.isArray(raw)
    ? raw.join(",")
    : String(raw);

  const parts = source
    .replace(/[\[\]()"']/g, "")
    .replace(/[&/]/g, ",")
    .split(",")
    .map((service) =>
      service.trim().toLowerCase(),
    )
    .filter(Boolean);

  return Array.from(
    new Set(
      parts.map(
        (service) =>
          SERVICE_NAMES[service] ??
          service.charAt(0).toUpperCase() +
            service.slice(1),
      ),
    ),
  );
}

export function getPartnerServices(
  partner: BrowsePartner,
): string[] {
  return Array.from(
    new Set([
      ...cleanAndNormalizeServices(
        partner.category,
      ),
      ...cleanAndNormalizeServices(
        partner.services,
      ),
    ]),
  );
}

export function getPartnerAreas(
  partner: BrowsePartner,
): string[] {
  const areas = parseServiceAreas(
    partner.area,
  );

  return areas.length > 0
    ? areas
    : ["Alue ei ilmoitettu"];
}

export function getMinimumEventDate(): string {
  const minimumDate = new Date();

  minimumDate.setHours(0, 0, 0, 0);

  minimumDate.setDate(
    minimumDate.getDate() + 3,
  );

  return [
    minimumDate.getFullYear(),
    String(
      minimumDate.getMonth() + 1,
    ).padStart(2, "0"),
    String(
      minimumDate.getDate(),
    ).padStart(2, "0"),
  ].join("-");
}

export function getBrowseAreas(
  partners: BrowsePartner[],
): string[] {
  const areas = partners.flatMap(
    getPartnerAreas,
  );

  const uniqueAreas = Array.from(
    new Set(
      areas.filter(
        (area) =>
          area !==
          "Alue ei ilmoitettu",
      ),
    ),
  ).sort((first, second) => {
    if (first === "Koko Suomi") {
      return -1;
    }

    if (second === "Koko Suomi") {
      return 1;
    }

    return first.localeCompare(
      second,
      "fi",
    );
  });

  return [
    "Kaikki",
    ...uniqueAreas,
  ];
}

export function getBrowseServices(
  partners: BrowsePartner[],
): string[] {
  const services = partners.flatMap(
    getPartnerServices,
  );

  return [
    "Kaikki",
    ...Array.from(
      new Set(services),
    ).sort((first, second) =>
      first.localeCompare(
        second,
        "fi",
      ),
    ),
  ];
}

export function groupPartners(
  partners: BrowsePartner[],
  areaFilter: string,
  serviceFilter: string,
): GroupedPartners {
  return partners.reduce<GroupedPartners>(
    (groups, partner) => {
      const partnerAreas =
        getPartnerAreas(partner);

      const servesWholeCountry =
        partnerAreas.includes(
          "Koko Suomi",
        );

      const areaMatches =
        areaFilter === "Kaikki" ||
        partnerAreas.includes(
          areaFilter,
        ) ||
        servesWholeCountry;

      if (!areaMatches) {
        return groups;
      }

      const partnerServices =
        getPartnerServices(partner);

      const displayArea =
        getDisplayArea({
          partnerAreas,
          areaFilter,
          servesWholeCountry,
        });

      partnerServices.forEach(
        (service) => {
          if (
            serviceFilter !==
              "Kaikki" &&
            service !== serviceFilter
          ) {
            return;
          }

          groups[service] ??= {};

          groups[service][
            displayArea
          ] ??= [];

          groups[service][
            displayArea
          ].push(partner);
        },
      );

      return groups;
    },
    {},
  );
}

export function countVisiblePartners(
  groupedPartners: GroupedPartners,
): number {
  const partnerIds =
    new Set<string>();

  Object.values(
    groupedPartners,
  ).forEach((areaGroups) => {
    Object.values(
      areaGroups,
    ).forEach((partners) => {
      partners.forEach(
        (partner) => {
          partnerIds.add(
            String(partner.id),
          );
        },
      );
    });
  });

  return partnerIds.size;
}

function getDisplayArea({
  partnerAreas,
  areaFilter,
  servesWholeCountry,
}: {
  partnerAreas: string[];
  areaFilter: string;
  servesWholeCountry: boolean;
}): string {
  if (areaFilter !== "Kaikki") {
    return servesWholeCountry
      ? "Palvelee koko Suomessa"
      : areaFilter;
  }

  if (servesWholeCountry) {
    return "Palvelee koko Suomessa";
  }

  if (partnerAreas.length === 1) {
    return partnerAreas[0];
  }

  if (partnerAreas.length > 1) {
    return "Palvelee useilla alueilla";
  }

  return "Alue ei ilmoitettu";
}