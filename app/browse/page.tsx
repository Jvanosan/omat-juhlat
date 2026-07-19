"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BrowseHero from "@/components/browse/BrowseHero";
import BrowseFilters from "@/components/browse/BrowseFilters";
import PartnerCard from "@/components/browse/PartnerCard";
import PartnerGrid from "@/components/browse/PartnerGrid";
import SelectedPartnersBar from "@/components/browse/SelectedPartnersBar";
import RequestForm from "@/components/browse/RequestForm";


// ✅ LOPULLINEN palveluiden puhdistus + normalisointi
function cleanAndNormalizeServices(raw: any): string[] {


  if (!raw) return [];

  let str = Array.isArray(raw) ? raw.join(",") : String(raw);

  str = str
    .replace(/[\[\]\(\)"']/g, "")
    .replace(/&/g, ",")
    .replace(/\//g, ",");

  const parts = str
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const map: Record<string, string> = {
    "juhlatila": "Juhlatila",
    "juhla tila": "Juhlatila",
    "juhla-tila": "Juhlatila",
    "juhlatilat": "Juhlatila",
    "catering": "Catering",
    "ravintola": "Catering",
    "ruokailu": "Catering",
    "dj": "DJ / Musiikki",
    "musiikki": "DJ / Musiikki",
    "dj musiikki": "DJ / Musiikki",
    "dj & musiikki": "DJ / Musiikki",
    "dj / musiikki": "DJ / Musiikki",
    "valokuvaaja": "Valokuvaus",
    "valokuvaus": "Valokuvaus",
    "kuvaaja": "Valokuvaus",
    "somistus": "Somistus / Koristelu",
    "koristelu": "Somistus / Koristelu",
    "event planner": "Tapahtumasuunnittelu",
    "leipomo": "Leipomo / Kakut",
    "kakut": "Leipomo / Kakut",
    "leipomo kakut": "Leipomo / Kakut",
  };

  return Array.from(
    new Set(parts.map((p) => map[p] || p.charAt(0).toUpperCase() + p.slice(1)))
  );
}
function getPartnerServices(partner: any): string[] {
  return Array.from(
    new Set([
      ...cleanAndNormalizeServices(partner.category),
      ...cleanAndNormalizeServices(partner.services),
    ])
  );
}
export default function BrowsePage() {
const [toast, setToast] = useState<{
  partnerId: string;
  company: string;
} | null>(null);
const searchParams = useSearchParams();
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const [loadingPartners,setLoadingPartners]=useState(true);
const [partnersError,setPartnersError]=useState("");

const minDate = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
})();
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
const EVENT_TYPES = [
  "Häät",
  "Syntymäpäivä",
  "Valmistujaiset",
  "Yritysjuhla",
  "Ristiäiset",
  "Muu juhla",
];
  const [partners, setPartners] = useState<any[]>([]);
  const [areaFilter, setAreaFilter] = useState("Kaikki");
  const [serviceFilter, setServiceFilter] = useState("Kaikki");
 const [notes, setNotes] = useState("");
  useEffect(() => {
  const fetchPartners = async () => {
    setLoadingPartners(true);
    setPartnersError("");

    const { data, error } = await supabase
  .from("partners")
  .select(
    "id, company, area, category, services, images, logo_url, cover_image_url, slug, profile_completed"
  )
  .eq("status", "approved")
  .eq("profile_completed", true);

    if (error) {
      console.error("SUPABASE PARTNERS ERROR:", error);
      setPartnersError("Yrityksiä ei voitu ladata.");
      setLoadingPartners(false);
      return;
    }

    setPartners(data || []);
    setLoadingPartners(false);
  };

  fetchPartners();
}, []);
  const areas = [
    "Kaikki",
    ...Array.from(new Set(partners.map((p) => p.area))).filter(Boolean),
  ];

  const services = [
  "Kaikki",
  ...Array.from(
    new Set(partners.flatMap((partner) => getPartnerServices(partner)))
  ).sort((a, b) => a.localeCompare(b, "fi")),
];

  const groupedPartners = partners.reduce((acc: any, company: any) => {
const companyServices = getPartnerServices(company);
    companyServices.forEach((service) => {
      if (serviceFilter !== "Kaikki" && service !== serviceFilter) return;
      if (areaFilter !== "Kaikki" && company.area !== areaFilter) return;

      if (!acc[service]) acc[service] = {};
      if (!acc[service][company.area]) acc[service][company.area] = [];

      acc[service][company.area].push(company);
    });

    return acc;
  }, {});


useEffect(() => {
  const partnerId = searchParams.get("select");

  if (!partnerId) return;

  setSelectedPartners((prev) => {
    if (prev.includes(partnerId)) return prev;
    return [...prev, partnerId];
  });

  const url = new URL(window.location.href);
  url.searchParams.delete("select");

  window.history.replaceState({}, "", url.toString());
}, [searchParams]);

useEffect(() => {
  if (!toast) return;

  const timeout = window.setTimeout(() => {
    setToast(null);
  }, 3500);

  return () => window.clearTimeout(timeout);
}, [toast]);

  const handleSubmit = async () => {
    const cleanEmail = email.trim();

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(cleanEmail)) {
  alert("Anna kelvollinen sähköpostiosoite.");
  return;
}
if (
  !email ||
  !eventType ||
  !eventDate ||
  !guests ||
  selectedPartners.length === 0
) {
alert(
"Valitse tapahtumatyyppi, täytä sähköposti, päivämäärä, vierasmäärä ja valitse vähintään yksi yritys."
);
 return;
    }

    setSending(true);

    const { data: createdRequest, error } = await supabase
  .from("direct_requests")
  .insert({
    email: cleanEmail,
    event_date: eventDate,
    guests: Number(guests),
    partner_ids: selectedPartners,
    notes: notes.trim(),
    status: "new",
  })
  .select()
  .single();

if (error) {
  console.error("Tarjouspyynnön tallennus epäonnistui:", error);
  alert(`Tarjouspyynnön lähetys epäonnistui: ${error.message}`);
  return;
}

console.log("Tarjouspyyntö lähetetty suoraan partnereille:", createdRequest);

    await fetch("/api/send-direct-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      email: cleanEmail,
        event_date: eventDate,
        guests,
        partner_ids: selectedPartners,
         notes,
      }),
    });

    setSending(false);
    setSuccess(true);
  };

  const visiblePartnerCount = new Set(
  Object.values(groupedPartners)
    .flatMap((areaGroups: any) => Object.values(areaGroups))
    .flat()
    .map((partner: any) => partner.id)
).size;


  return (
    <div className="min-h-screen bg-zinc-950 text-white">

<BrowseHero />

<div className="max-w-5xl mx-auto px-6 py-10">
  <BrowseFilters
    areas={areas}
    services={services}
    areaFilter={areaFilter}
    serviceFilter={serviceFilter}
    onAreaChange={setAreaFilter}
    onServiceChange={setServiceFilter}
  />

  <div className="mb-6 text-zinc-400">
    Löytyi{" "}
    <strong className="text-white">
      {visiblePartnerCount}
    </strong>{" "}
    yritystä nykyisillä suodattimilla.
  </div>

  {loadingPartners && (
    <div className="py-10 text-center text-zinc-400">
      Ladataan palveluntarjoajia...
    </div>
  )}

  {partnersError && (
    <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-400">
      {partnersError}
    </div>
  )}


{/* Service Groups */}
        {Object.keys(groupedPartners).length === 0 && (
          <div className="text-center py-16 text-zinc-400">
            Ei palveluita valituilla suodattimilla.
          </div>
        )}

<PartnerGrid>
            {Object.entries(groupedPartners).map(([service, areasObj]: any) => (
            <div key={service}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-zinc-800" />
                <h2 className="text-2xl font-semibold tracking-tight">{service}</h2>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              {Object.entries(areasObj).map(([area, companies]: any) => (
                <div key={area} className="mb-8">
                  <div className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                    <span>{area}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {companies.map((company: any) => {
                      const checked = selectedPartners.includes(company.id);

                     return (
  <PartnerCard
  key={`${service}-${area}-${company.id}`}
  company={company}
  checked={checked}
  normalizedServices={getPartnerServices(company)}
onToggle={() => {
  if (checked) {
    setSelectedPartners((prev) =>
      prev.filter((id) => id !== company.id)
    );

    setToast(null);
    return;
  }

  setSelectedPartners((prev) => [...prev, company.id]);

  setToast({
    partnerId: company.id,
    company: company.company,
  });
}}
/>
);

                    })}
                                    </div>

                </div>
              ))}
            </div>
          ))}
          </PartnerGrid>

<SelectedPartnersBar
  partners={partners}
  selectedPartners={selectedPartners}
  onClear={() => setSelectedPartners([])}
/>
<RequestForm
  success={success}
  eventType={eventType}
  email={email}
  eventDate={eventDate}
  guests={guests}
  notes={notes}
  sending={sending}
  minDate={minDate}
  eventTypes={EVENT_TYPES}
  selectedPartnersCount={selectedPartners.length}
  onEventTypeChange={setEventType}
  onEmailChange={setEmail}
  onEventDateChange={setEventDate}
  onGuestsChange={(value) => {
    const numericValue = Math.min(
      5000,
      Math.max(1, Number(value))
    );

    setGuests(value === "" ? "" : String(numericValue));
  }}
  onNotesChange={setNotes}
  onSubmit={handleSubmit}
/>
    </div>
{toast && (
  <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-emerald-700 bg-zinc-900 p-4 shadow-2xl">
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-white">
        ✅ <strong>{toast.company}</strong> lisättiin tarjouspyyntöösi.
      </p>

      <button
        type="button"
        onClick={() => {
          setSelectedPartners((prev) =>
            prev.filter((id) => id !== toast.partnerId)
          );
          setToast(null);
        }}
        className="shrink-0 text-sm font-medium text-emerald-400 hover:text-emerald-300"
      >
        Kumoa
      </button>
    </div>
  </div>
)}
    </div>
  );
}