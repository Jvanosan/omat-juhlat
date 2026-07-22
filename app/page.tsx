"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/layout/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import TrustSection from "@/components/sections/TrustSection";
import PartnerCTA from "@/components/sections/PartnerCTA";
import QuoteForm from "@/components/forms/QuoteForm";
import ServiceSelector from "@/components/forms/ServiceSelector";
import SubmitSection from "@/components/forms/SubmitSection";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";

const EVENT_TYPES = [
  "Syntymäpäivä",
  "Häät",
  "Valmistujaiset",
  "Yritysjuhla",
  "Ristiäiset",
  "Muu juhla",
];

const SERVICES = [
  { id: "juhlatila", label: "Juhlatila" },
  { id: "catering", label: "Catering" },
  { id: "dj", label: "DJ" },
  { id: "band", label: "Bändi / live-musiikki" },
  { id: "photographer", label: "Valokuvaaja" },
  { id: "decor", label: "Somistus / koristelu" },
];

export default function HomePage() {
  const router = useRouter();

  const [event, setEvent] = useState({
    date: "",
    eventType: "",
    location: "",
    guests: "",
    budget: "",
    email: "",
    notes: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  }

async function submit() {
  if (loading) return;

  setErrorMsg("");

  const cleanEmail = event.email.trim();
  const guests = Number(event.guests);

  if (
    !event.date ||
    !event.eventType ||
    !event.location ||
    !event.guests ||
    !cleanEmail ||
    selectedServices.length === 0
  ) {
    setErrorMsg(
      "Täytä päivämäärä, tapahtumatyyppi, paikkakunta, vierasmäärä, sähköposti ja valitse vähintään yksi palvelu."
    );
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(cleanEmail)) {
    setErrorMsg("Anna kelvollinen sähköpostiosoite.");
    return;
  }

  if (!Number.isInteger(guests) || guests < 1) {
    setErrorMsg("Vierasmäärän täytyy olla vähintään 1.");
    return;
  }

  if (guests > 10000) {
    setErrorMsg("Vierasmäärä on liian suuri.");
    return;
  }

  const budget =
    event.budget.trim() === ""
      ? null
      : Number(event.budget);

  if (
    budget !== null &&
    (!Number.isFinite(budget) || budget < 0)
  ) {
    setErrorMsg("Budjetin täytyy olla 0 tai sitä suurempi.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/request-quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: event.date,
        eventType: event.eventType,
        location: event.location,
        guests,
        email: cleanEmail,
        budget,
        services: selectedServices,
        notes: event.notes.trim(),
      }),
    });

    const responseText = await response.text();

let result: any = {};

if (responseText) {
  try {
    result = JSON.parse(responseText);
  } catch {
    console.error("API RETURNED INVALID RESPONSE:", responseText);

    setErrorMsg(
      `Palvelin palautti virheellisen vastauksen. HTTP ${response.status}`
    );
    return;
  }
}

if (!response.ok) {
  console.error("REQUEST QUOTE API ERROR:", {
    status: response.status,
    responseText,
  });

  setErrorMsg(
    result.error ||
      `Tarjouspyynnön lähettäminen epäonnistui. HTTP ${response.status}`
  );
  return;
}

    if (!result.quoteId || !result.accessToken) {
  setErrorMsg(
    "Tarjouspyyntö tallennettiin, mutta turvallista linkkiä ei saatu.",
  );
  return;
}

    if (result.matchedPartners === 0) {
      alert(
        "Tarjouspyyntö tallennettiin, mutta sopivia palveluntarjoajia ei löytynyt vielä."
      );
    }

    router.push(
  `/quote/${result.quoteId}?token=${encodeURIComponent(
    result.accessToken,
  )}`,
);
  } catch (error) {
    console.error("REQUEST QUOTE ERROR:", error);

    setErrorMsg(
      "Yhteys palvelimeen epäonnistui. Yritä hetken kuluttua uudelleen."
    );
  } finally {
    setLoading(false);
  }
}
  return (
  <>
    <PublicHeader />

    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/juhlat.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: "20px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          padding: "20px",
          borderRadius: "16px",
        }}
      >
       <Hero />
       <HowItWorks />
       <section
  id="tarjouspyynto"
  className="scroll-mt-6"
>
        <QuoteForm
  event={event}
  setEvent={setEvent}
/>

<ServiceSelector
  services={SERVICES}
  selectedServices={selectedServices}
  onToggle={toggleService}
/>

<SubmitSection
  loading={loading}
  errorMsg={errorMsg}
  eventComplete={Boolean(
    event.date &&
      event.eventType &&
      event.location &&
      event.guests &&
      event.email
  )}
  servicesComplete={selectedServices.length > 0}
  onSubmit={submit}
/>    
</section>
<TrustSection />
<PartnerCTA />

      </div>
        </main>
          <PublicFooter />
  </>
  );
}