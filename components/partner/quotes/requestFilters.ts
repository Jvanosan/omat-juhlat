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
  const offer =
    request.directOffer;

  const pastRequest =
    isPastRequestDate(
      request.event_date,
    );

  /*
   * Menneen vastaamattoman pyynnön
   * ei pidä enää vaatia toimintaa.
   */
  if (!offer) {
    return pastRequest
      ? "closed"
      : "action";
  }

  const status =
    normalizeStatus(
      offer.status,
    );

  /*
   * Menneet hyväksytyt säilytetään
   * hyväksyttyinä, mutta ne piilotetaan
   * Hyväksytyt-välilehdeltä erikseen.
   */
  if (
    isAcceptedStatus(status)
  ) {
    return "accepted";
  }

  /*
   * Kaikki muut menneet pyynnöt
   * kuuluvat Päättyneet-ryhmään.
   */
  if (pastRequest) {
    return "closed";
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

  const pastRequest =
    isPastRequestDate(
      request.date,
    );

  if (!hasOffer) {
    return pastRequest
      ? "closed"
      : "action";
  }

  const status =
    normalizeStatus(
      request.quotePartnerStatus,
    );

  if (
    isAcceptedStatus(status)
  ) {
    return "accepted";
  }

  if (pastRequest) {
    return "closed";
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
    .filter((request) => {
      if (filter === "all") {
        return true;
      }

      const group =
        getDirectRequestGroup(
          request,
        );

      if (
        filter === "accepted"
      ) {
        return (
          group === "accepted" &&
          !isPastRequestDate(
            request.event_date,
          )
        );
      }

      return group === filter;
    })
    .sort(
      (first, second) =>
        compareRequestDates(
          first.event_date,
          second.event_date,
          filter === "accepted" ||
            filter === "all",
        ),
    );
}

export function filterCategoryRequests(
  requests: CategoryRequest[],
  filter: RequestFilter,
): CategoryRequest[] {
  return [...requests]
    .filter((request) => {
      if (filter === "all") {
        return true;
      }

      const group =
        getCategoryRequestGroup(
          request,
        );

      if (
        filter === "accepted"
      ) {
        return (
          group === "accepted" &&
          !isPastRequestDate(
            request.date,
          )
        );
      }

      return group === filter;
    })
    .sort(
      (first, second) =>
        compareRequestDates(
          first.date,
          second.date,
          filter === "accepted" ||
            filter === "all",
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
      const group =
        getDirectRequestGroup(
          request,
        );

      /*
       * Mennyt hyväksytty näkyy vain
       * Kaikki-välilehden määrässä.
       */
      if (
        group === "accepted" &&
        isPastRequestDate(
          request.event_date,
        )
      ) {
        return;
      }

      counts[group] += 1;
    },
  );

  categoryRequests.forEach(
    (request) => {
      const group =
        getCategoryRequestGroup(
          request,
        );

      if (
        group === "accepted" &&
        isPastRequestDate(
          request.date,
        )
      ) {
        return;
      }

      counts[group] += 1;
    },
  );

  return counts;
}

export function isPastRequestDate(
  value: string | null,
): boolean {
  const dateValue =
    getDateValue(value);

  if (
    dateValue ===
    Number.MAX_SAFE_INTEGER
  ) {
    return false;
  }

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0,
  );

  return (
    dateValue <
    today.getTime()
  );
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
  status:
    | string
    | null
    | undefined,
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
  prioritizeUpcoming = false,
): number {
  const firstDate =
    getDateValue(firstValue);

  const secondDate =
    getDateValue(secondValue);

  const invalidDate =
    Number.MAX_SAFE_INTEGER;

  if (firstDate === invalidDate) {
    return secondDate === invalidDate
      ? 0
      : 1;
  }

  if (secondDate === invalidDate) {
    return -1;
  }

  if (!prioritizeUpcoming) {
    return firstDate - secondDate;
  }

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0,
  );

  const todayValue =
    today.getTime();

  const firstIsPast =
    firstDate < todayValue;

  const secondIsPast =
    secondDate < todayValue;

  if (
    firstIsPast !==
    secondIsPast
  ) {
    return firstIsPast
      ? 1
      : -1;
  }

  /*
   * Menneistä näytetään uusin ensin.
   */
  if (
    firstIsPast &&
    secondIsPast
  ) {
    return (
      secondDate -
      firstDate
    );
  }

  /*
   * Tulevista näytetään lähin ensin.
   */
  return firstDate - secondDate;
}

function getDateValue(
  value: string | null,
): number {
  if (!value) {
    return Number.MAX_SAFE_INTEGER;
  }

  const cleanValue =
    value.trim();

  const finnishDateMatch =
    cleanValue.match(
      /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
    );

  if (finnishDateMatch) {
    const day = Number(
      finnishDateMatch[1],
    );

    const month = Number(
      finnishDateMatch[2],
    );

    const year = Number(
      finnishDateMatch[3],
    );

    return createDateValue({
      year,
      month,
      day,
    });
  }

  const isoDateMatch =
    cleanValue.match(
      /^(\d{4})-(\d{2})-(\d{2})$/,
    );

  if (isoDateMatch) {
    const year = Number(
      isoDateMatch[1],
    );

    const month = Number(
      isoDateMatch[2],
    );

    const day = Number(
      isoDateMatch[3],
    );

    return createDateValue({
      year,
      month,
      day,
    });
  }

  const date =
    new Date(cleanValue);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return Number.MAX_SAFE_INTEGER;
  }

  return date.getTime();
}

function createDateValue({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}): number {
  const date = new Date(
    year,
    month - 1,
    day,
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !==
      month - 1 ||
    date.getDate() !== day
  ) {
    return Number.MAX_SAFE_INTEGER;
  }

  return date.getTime();
}