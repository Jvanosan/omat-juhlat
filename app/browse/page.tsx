"use client";

import { Suspense } from "react";

import BrowseFilters from "@/components/browse/BrowseFilters";
import BrowseHero from "@/components/browse/BrowseHero";
import BrowseStatusMessages from "@/components/browse/BrowseStatusMessages";
import PartnerGroups from "@/components/browse/PartnerGroups";
import RequestForm from "@/components/browse/RequestForm";
import SelectedPartnersBar from "@/components/browse/SelectedPartnersBar";
import SelectionToast from "@/components/browse/SelectionToast";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

import { useBrowsePage } from "./useBrowsePage";

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowsePageLoading />}>
      <BrowsePageContent />
    </Suspense>
  );
}

function BrowsePageContent() {
  const {
    partners,
    selectedPartners,

    areaFilter,
    serviceFilter,
    email,
    eventDate,
    guests,
    location,
    eventType,
    notes,

    sending,
    success,
    loadingPartners,
    partnersError,

    unavailablePartnerIds,
    checkingAvailability,
    availabilityError,
    availabilityNotice,

    toast,
    minDate,
    areas,
    services,
    groupedPartners,
    visiblePartnerCount,

    eventTypes,
    locations,

    setAreaFilter,
    setServiceFilter,
    setEmail,
    setEventDate,
    setLocation,
    setEventType,
    setNotes,

    handleGuestsChange,
    togglePartner,
    clearSelectedPartners,
    undoLatestSelection,
    closeToast,
    submitRequest,
  } = useBrowsePage();

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#211b16]">
      <PublicHeader />

      <main>
        <BrowseHero />

        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <BrowseFilters
            areas={areas}
            services={services}
            areaFilter={areaFilter}
            serviceFilter={serviceFilter}
            eventDate={eventDate}
            minDate={minDate}
            onAreaChange={setAreaFilter}
            onServiceChange={setServiceFilter}
            onEventDateChange={setEventDate}
          />

          <BrowseStatusMessages
            loadingPartners={loadingPartners}
            partnersError={partnersError}
            eventDate={eventDate}
            checkingAvailability={
              checkingAvailability
            }
            availabilityNotice={
              availabilityNotice
            }
            availabilityError={
              availabilityError
            }
            visiblePartnerCount={
              visiblePartnerCount
            }
          />

          {!loadingPartners &&
            !partnersError && (
              <div className="mt-10">
                <PartnerGroups
                  groupedPartners={
                    groupedPartners
                  }
                  selectedPartners={
                    selectedPartners
                  }
                  eventDate={eventDate}
                  checkingAvailability={
                    checkingAvailability
                  }
                  availabilityError={
                    availabilityError
                  }
                  unavailablePartnerIds={
                    unavailablePartnerIds
                  }
                  onTogglePartner={
                    togglePartner
                  }
                />
              </div>
            )}

          <SelectedPartnersBar
            partners={partners}
            selectedPartners={
              selectedPartners
            }
            onClear={
              clearSelectedPartners
            }
          />

          <RequestForm
            success={success}
            eventType={eventType}
            location={location}
            email={email}
            guests={guests}
            notes={notes}
            sending={sending}
            eventTypes={eventTypes}
            locations={locations}
            selectedPartnersCount={
              selectedPartners.length
            }
            onEventTypeChange={
              setEventType
            }
            onLocationChange={
              setLocation
            }
            onEmailChange={setEmail}
            onGuestsChange={
              handleGuestsChange
            }
            onNotesChange={setNotes}
            onSubmit={() =>
              void submitRequest()
            }
          />
        </div>
      </main>

      <PublicFooter />

      <SelectionToast
        toast={toast}
        onUndo={undoLatestSelection}
        onClose={closeToast}
      />
    </div>
  );
}

function BrowsePageLoading() {
  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#211b16]">
      <PublicHeader />

      <main className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="rounded-3xl border border-[#e8ded0] bg-white px-10 py-9 text-center shadow-sm">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
          />

          <p className="font-bold">
            Ladataan palveluntarjoajia...
          </p>

          <p className="mt-1 text-sm text-[#70675e]">
            Odota hetki.
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}