"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  createCalendarDays,
  moveMonth,
  toDateKey,
} from "@/components/partner/calendar/calendarUtils";

import { loadPartnerBookings } from "@/components/partner/calendar/loadPartnerBookings";

import type {
  CalendarEntry,
  CalendarEntryStatus,
} from "@/components/partner/calendar/types";

export function usePartnerCalendar() {
  const today = useMemo(
    () => new Date(),
    [],
  );

  const [year, setYear] = useState(
    today.getFullYear(),
  );

  const [month, setMonth] = useState(
    today.getMonth(),
  );

  const [partnerId, setPartnerId] =
    useState<string | null>(null);

  const [entries, setEntries] = useState<
    CalendarEntry[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [processingDate, setProcessingDate] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.user) {
        throw new Error(
          "Kirjaudu partneritilille nähdäksesi kalenterin.",
        );
      }

      const {
        data: partner,
        error: partnerError,
      } = await supabase
        .from("partners")
        .select("id")
        .eq(
          "auth_user_id",
          session.user.id,
        )
        .maybeSingle();

      if (partnerError) {
        throw partnerError;
      }

      if (!partner) {
        throw new Error(
          "Kirjautuneelle käyttäjälle ei löytynyt partneriprofiilia.",
        );
      }

      const currentPartnerId = String(
        partner.id,
      );

      setPartnerId(currentPartnerId);

      const firstDay = new Date(
        year,
        month,
        1,
      );

      const mondayIndex =
        (firstDay.getDay() + 6) % 7;

      const rangeStart = new Date(
        year,
        month,
        1 - mondayIndex,
      );

      const rangeEnd = new Date(
        rangeStart.getFullYear(),
        rangeStart.getMonth(),
        rangeStart.getDate() + 41,
      );

      const rangeStartKey =
        toDateKey(rangeStart);

      const rangeEndKey =
        toDateKey(rangeEnd);

      const [
        calendarResult,
        bookingsByDate,
      ] = await Promise.all([
        supabase
          .from(
            "partner_calendar_entries",
          )
          .select(`
            id,
            partner_id,
            date,
            status,
            note,
            created_at,
            updated_at
          `)
          .eq(
            "partner_id",
            currentPartnerId,
          )
          .gte("date", rangeStartKey)
          .lte("date", rangeEndKey)
          .order("date", {
            ascending: true,
          }),

        loadPartnerBookings({
          partnerId: currentPartnerId,
          rangeStart: rangeStartKey,
          rangeEnd: rangeEndKey,
        }),
      ]);

      if (calendarResult.error) {
        throw calendarResult.error;
      }

      const entriesByDate = new Map<
        string,
        CalendarEntry
      >();

      for (
        const calendarEntry of
        calendarResult.data ?? []
      ) {
        const entry =
          calendarEntry as CalendarEntry;

        entriesByDate.set(entry.date, {
          ...entry,
          bookings:
            bookingsByDate.get(
              entry.date,
            ) ?? [],
        });
      }

      /*
       * Jos hyväksytystä tarjouksesta ei ole vielä
       * omaa kalenterimerkintää, luodaan se näkymään
       * automaattisesti varattuna päivänä.
       */
      for (
        const [
          date,
          bookings,
        ] of bookingsByDate
      ) {
        const existingEntry =
          entriesByDate.get(date);

        if (existingEntry) {
          entriesByDate.set(date, {
            ...existingEntry,
            status: "booked",
            bookings,
          });

          continue;
        }

        entriesByDate.set(date, {
          id: `confirmed-booking:${date}`,
          partner_id:
            currentPartnerId,
          date,
          status: "booked",
          note: null,
          created_at: "",
          updated_at: "",
          bookings,
        });
      }

      setEntries(
        Array.from(
          entriesByDate.values(),
        ).sort((first, second) =>
          first.date.localeCompare(
            second.date,
          ),
        ),
      );
    } catch (error) {
      console.error(
        "PARTNER CALENDAR LOAD ERROR:",
        error,
      );

      setEntries([]);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Kalenterin lataaminen epäonnistui.",
      );
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const days = useMemo(
    () =>
      createCalendarDays(
        year,
        month,
        entries,
      ),
    [year, month, entries],
  );

  function previousMonth() {
    const next = moveMonth(
      year,
      month,
      -1,
    );

    setYear(next.year);
    setMonth(next.month);
  }

  function nextMonth() {
    const next = moveMonth(
      year,
      month,
      1,
    );

    setYear(next.year);
    setMonth(next.month);
  }

  function currentMonth() {
    const current = new Date();

    setYear(current.getFullYear());
    setMonth(current.getMonth());
  }

  function hasConfirmedBooking(
    date: string,
  ) {
    return entries.some(
      (entry) =>
        entry.date === date &&
        Boolean(
          entry.bookings?.length,
        ),
    );
  }

  async function saveEntry(
    date: string,
    status: CalendarEntryStatus,
    note: string,
  ) {
    if (!partnerId || processingDate) {
      return false;
    }

    if (hasConfirmedBooking(date)) {
      setErrorMessage(
        "Vahvistettua asiakasvarausta ei voi muuttaa käsin.",
      );

      return false;
    }

    try {
      setProcessingDate(date);
      setErrorMessage("");

      const {
        data,
        error,
      } = await supabase
        .from(
          "partner_calendar_entries",
        )
        .upsert(
          {
            partner_id: partnerId,
            date,
            status,
            note:
              note.trim() || null,
            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict:
              "partner_id,date",
          },
        )
        .select(`
          id,
          partner_id,
          date,
          status,
          note,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        throw error;
      }

      const savedEntry = {
        ...(data as CalendarEntry),
        bookings: [],
      };

      setEntries((current) => [
        ...current.filter(
          (entry) =>
            entry.date !==
            savedEntry.date,
        ),
        savedEntry,
      ]);

      return true;
    } catch (error) {
      console.error(
        "PARTNER CALENDAR SAVE ERROR:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Kalenterimerkinnän tallentaminen epäonnistui.",
      );

      return false;
    } finally {
      setProcessingDate(null);
    }
  }

  async function deleteEntry(
    date: string,
  ) {
    if (!partnerId || processingDate) {
      return false;
    }

    if (hasConfirmedBooking(date)) {
      setErrorMessage(
        "Vahvistettua asiakasvarausta ei voi poistaa kalenterista.",
      );

      return false;
    }

    try {
      setProcessingDate(date);
      setErrorMessage("");

      const { error } = await supabase
        .from(
          "partner_calendar_entries",
        )
        .delete()
        .eq(
          "partner_id",
          partnerId,
        )
        .eq("date", date);

      if (error) {
        throw error;
      }

      setEntries((current) =>
        current.filter(
          (entry) =>
            entry.date !== date,
        ),
      );

      return true;
    } catch (error) {
      console.error(
        "PARTNER CALENDAR DELETE ERROR:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Kalenterimerkinnän poistaminen epäonnistui.",
      );

      return false;
    } finally {
      setProcessingDate(null);
    }
  }

  return {
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
    reload: loadEntries,
  };
}