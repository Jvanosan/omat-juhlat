"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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

export default function BrowsePage() {

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
      .select("id, company, area, services,images")
      .eq("status", "approved");

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
      new Set(partners.flatMap((p) => cleanAndNormalizeServices(p.services)))
    ),
  ];

  const groupedPartners = partners.reduce((acc: any, company: any) => {
    const companyServices = cleanAndNormalizeServices(company.services);

    companyServices.forEach((service) => {
      if (serviceFilter !== "Kaikki" && service !== serviceFilter) return;
      if (areaFilter !== "Kaikki" && company.area !== areaFilter) return;

      if (!acc[service]) acc[service] = {};
      if (!acc[service][company.area]) acc[service][company.area] = [];

      acc[service][company.area].push(company);
    });

    return acc;
  }, {});

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
  !location ||
  !eventType ||
  !eventDate ||
  !guests ||
  selectedPartners.length === 0
) {
alert(
  "Valitse paikkakunta, tapahtumatyyppi, täytä sähköposti, päivämäärä, vierasmäärä ja valitse vähintään yksi yritys."
);
 return;
    }

    setSending(true);

    const { error } = await supabase.from("direct_requests").insert({
      email: cleanEmail,
      event_date: eventDate,
      guests: Number(guests),
      partner_ids: selectedPartners,
      notes, 
    });

    if (error) {
      console.error("DIRECTREQUESTS INSERT ERROR:", error);
      alert(error.message);
      setSending(false);
      return;
    }

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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
{/* Hero / Header */}
      <div className="relative h-[220px] md:h-[280px] flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/juhlat.png')" }}
        />
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="relative max-w-5xl mx-auto px-6 pb-10">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Löydä palvelut tapahtumaasi
          </h1>

          <p className="mt-3 text-lg text-zinc-300 max-w-md">
            Valitse haluamasi palveluntarjoajat ja lähetä tarjouspyyntö suoraan heille.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
         {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Alue
              </label>
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white focus:outline-none focus:border-emerald-600"
              >
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Palvelu
              </label>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white focus:outline-none focus:border-emerald-600"
              >
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
<div className="mb-6 text-zinc-400">

Löytyi

<strong className="text-white">

{" "}
{Object.values(groupedPartners)
.flatMap((x:any)=>Object.values(x))
.flat()
.length}

</strong>

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

        <div className="space-y-12">
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
                        <label
  key={company.id}
  className={`relative rounded-2xl border overflow-hidden cursor-pointer transition-all
  ${
    checked
      ? "border-emerald-500 bg-emerald-950/40 scale-[1.02] shadow-lg"
      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:scale-[1.01]"
  }`}
>

  {/* ✅ TÄHÄN LISÄÄ */}
  {checked && (
    <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full">
      Valittu
    </div>
  )}


                          <div className="absolute top-3 right-3">
  <input
    type="checkbox"
    checked={checked}
    onChange={() => {
      setSelectedPartners((prev) =>
        checked
          ? prev.filter((id) => id !== company.id)
          : [...prev, company.id]
      );
    }}
    className="accent-emerald-500 scale-125"
  />
</div>

{company.images && (
  <div className="flex gap-2 overflow-x-auto p-2">
    {company.images.split(",").map((img: string, i: number) => (
      <img
        key={i}
        src={img.trim()}
        alt={company.company}
        className="h-24 w-32 object-cover rounded-lg"
      />
    ))}
  </div>
)}

<div className="p-4 pt-0">
  <span className="font-medium text-white block">
    {company.company}
  </span>
  <p className="text-sm text-zinc-400 mt-1">
  📍 {company.area}
</p>

<p className="text-sm text-zinc-500">
  {cleanAndNormalizeServices(company.services).join(", ")}
</p>
</div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {selectedPartners.length > 0 && (
<div className="sticky top-4 z-20 mb-10 rounded-2xl border border-emerald-800 bg-zinc-900 p-5 shadow-lg">   
   <h3 className="text-xl font-semibold text-emerald-400 mb-3">
    <button
  onClick={() => setSelectedPartners([])}
  className="mb-3 rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
>
  Tyhjennä valinnat
</button>
      📋 Valitsemasi palveluntarjoajat ({selectedPartners.length})
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {partners
        .filter((partner) =>
          selectedPartners.includes(partner.id)
        )
        .map((partner) => (
          <div
  key={partner.id}
  className="flex gap-3 items-center rounded-xl bg-zinc-800 p-3"
>
           
            ✅ {partner.company}
          </div>
        ))}
    </div>
  </div>
)}

{/* Request Form */}
        <div className="mt-16 max-w-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Lähetä tarjouspyyntö</h2>
            <p className="text-zinc-400 mt-1">Pyyntö lähetetään vain valitsemillesi palveluntarjoajille.</p>
            <div className="mt-4 rounded-2xl border border-emerald-900 bg-emerald-950/30 p-4">
  <div className="font-medium text-emerald-400">
    🔒 Turvallinen tarjouspyyntö
  </div>

  <p className="text-sm text-zinc-300 mt-1">
    Tarjouspyyntö lähetetään vain valitsemillesi palveluntarjoajille.
    Tietojasi ei lähetetä muille yrityksille.
  </p>
</div>
          </div>

          {success ? (
            <div className="rounded-2xl border border-emerald-900 bg-emerald-950/40 p-6 text-emerald-400">
              ✅ Tarjouspyyntö lähetetty onnistuneesti!
            </div>
          ) : (
            <div className="space-y-4">
            <select
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white focus:outline-none focus:border-emerald-700"
>
  <option value="">Valitse paikkakunta</option>

  {LOCATIONS.map((city) => (
    <option key={city} value={city}>
      {city}
    </option>
  ))}
</select>
<select
  value={eventType}
  onChange={(e) => setEventType(e.target.value)}
  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white focus:outline-none focus:border-emerald-700"
>
  <option value="">Valitse tapahtuman tyyppi</option>

  {EVENT_TYPES.map((type) => (
    <option key={type} value={type}>
      {type}
    </option>
  ))}
</select>
              <div>
                <input
                  type="email"
                  placeholder="Sähköpostiosoitteesi"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
  type="date"
  min={minDate}
  value={eventDate}
  onChange={(e) => setEventDate(e.target.value)}
  className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white focus:outline-none focus:border-emerald-700"
/>
                <input
  type="number"
  min={1}
  max={5000}
  placeholder="Arvioitu vierasmäärä"
  value={guests}
  onChange={(e) => {
    const value = Math.min(
      5000,
      Math.max(1, Number(e.target.value))
    );
    setGuests(
      e.target.value === "" ? "" : String(value)
    );
  }}
  className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-700"
/>
              </div>
              <textarea
  placeholder="Lisätiedot (valinnainen)"
  maxLength={1000}
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-700"
/>

<p className="text-right text-xs text-zinc-500">
  {1000 - notes.length} merkkiä jäljellä
</p>
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="w-full mt-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 transition px-6 py-4 font-semibold text-lg active:scale-[0.985]"
              >
                {sending ? "Lähetetään..." : "Lähetä tarjouspyyntö"}
              </button>

              {selectedPartners.length > 0 && (
  <p className="text-center text-sm text-emerald-400">
    Tarjouspyyntö lähetetään {selectedPartners.length} valitulle palveluntarjoajalle.
  </p>
)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}