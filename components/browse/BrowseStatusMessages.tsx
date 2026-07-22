type BrowseStatusMessagesProps = {
  loadingPartners: boolean;
  partnersError: string;
  eventDate: string;
  checkingAvailability: boolean;
  availabilityNotice: string;
  availabilityError: string;
  visiblePartnerCount: number;
};

export default function BrowseStatusMessages({
  loadingPartners,
  partnersError,
  eventDate,
  checkingAvailability,
  availabilityNotice,
  availabilityError,
  visiblePartnerCount,
}: BrowseStatusMessagesProps) {
  return (
    <div
      className="space-y-4"
      aria-live="polite"
    >
      {!loadingPartners && !partnersError && (
        <div className="rounded-2xl border border-[#e8ded0] bg-white px-5 py-4 text-[#70675e] shadow-sm">
          Löytyi{" "}
          <strong className="text-[#211b16]">
            {visiblePartnerCount}
          </strong>{" "}
          yritystä nykyisillä suodattimilla.
        </div>
      )}

      {checkingAvailability && eventDate && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-2xl border border-[#ead29d] bg-[#fff8e8] p-4 text-sm font-medium text-[#795a28]"
        >
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#d4ad62] border-t-transparent"
          />

          Tarkistetaan palveluntarjoajien
          saatavuutta valitulle päivälle...
        </div>
      )}

      {availabilityNotice && (
        <div className="rounded-2xl border border-[#ead29d] bg-[#fff8e8] p-4 text-sm font-medium text-[#795a28]">
          ⚠️ {availabilityNotice}
        </div>
      )}

      {availabilityError && (
        <div
          role="alert"
          className="rounded-2xl border border-[#edcaca] bg-[#fff3f3] p-4 text-sm font-medium text-[#a33d3d]"
        >
          Saatavuuden tarkistus epäonnistui:{" "}
          {availabilityError}
        </div>
      )}

      {loadingPartners && (
        <div
          role="status"
          className="rounded-2xl border border-[#e8ded0] bg-white px-6 py-12 text-center text-[#70675e] shadow-sm"
        >
          <span
            aria-hidden="true"
            className="mx-auto mb-4 block h-8 w-8 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
          />

          Ladataan palveluntarjoajia...
        </div>
      )}

      {partnersError && (
        <div
          role="alert"
          className="rounded-2xl border border-[#edcaca] bg-[#fff3f3] p-5 text-[#a33d3d]"
        >
          <p className="font-bold">
            Yritysten lataaminen epäonnistui
          </p>

          <p className="mt-1 text-sm">
            {partnersError}
          </p>
        </div>
      )}
    </div>
  );
}