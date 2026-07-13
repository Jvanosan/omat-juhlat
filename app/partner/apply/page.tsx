"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PartnerApplyPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    description: "",
    service_category: "",
    city: "",
    website: "",
    notes: "",
  });

  async function handleSubmit() {
    if (
      !form.company_name ||
      !form.contact_name ||
      !form.email ||
      !form.phone ||
      !form.service_category ||
      !form.city
    ) {
      alert("Täytä kaikki pakolliset kentät.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("partner_applications")
      .insert({
        company_name: form.company_name,
        contact_name: form.contact_name,
        email: form.email.trim(),
        phone: form.phone,
        description: form.description,
        service_category: form.service_category,
        city: form.city,
        website: form.website || null,
        notes: form.notes || null,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSuccess(true);
  }

if (success) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white flex items-center justify-center px-6 py-10">

      <div className="max-w-2xl w-full rounded-3xl border border-emerald-500/20 bg-zinc-900/70 backdrop-blur-xl shadow-2xl p-8 sm:p-12 text-center">

        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-5xl">
          ✅
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Hakemus vastaanotettu
        </h1>

        <p className="text-lg text-zinc-300 leading-8">
          Kiitos kiinnostuksestasi liittyä OmatJuhlat-kumppaniksi.
          Hakemuksesi on vastaanotettu onnistuneesti.
        </p>

        <div className="my-8 h-px bg-zinc-800" />

        <div className="space-y-5 text-left">

          <div className="flex gap-4">
            <span className="text-emerald-400 text-xl">✓</span>
            <p className="text-zinc-300">
              Hakemuksesi tallennettiin turvallisesti järjestelmäämme.
            </p>
          </div>

          <div className="flex gap-4">
            <span className="text-emerald-400 text-xl">✓</span>
            <p className="text-zinc-300">
              Käymme jokaisen hakemuksen läpi yksilöllisesti.
            </p>
          </div>

          <div className="flex gap-4">
            <span className="text-emerald-400 text-xl">✓</span>
            <p className="text-zinc-300">
              Saat sähköpostia yleensä noin viikon kuluessa.
            </p>
          </div>

        </div>

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">

          <p className="text-sm text-zinc-400 leading-7">
            Hakemusten käsittelyaika voi vaihdella hakemusmäärän mukaan.
            Kiitos kärsivällisyydestäsi ja kiinnostuksestasi rakentaa
            OmatJuhlat-palvelua kanssamme.
          </p>

        </div>

      </div>

    </div>
  );
}
  return (
  <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">

    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">

      {/* HERO */}

      <div className="text-center mb-14">

        <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 mb-6">
          ✓ Luotettu kumppanihakemus
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Liity OmatJuhlat-
          <span className="text-emerald-400">
            kumppaniksi
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-zinc-300 text-lg leading-8">
          OmatJuhlat yhdistää asiakkaat ja luotettavat palveluntarjoajat
          yhteen paikkaan. Kumppanina saat uusia tarjouspyyntöjä,
          näkyvyyttä sekä mahdollisuuden kasvattaa liiketoimintaasi.
        </p>

      </div>

      {/* CARD */}

<div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-6 sm:p-10">
        <div className="mb-8">

          <h2 className="text-3xl font-bold tracking-tight mb-3">
  Kumppanihakemus
</h2>

<p className="text-zinc-300 leading-8 text-lg">            Täytä alla oleva lomake huolellisesti. Käymme kaikki
            hakemukset läpi yksitellen ja olemme yhteydessä sähköpostitse,
            mikäli hakemuksesi hyväksytään.
          </p>

        </div>

<div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
  <p className="text-sm text-zinc-300">
    <span className="font-semibold text-emerald-400">*</span> merkityt kentät ovat pakollisia.
    Tarkistamme jokaisen hakemuksen huolellisesti ennen kumppanuuden hyväksymistä.
  </p>
</div>

<div className="space-y-6">
        
<input
  placeholder="Yrityksen nimi *"
  value={form.company_name}
  onChange={(e) =>
    setForm({
      ...form,
      company_name: e.target.value,
    })
  }
  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-4"
/>
 

          <input
            placeholder="Yhteyshenkilön nimi *"
            value={form.contact_name}
            onChange={(e) =>
              setForm({
                ...form,
                contact_name: e.target.value,
              })
            }
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-4"
          />

          <input
            placeholder="Sähköposti *"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-4"
          />

          <input
            placeholder="Puhelinnumero *"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-4"
          />

          <input
            placeholder="Palvelukategoria *"
            value={form.service_category}
            onChange={(e) =>
              setForm({
                ...form,
                service_category: e.target.value,
              })
            }
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-4"
          />

          <input
            placeholder="Kaupunki *"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-4"
          />

          <input
            placeholder="Verkkosivusto (valinnainen)"
            value={form.website}
            onChange={(e) =>
              setForm({
                ...form,
                website: e.target.value,
              })
            }
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-4"
          />

          <textarea
            placeholder="Yrityksen kuvaus"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-4 min-h-[120px]"
          />

          <textarea
            placeholder="Lisätiedot"
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-4 min-h-[120px]"
          />

          <button
  onClick={handleSubmit}
  disabled={loading}
  className="
    w-full
    rounded-2xl
    bg-gradient-to-r
    from-emerald-500
    to-emerald-600
    hover:from-emerald-400
    hover:to-emerald-500
    disabled:opacity-60
    disabled:cursor-not-allowed
    py-4
    text-lg
    font-semibold
    shadow-lg
    shadow-emerald-500/20
    transition-all
    duration-300
    hover:scale-[1.01]
    hover:shadow-emerald-500/40
  "
>
  {loading ? "Lähetetään..." : "Lähetä hakemus"}
</button>
</div>
<div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
  <div className="grid gap-4 sm:grid-cols-3 text-center">

    <div>
      <div className="text-2xl mb-2">🔒</div>
      <p className="font-medium">Turvallinen hakemus</p>
      <p className="text-sm text-zinc-400 mt-1">
        Tietojasi käsitellään luottamuksellisesti.
      </p>
    </div>

    <div>
      <div className="text-2xl mb-2">⚡</div>
      <p className="font-medium">Nopea käsittely</p>
      <p className="text-sm text-zinc-400 mt-1">
        Pyrimme käsittelemään hakemukset noin viikon sisällä.
      </p>
    </div>

    <div>
      <div className="text-2xl mb-2">🤝</div>
      <p className="font-medium">Luotettava kumppanuus</p>
      <p className="text-sm text-zinc-400 mt-1">
        Rakennamme laadukasta palveluverkostoa yhdessä.
      </p>
      <p className="mt-4 text-center text-sm text-zinc-500">
  Hakemuksen lähettäminen ei sido yritystänne kumppanuuteen.
</p>
    </div>

  </div>
</div>
        </div>
      </div>
    </div>
  );
}