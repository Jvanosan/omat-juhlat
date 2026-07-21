export function formatDate(value: string | null) {
  if (!value) return "Päivämäärää ei ilmoitettu";

  const date = new Date(
    value.includes("T") ? value : `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fi-FI").format(date);
}

export function toDateInputValue(value: string | null) {
  if (!value) return "";

  return value.slice(0, 10);
}

export function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(
    tomorrow.getMonth() + 1
  ).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
}

export function getStatusLabel(status: string | null) {
  switch (status?.toLowerCase()) {
    case "new":
    case "pending":
      return "Uusi";

    case "draft":
      return "Luonnos";

    case "sent":
    case "offered":
      return "Tarjous lähetetty";

    case "selected":
    case "valittu":
      return "Asiakas valitsi tarjouksen";

    case "accepted":
      return "Hyväksytty";

    case "rejected":
      return "Hylätty";

    case "cancelled":
    case "canceled":
    case "withdrawn":
      return "Peruttu";

    case "expired":
      return "Vanhentunut";

    case "closed":
      return "Suljettu";

    default:
      return status || "Uusi";
  }
}

export function getStatusClasses(
  status: string | null
) {
  switch (status?.toLowerCase()) {
    // Juhlava väri asiakkaan valitsemalle tarjoukselle.
    case "selected":
    case "valittu":
      return "border-fuchsia-400/30 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-fuchsia-200";

    case "accepted":
      return "border-emerald-400/30 bg-emerald-500/15 text-emerald-200";

    case "rejected":
    case "cancelled":
    case "canceled":
    case "withdrawn":
    case "expired":
    case "closed":
      return "border-red-400/30 bg-red-500/15 text-red-200";

    case "sent":
    case "offered":
      return "border-blue-400/30 bg-blue-500/15 text-blue-200";

    case "draft":
      return "border-zinc-500/30 bg-zinc-500/15 text-zinc-300";

    default:
      return "border-amber-400/30 bg-amber-500/15 text-amber-200";
  }
}

export function isOfferSent(status: string | null) {
  const normalizedStatus = status?.toLowerCase();

  return (
    normalizedStatus === "sent" ||
    normalizedStatus === "offered"
  );
}

export function isOfferLocked(status: string | null) {
  const normalizedStatus = status?.toLowerCase();

  return [
    "selected",
    "valittu",
    "accepted",
    "rejected",
    "cancelled",
    "canceled",
    "withdrawn",
    "expired",
    "closed",
  ].includes(normalizedStatus ?? "");
}
export function isOfferExpired(
  expiresAt: string | null
) {
  if (!expiresAt) return true;

  const expirationDate = new Date(expiresAt);

  if (Number.isNaN(expirationDate.getTime())) {
    return true;
  }

  return expirationDate.getTime() <= Date.now();
}
export function toOfferExpiryTimestamp(
  dateValue: string
) {
  const expirationDate = new Date(
    `${dateValue}T23:59:59.999`
  );

  if (Number.isNaN(expirationDate.getTime())) {
    return dateValue;
  }

  return expirationDate.toISOString();
}