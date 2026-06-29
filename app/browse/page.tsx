``tsx
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
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const [partners, setPartners] = useState<any[]>([]);
  const [areaFilter, setAreaFilter] = useState("Kaikki");
  const [serviceFilter, setServiceFilter] = useState("Kaikki");

  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("id, company, area, services")
        .eq("status", "approved");

      if (error) {
        console.error("SUPABASE PARTNERS ERROR:", error);
      }

      setPartners(data || []);
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
    if (!email || !eventDate || !guests || selectedPartners.length === 0) {
      alert("Täytä kaikki kentät ja valitse vähintään yksi yritys.");
      return;
    }

    setSending(true);

    const { error } = await supabase.from("direct_requests").insert({
      email,
      event_date: eventDate,
      guests: Number(guests),
      partner_ids: selectedPartners,
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
        email,
        event_date: eventDate,
        guests,
        partner_ids: selectedPartners,
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
                          className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all
  ${
    checked
      ? "border-emerald-600 bg-emerald-950/30"
      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900"
  }`}
                        >

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
                            className="accent-emerald-500 scale-110"
                          />
                          <span className="font-medium text-white">{company.company}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

{/* Request Form */}
        <div className="mt-16 max-w-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Lähetä tarjouspyyntö</h2>
            <p className="text-zinc-400 mt-1">Pyyntö lähetetään vain valitsemillesi palveluntarjoajille.</p>
          </div>

          {success ? (
            <div className="rounded-2xl border border-emerald-900 bg-emerald-950/40 p-6 text-emerald-400">
              ✅ Tarjouspyyntö lähetetty onnistuneesti!
            </div>
          ) : (
            <div className="space-y-4">
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
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white focus:outline-none focus:border-emerald-700"
                />
                <input
                  type="number"
                  placeholder="Arvioitu vierasmäärä"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={sending}
                className="w-full mt-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 transition px-6 py-4 font-semibold text-lg active:scale-[0.985]"
              >
                {sending ? "Lähetetään..." : "Lähetä tarjouspyyntö"}
              </button>

              {selectedPartners.length > 0 && (
                <p className="text-center text-sm text-zinc-500">
                  Valittu {selectedPartners.length} palveluntarjoajaa
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}