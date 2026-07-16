"use client";

import type { Dispatch, SetStateAction } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

export type QuoteEventData = {
  date: string;
  eventType: string;
  location: string;
  guests: string;
  budget: string;
  email: string;
  notes: string;
};

type QuoteFormProps = {
  event: QuoteEventData;
  setEvent: Dispatch<SetStateAction<QuoteEventData>>;
};

const EVENT_TYPES = [
  "Syntymäpäivä",
  "Häät",
  "Valmistujaiset",
  "Yritysjuhla",
  "Ristiäiset",
  "Muu juhla",
];

const LOCATIONS = [
  "Helsinki",
  "Espoo",
  "Vantaa",
  "Tampere",
  "Turku",
  "Oulu",
  "Jyväskylä",
  "Lahti",
  "Kuopio",
  "Joensuu",
  "Pori",
  "Vaasa",
  "Rovaniemi",
  "Seinäjoki",
  "Lappeenranta",
  "Kotka",
  "Mikkeli",
  "Hämeenlinna",
  "Salo",
  "Kokkola",
  "Kajaani",
  "Rauma",
  "Porvoo",
  "Hyvinkää",
  "Järvenpää",
  "Lohja",
  "Kerava",
  "Tuusula",
  "Nurmijärvi",
  "Ylöjärvi",
  "Nokia",
  "Kangasala",
  "Riihimäki",
  "Savonlinna",
  "Imatra",
  "Raahe",
  "Iisalmi",
  "Varkaus",
  "Kemi",
  "Tornio",
  "Pietarsaari",
  "Forssa",
  "Valkeakoski",
  "Kuusamo",
  "Kempele",
  "Sipoo",
  "Kirkkonummi",
  "Vihti",
  "Lempäälä",
  "Pirkkala",
];

export default function QuoteForm({
  event,
  setEvent,
}: QuoteFormProps) {
  const minimumDate = new Date(
    Date.now() + 3 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  return (
    <section
      id="lomake"
      className="bg-[#faf8f5] px-5 py-16 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#9a773b]">
            Aloita tarjouspyyntö
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
            Kerro tapahtumasi tiedot
          </h2>

          <p className="mt-4 text-gray-600">
            Täytä perustiedot. Voit tarkentaa palvelutoiveita seuraavaksi.
          </p>
        </div>

        <Card className="p-5 sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              id="event-date"
              label="Päivämäärä *"
              type="date"
              min={minimumDate}
              value={event.date}
              onChange={(e) =>
                setEvent((current) => ({
                  ...current,
                  date: e.target.value,
                }))
              }
            />

            <Select
              id="event-type"
              label="Tapahtuman tyyppi *"
              value={event.eventType}
              onChange={(e) =>
                setEvent((current) => ({
                  ...current,
                  eventType: e.target.value,
                }))
              }
            >
              <option value="">Valitse tapahtuman tyyppi</option>

              {EVENT_TYPES.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {eventType}
                </option>
              ))}
            </Select>

            <Select
              id="event-location"
              label="Paikkakunta *"
              value={event.location}
              onChange={(e) =>
                setEvent((current) => ({
                  ...current,
                  location: e.target.value,
                }))
              }
            >
              <option value="">Valitse paikkakunta</option>

              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>

            <Input
              id="event-guests"
              label="Vierasmäärä *"
              type="number"
              min={1}
              max={10000}
              value={event.guests}
              placeholder="Kuinka monta vierasta?"
              onChange={(e) =>
                setEvent((current) => ({
                  ...current,
                  guests: e.target.value,
                }))
              }
            />

            <Input
              id="event-email"
              label="Sähköposti *"
              type="email"
              autoComplete="email"
              value={event.email}
              placeholder="esimerkki@domain.fi"
              onChange={(e) =>
                setEvent((current) => ({
                  ...current,
                  email: e.target.value,
                }))
              }
            />

            <Input
              id="event-budget"
              label="Budjetti euroina (valinnainen)"
              type="number"
              min={0}
              value={event.budget}
              placeholder="Esimerkiksi 3000"
              onChange={(e) =>
                setEvent((current) => ({
                  ...current,
                  budget: e.target.value,
                }))
              }
            />

            <div className="md:col-span-2">
              <Textarea
                id="event-notes"
                label="Lisätiedot (valinnainen)"
                maxLength={1000}
                value={event.notes}
                placeholder="Esimerkiksi juhlan teema, ruokavaliot tai erityistoiveet..."
                onChange={(e) =>
                  setEvent((current) => ({
                    ...current,
                    notes: e.target.value,
                  }))
                }
              />

              <p className="mt-2 text-right text-xs text-gray-500">
                {event.notes.length}/1000
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}