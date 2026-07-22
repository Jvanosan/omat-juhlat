import type {
  CategoryRequest,
  DirectRequest,
} from "./types";

import {
  isOfferExpired,
} from "./quoteUtils";

export type RequestFilter =
  | "action"
  | "sent"
  | "accepted"
  | "closed"
  | "all";

export type RequestGroup =
  Exclude<RequestFilter, "all">;

export const REQUEST_FILTERS: Array<{
  id: RequestFilter;
  label: string;
  icon: string;
}> = [
  {
    id: "action",
    label: "Vaatii toimintaa",
    icon: "🔔",
  },
  {
    id: "sent",
    label: "Lähetetyt",
    icon: "📤",
  },
  {
    id: "accepted",
    label: "Hyväksytyt",
    icon: "🎉",
  },
  {
    id: "closed",
    label: "Päättyneet",
    icon: "📁",
  },
  {
    id: "all",
    label: "Kaikki",
    icon: "📋",
  },
];

export function getDirectRequestGroup(
  request: DirectRequest,
): RequestGroup {
  const offer = request.directOffer;

  if (!offer) {
    return "action";
  }

  const status =
    normalizeStatus(offer.status);

  if (
    isAcceptedStatus(status)
  ) {
    return "accepted";
  }

  if (
    isClosedStatus(status) ||
    isOfferExpired(
      offer.expires_at,
    )
  ) {
    return "closed";
  }

  if (status === "draft") {
    return "action";
  }

  return "sent";
}

export function getCategoryRequestGroup(
  request: CategoryRequest,
): RequestGroup {
  const price =
    Number(request.offerPrice);

  const hasOffer =
    Number.isFinite(price) &&
    price > 0;

  if (!hasOffer) {
    return "action";
  }

  const status = normalizeStatus(
    request.quotePartnerStatus,
  );

  if (
    isAcceptedStatus(status)
  ) {
    return "accepted";
  }

  if (
    isClosedStatus(status) ||
    isOfferExpired(
      request.offerExpiresAt,
    )
  ) {
    return "closed";
  }

  return "sent";
}

export function filterDirectRequests(
  requests: DirectRequest[],
  filter: RequestFilter,
): DirectRequest[] {
  return [...requests]
    .filter(
      (request) =>
        filter === "all" ||
        getDirectRequestGroup(
          request,
        ) === filter,
    )
    .sort(
      (first, second) =>
        compareRequestDates(
          first.event_date,
          second.event_date,
        ),
    );
}

export function filterCategoryRequests(
  requests: CategoryRequest[],
  filter: RequestFilter,
): CategoryRequest[] {
  return [...requests]
    .filter(
      (request) =>
        filter === "all" ||
        getCategoryRequestGroup(
          request,
        ) === filter,
    )
    .sort(
      (first, second) =>
        compareRequestDates(
          first.date,
          second.date,
        ),
    );
}

export function getRequestFilterCounts(
  directRequests: DirectRequest[],
  categoryRequests: CategoryRequest[],
): Record<RequestFilter, number> {
  const counts: Record<
    RequestFilter,
    number
  > = {
    action: 0,
    sent: 0,
    accepted: 0,
    closed: 0,
    all:
      directRequests.length +
      categoryRequests.length,
  };

  directRequests.forEach(
    (request) => {
      counts[
        getDirectRequestGroup(request)
      ] += 1;
    },
  );

  categoryRequests.forEach(
    (request) => {
      counts[
        getCategoryRequestGroup(request)
      ] += 1;
    },
  );

  return counts;
}

function isAcceptedStatus(
  status: string,
): boolean {
  return [
    "selected",
    "valittu",
    "accepted",
    "confirmed",
    "won",
    "hyväksytty",
    "hyvaksytty",
    "vahvistettu",
  ].includes(status);
}

function isClosedStatus(
  status: string,
): boolean {
  return [
    "rejected",
    "hävitty",
    "havitty",
    "cancelled",
    "canceled",
    "withdrawn",
    "peruttu",
    "expired",
    "closed",
    "suljettu",
  ].includes(status);
}

function normalizeStatus(
  status: string | null | undefined,
): string {
  return (
    status
      ?.trim()
      .toLowerCase() ?? ""
  );
}

function compareRequestDates(
  firstValue: string | null,
  secondValue: string | null,
): number {
  const firstDate =
    getDateValue(firstValue);

  const secondDate =
    getDateValue(secondValue);

  return firstDate - secondDate;
}

function getDateValue(
  value: string | null,
): number {
  if (!value) {
    return Number.MAX_SAFE_INTEGER;
  }

  const date = new Date(
    value.includes("T")
      ? value
      : `${value}T00:00:00`,
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return Number.MAX_SAFE_INTEGER;
  }

  return date.getTime();
}