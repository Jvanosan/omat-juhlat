export function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "Päivämäärää ei ilmoitettu";
  }

  const date = new Date(
    value.includes("T")
      ? value
      : `${value}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "fi-FI",
  ).format(date);
}

export function toDateInputValue(
  value: string | null,
): string {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

export function getTomorrowDate(): string {
  const tomorrow = new Date();

  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(
    tomorrow.getDate() + 1,
  );

  const year =
    tomorrow.getFullYear();

  const month = String(
    tomorrow.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    tomorrow.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getStatusLabel(
  status: string | null | undefined,
): string {
  switch (normalizeStatus(status)) {
    case "":
    case "new":
    case "pending":
    case "open":
    case "avoin":
    case "uusi":
      return "Uusi pyyntö";

    case "draft":
    case "luonnos":
      return "Luonnos";

    case "sent":
    case "offered":
    case "lähetetty":
    case "lahetetty":
      return "Tarjous lähetetty";

    case "selected":
    case "valittu":
      return "Asiakas valitsi tarjouksen";

    case "accepted":
    case "confirmed":
    case "won":
    case "hyväksytty":
    case "hyvaksytty":
    case "vahvistettu":
      return "Hyväksytty";

    case "rejected":
    case "hävitty":
    case "havitty":
      return "Hylätty";

    case "cancelled":
    case "canceled":
    case "withdrawn":
    case "peruttu":
      return "Peruttu";

    case "expired":
    case "vanhentunut":
      return "Vanhentunut";

    case "closed":
    case "suljettu":
      return "Suljettu";

    default:
      return status || "Uusi pyyntö";
  }
}

export function getStatusClasses(
  status: string | null | undefined,
): string {
  switch (normalizeStatus(status)) {
    // Juhlava violetti:
    // asiakas on juuri valinnut tarjouksen.
    case "selected":
    case "valittu":
      return "border-[#d9b8eb] bg-gradient-to-r from-[#f5edff] to-[#fff0fa] text-[#7c3f91]";

    // Lopullisesti hyväksytty.
    case "accepted":
    case "confirmed":
    case "won":
    case "hyväksytty":
    case "hyvaksytty":
    case "vahvistettu":
      return "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]";

    // Hylätty tai peruttu näkyy punaisena.
    case "rejected":
    case "hävitty":
    case "havitty":
    case "cancelled":
    case "canceled":
    case "withdrawn":
    case "peruttu":
      return "border-[#edcaca] bg-[#fff3f3] text-[#a33d3d]";

    // Vanhentunut erotetaan perutusta.
    case "expired":
    case "vanhentunut":
      return "border-[#ead29d] bg-[#fff8e8] text-[#795a28]";

    // Suljettu on neutraali.
    case "closed":
    case "suljettu":
      return "border-[#d9d3cb] bg-[#f4f1ed] text-[#62584f]";

    // Lähetetty tarjous on sininen.
    case "sent":
    case "offered":
    case "lähetetty":
    case "lahetetty":
      return "border-[#cdddf1] bg-[#f1f6fd] text-[#3564a8]";

    // Luonnos on harmaa.
    case "draft":
    case "luonnos":
      return "border-[#ddd7cf] bg-[#f6f3ef] text-[#70675e]";

    // Uusi pyyntö on lämmin kultainen.
    default:
      return "border-[#ead29d] bg-[#fff8e8] text-[#795a28]";
  }
}

export function isOfferSent(
  status: string | null | undefined,
): boolean {
  return [
    "sent",
    "offered",
    "lähetetty",
    "lahetetty",
  ].includes(normalizeStatus(status));
}

export function isOfferLocked(
  status: string | null | undefined,
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
  ].includes(normalizeStatus(status));
}

export function isOfferExpired(
  expiresAt: string | null,
): boolean {
  if (!expiresAt) {
    return true;
  }

  const expirationDate =
    new Date(expiresAt);

  if (
    Number.isNaN(
      expirationDate.getTime(),
    )
  ) {
    return true;
  }

  return (
    expirationDate.getTime() <=
    Date.now()
  );
}

export function toOfferExpiryTimestamp(
  dateValue: string,
): string {
  const expirationDate = new Date(
    `${dateValue}T23:59:59.999`,
  );

  if (
    Number.isNaN(
      expirationDate.getTime(),
    )
  ) {
    return dateValue;
  }

  return expirationDate.toISOString();
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