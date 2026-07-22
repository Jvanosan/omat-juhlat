"use client";

import Link from "next/link";
import { useState } from "react";

import CalendarEntryModal from "@/components/partner/calendar/CalendarEntryModal";
import CalendarGrid from "@/components/partner/calendar/CalendarGrid";
import CalendarToolbar from "@/components/partner/calendar/CalendarToolbar";
import SectionHeader from "@/components/partner/SectionHeader";

import type {
  CalendarDay,
  CalendarEntryStatus,
} from "@/components/partner/calendar/types";

import { usePartnerCalendar } from "./usePartnerCalendar";

export default function PartnerCalendarPage() {
  const {
    year,
    month,
    days,
    loading,
    processingDate,
    errorMessage,

    previousMonth,
    nextMonth,
    currentMonth,

    saveEntry,
    deleteEntry,
    reload,
  } = usePartnerCalendar();

  const [selectedDay, setSelectedDay] =
    useState<CalendarDay | null>(null);

  async function handleSave(
    status: CalendarEntryStatus,
    note: string,
  ) {
    if (!selectedDay) {
      return false;
    }

    return saveEntry(
      selectedDay.date,
      status,
      note,
    );
  }

  async function handleDelete() {
    if (!selectedDay) {
      return false;
    }

    return deleteEntry(
      selectedDay.date,
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <Link
          href="/partner/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#87652f] transition hover:text-[#5f451f]"
        >
          <span aria-hidden="true">
            ←
          </span>

          Takaisin dashboardille
        </Link>
      </div>

      <SectionHeader
        title="Kalenteri"
        description="Hallitse yrityksesi saatavuutta ja tarkastele asiakkaiden vahvistamia varauksia."
      />

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-5 text-[#a33d3d] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="text-xl"
            >
              ⚠️
            </span>

            <div>
              <p className="font-bold">
                Kalenterin toiminto
                epäonnistui
              </p>

              <p className="mt-1 text-sm leading-6">
                {errorMessage}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              void reload()
            }
            className="shrink-0 rounded-xl bg-[#a33d3d] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#8d3030]"
          >
            Yritä uudelleen
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-[0_18px_50px_rgba(73,53,31,0.1)]">
        <CalendarToolbar
          year={year}
          month={month}
          loading={loading}
          onPreviousMonth={
            previousMonth
          }
          onNextMonth={nextMonth}
          onCurrentMonth={
            currentMonth
          }
          onReload={() =>
            void reload()
          }
        />

        <div className="relative">
          <CalendarGrid
            days={days}
            onSelectDay={
              setSelectedDay
            }
          />

          {loading && (
            <div className="absolute inset-0 z-20 flex min-h-72 items-center justify-center bg-[#fffdf9]/85 p-5 backdrop-blur-sm">
              <div className="rounded-2xl border border-[#e2d5c4] bg-white px-7 py-6 text-center shadow-xl">
                <div
                  aria-hidden="true"
                  className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
                />

                <p className="mt-4 text-sm font-bold text-[#3f362f]">
                  Ladataan kalenteria...
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#e8ded0] bg-[#fffaf2] px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-semibold text-[#70675e] sm:text-sm">
            <Legend
              color="bg-[#b48a45]"
              label="Asiakkaan vahvistama"
            />

            <Legend
              color="bg-[#168365]"
              label="Varattu"
            />

            <Legend
              color="bg-[#c55454]"
              label="Ei saatavilla"
            />

            <Legend
              color="bg-white border border-[#bfb4a8]"
              label="Vapaa"
            />

            <p className="w-full text-xs font-normal text-[#91877d] sm:ml-auto sm:w-auto">
              Merkitsemätön päivä on
              vapaa.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <InfoCard
          icon="📅"
          title="Hallitse saatavuutta"
          description="Napauta tulevaa päivää ja merkitse se varatuksi tai päiväksi, jolloin yrityksesi ei ole saatavilla. Menneitä päiviä ei voi muokata."
        />

        <InfoCard
          icon="🔒"
          title="Asiakastiedot turvallisesti"
          description="Asiakkaan nimi ja yhteystiedot näkyvät kalenterissa vasta, kun hän on hyväksynyt tarjouksesi. Vahvistettua varausta ei voi poistaa vahingossa."
        />
      </div>

      {selectedDay && (
        <CalendarEntryModal
          day={selectedDay}
          processing={
            processingDate ===
            selectedDay.date
          }
          onClose={() =>
            setSelectedDay(null)
          }
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`h-3 w-3 shrink-0 rounded-full ${color}`}
      />

      {label}
    </span>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <section className="flex items-start gap-4 rounded-2xl border border-[#e8ded0] bg-white p-5 shadow-sm">
      <div
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fbf5e9] text-xl"
      >
        {icon}
      </div>

      <div>
        <h2 className="font-bold text-[#211b16]">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-[#70675e]">
          {description}
        </p>
      </div>
    </section>
  );
}