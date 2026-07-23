"use client";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  HomeQuoteEvent,
} from "@/app/useHomeQuote";

import {
  FINNISH_LOCATIONS,
} from "@/lib/locations";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { EVENT_TYPES } from "@/lib/events";
type QuoteFormProps = {
  event: HomeQuoteEvent;

  setEvent: Dispatch<
    SetStateAction<HomeQuoteEvent>
  >;
};


export default function QuoteForm({
  event,
  setEvent,
}: QuoteFormProps) {
  const minimumDate =
    getMinimumEventDate();

  return (
    <section
      id="tarjouspyynto"
      className="scroll-mt-24 bg-[#fbf8f2] px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#decba9] bg-white px-4 py-2 text-sm font-bold text-[#87652f] shadow-sm">
            <span aria-hidden="true">
              ✨
            </span>

            Maksuton tarjouspyyntö
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[#a47c3c]">
            Vaihe 1/3
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#211b16] sm:text-4xl">
            Kerro tapahtumasi tiedot
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#70675e] sm:text-base">
            Täytä tapahtuman perustiedot.
            Seuraavaksi valitset tarvitsemasi
            palvelut ja tarkistat pyynnön
            ennen lähettämistä.
          </p>
        </div>

        <Card className="overflow-hidden border-[#e2d5c4] bg-white p-0 shadow-[0_18px_50px_rgba(73,53,31,0.08)]">
          <div className="border-b border-[#eee5d9] bg-[#fffaf2] px-5 py-5 sm:px-8">
            <h3 className="text-lg font-bold text-[#211b16]">
              Tapahtuman perustiedot
            </h3>

            <p className="mt-1 text-sm text-[#70675e]">
              Tähdellä merkityt kentät ovat
              pakollisia.
            </p>
          </div>

          <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-2">
            <Input
              id="event-date"
              label="Päivämäärä *"
              type="date"
              min={minimumDate}
              value={event.date}
              onChange={(eventChange) =>
                setEvent(
                  (current) => ({
                    ...current,
                    date: eventChange
                      .target.value,
                  }),
                )
              }
            />

            <Select
              id="event-type"
              label="Tapahtuman tyyppi *"
              value={
                event.eventType
              }
              onChange={(eventChange) =>
                setEvent(
                  (current) => ({
                    ...current,
                    eventType:
                      eventChange
                        .target.value,
                  }),
                )
              }
            >
              <option value="">
                Valitse tapahtuman tyyppi
              </option>

              {EVENT_TYPES.map(
                (eventType) => (
                  <option
                    key={eventType}
                    value={eventType}
                  >
                    {eventType}
                  </option>
                ),
              )}
            </Select>

            <Select
              id="event-location"
              label="Paikkakunta *"
              value={event.location}
              onChange={(eventChange) =>
                setEvent(
                  (current) => ({
                    ...current,
                    location:
                      eventChange
                        .target.value,
                  }),
                )
              }
            >
              <option value="">
                Valitse paikkakunta
              </option>

              {FINNISH_LOCATIONS.map(
                (location) => (
                  <option
                    key={location}
                    value={location}
                  >
                    {location}
                  </option>
                ),
              )}
            </Select>

            <Input
              id="event-guests"
              label="Vierasmäärä *"
              type="number"
              min={1}
              max={10000}
              inputMode="numeric"
              value={event.guests}
              placeholder="Esimerkiksi 80"
              onChange={(eventChange) =>
                setEvent(
                  (current) => ({
                    ...current,
                    guests:
                      eventChange
                        .target.value,
                  }),
                )
              }
            />

            <Input
              id="event-email"
              label="Sähköposti *"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={event.email}
              placeholder="sinä@esimerkki.fi"
              onChange={(eventChange) =>
                setEvent(
                  (current) => ({
                    ...current,
                    email:
                      eventChange
                        .target.value,
                  }),
                )
              }
            />

            <Input
              id="event-budget"
              label="Kokonaisbudjetti (€)"
              type="number"
              min={0}
              inputMode="numeric"
              value={event.budget}
              placeholder="Esimerkiksi 3000"
              onChange={(eventChange) =>
                setEvent(
                  (current) => ({
                    ...current,
                    budget:
                      eventChange
                        .target.value,
                  }),
                )
              }
            />

            <div className="md:col-span-2">
              <Textarea
                id="event-notes"
                label="Lisätiedot"
                maxLength={2000}
                value={event.notes}
                placeholder="Kerro esimerkiksi juhlan teemasta, ruokavalioista, aikataulusta tai muista erityistoiveista."
                onChange={(eventChange) =>
                  setEvent(
                    (current) => ({
                      ...current,
                      notes:
                        eventChange
                          .target.value,
                    }),
                  )
                }
              />

              <div className="mt-2 flex flex-col gap-1 text-xs text-[#91877d] sm:flex-row sm:justify-between">
                <span>
                  Valinnainen kenttä
                </span>

                <span>
                  {event.notes.length}/
                  2000 merkkiä
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#d7e1ef] bg-[#f3f7fc] p-4">
          <span
            aria-hidden="true"
            className="text-lg"
          >
            ℹ️
          </span>

          <p className="text-sm leading-6 text-[#4c627e]">
            Tapahtumapäivän tulee olla
            vähintään kolmen päivän päässä,
            jotta palveluntarjoajilla on aikaa
            valmistella tarjous.
          </p>
        </div>
      </div>
    </section>
  );
}

function getMinimumEventDate() {
  const minimumDate = new Date();

  minimumDate.setHours(
    0,
    0,
    0,
    0,
  );

  minimumDate.setDate(
    minimumDate.getDate() + 3,
  );

  const year =
    minimumDate.getFullYear();

  const month = String(
    minimumDate.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    minimumDate.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}