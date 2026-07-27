"use client";

import Hero from "@/components/layout/Hero";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

import QuoteForm from "@/components/forms/QuoteForm";
import ServiceSelector from "@/components/forms/ServiceSelector";
import SubmitSection from "@/components/forms/SubmitSection";

import {
  HOME_SERVICES,
} from "@/components/home/constants";

import HowItWorks from "@/components/sections/HowItWorks";
import PartnerCTA from "@/components/sections/PartnerCTA";
import TrustSection from "@/components/sections/TrustSection";

import {
  useHomeQuote,
} from "./useHomeQuote";

export default function HomePage() {
  const {
    event,
    setEvent,
    selectedServices,
    loading,
    errorMsg,
    toggleService,
    submit,
  } = useHomeQuote();

  const eventComplete = Boolean(
    event.date &&
      event.eventType &&
      event.location &&
      event.guests.trim() &&
      event.email.trim(),
  );

  const servicesComplete =
    selectedServices.length > 0;

  return (
    <>
      <PublicHeader />

      <main className="min-h-screen bg-[#fbf8f2] text-[#211b16]">
        <Hero />

        <HowItWorks />

        <QuoteForm
          event={event}
          setEvent={setEvent}
        />

        <ServiceSelector
          services={HOME_SERVICES}
          selectedServices={
            selectedServices
          }
          onToggle={
            toggleService
          }
        />

        <SubmitSection
          loading={loading}
          errorMsg={errorMsg}
          eventComplete={
            eventComplete
          }
          servicesComplete={
            servicesComplete
          }
          onSubmit={() =>
            void submit()
          }
        />

        <TrustSection />

        <PartnerCTA />
      </main>

      <PublicFooter />
    </>
  );
}