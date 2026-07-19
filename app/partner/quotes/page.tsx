"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import EmptyState from "@/components/partner/EmptyState";
import PartnerCard from "@/components/partner/PartnerCard";
import SectionHeader from "@/components/partner/SectionHeader";

type DirectRequest = {
  id: string;
  created_at: string;
  email: string | null;
  event_date: string | null;
  guests: number | null;
  partner_ids: string[] | null;
  notes: string | null;
  status: string | null;
  customer_name: string | null;
  phone: string | null;
  location: string | null;
  budget: string | null;
  services: string | null;
  event_type: string | null;
  viewed: boolean | null;
};

type CategoryRequest = {
  id: number;
  quotePartnerId: number;
  quotePartnerStatus: string | null;
  service: string | null;
  offerPrice: number | null;
  offerMessage: string | null;
  created_at: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  date: string | null;
  guests: number | null;
  budget: string | null;
  services: string | null;
  extraInfo: string | null;
  event_type: string | null;
  notes: string | null;
  requestStatus: string | null;
};

type QuotePartnerRow = {
  id: number;
  status: string | null;
  created_at: string;
  partner_id: string;
  service: string | null;
  quote_id: number;
  offer_price: number | null;
  offer_message: string | null;
};

type RequestQuoteRow = {
  id: number;
  status: string | null;
  created_at: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  date: string | null;
  guests: number | null;
  budget: string | null;
  services: string | null;
  extraInfo: string | null;
  event_type: string | null;
  notes: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "Päivämäärää ei ilmoitettu";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fi-FI").format(date);
}

function getStatusLabel(status: string | null) {
  switch (status?.toLowerCase()) {
    case "new":
    case "pending":
      return "Uusi";

    case "sent":
    case "offered":
      return "Tarjous lähetetty";

    case "accepted":
      return "Hyväksytty";

    case "rejected":
      return "Hylätty";

    case "closed":
      return "Suljettu";

    default:
      return status || "Uusi";
  }
}

function getStatusClasses(status: string | null) {
  switch (status?.toLowerCase()) {
    case "accepted":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";

    case "rejected":
    case "closed":
      return "border-red-500/20 bg-red-500/10 text-red-300";

    case "sent":
    case "offered":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";

    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }
}

export default function PartnerQuotesPage() {

    const [expandedCard, setExpandedCard] = useState<string | number | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
const [offerMessage, setOfferMessage] = useState("");
const [offerExpiresAt, setOfferExpiresAt] = useState("");
const [sendingOffer, setSendingOffer] = useState(false);
const [currentPartnerId, setCurrentPartnerId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  const [directRequests, setDirectRequests] = useState<DirectRequest[]>([]);
  const [categoryRequests, setCategoryRequests] = useState<CategoryRequest[]>(
    [],
  );
  const [errorMessage, setErrorMessage] = useState("");

  const loadQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setDirectRequests([]);
        setCategoryRequests([]);
        setErrorMessage(
          "Kirjaudu partneritilille nähdäksesi tarjouspyynnöt.",
        );
        return;
      }

      const { data: partner, error: partnerError } = await supabase
        .from("partners")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (partnerError) {
        throw partnerError;
      }

      if (!partner) {
        setDirectRequests([]);
        setCategoryRequests([]);
        setErrorMessage(
          "Kirjautuneelle käyttäjälle ei löytynyt partneriprofiilia.",
        );
        return;
      }
      setCurrentPartnerId(partner.id);

      const [directResult, quotePartnersResult] = await Promise.all([
        supabase
          .from("direct_requests")
          .select(`
            id,
            created_at,
            email,
            event_date,
            guests,
            partner_ids,
            notes,
            status,
            customer_name,
            phone,
            location,
            budget,
            services,
            event_type,
            viewed
          `)
          .contains("partner_ids", [partner.id])
          .order("created_at", { ascending: false }),

        supabase
          .from("quote_partners")
          .select(`
            id,
            status,
            created_at,
            partner_id,
            service,
            quote_id,
            offer_price,
            offer_message
          `)
          .eq("partner_id", partner.id)
          .order("created_at", { ascending: false }),
      ]);

      if (directResult.error) {
        throw directResult.error;
      }

      if (quotePartnersResult.error) {
        throw quotePartnersResult.error;
      }

      const directRows = (directResult.data ?? []) as DirectRequest[];
      const quotePartnerRows = (quotePartnersResult.data ??
        []) as QuotePartnerRow[];

      setDirectRequests(directRows);

      if (quotePartnerRows.length === 0) {
        setCategoryRequests([]);
        return;
      }

      const quoteIds = Array.from(
        new Set(quotePartnerRows.map((row) => row.quote_id)),
      );

      const { data: requestQuoteData, error: requestQuoteError } =
        await supabase
          .from("request_quotes")
          .select(`
            id,
            status,
            created_at,
            name,
            phone,
            email,
            location,
            date,
            guests,
            budget,
            services,
            extraInfo,
            event_type,
            notes
          `)
          .in("id", quoteIds);

      if (requestQuoteError) {
        throw requestQuoteError;
      }

      const requestQuoteRows = (requestQuoteData ?? []) as RequestQuoteRow[];

      const requestsById = new Map(
        requestQuoteRows.map((request) => [request.id, request]),
      );

      const combinedCategoryRequests = quotePartnerRows
        .map((quotePartner) => {
          const request = requestsById.get(quotePartner.quote_id);

          if (!request) {
            return null;
          }

          return {
            id: request.id,
            quotePartnerId: quotePartner.id,
            quotePartnerStatus: quotePartner.status,
            service: quotePartner.service,
            offerPrice: quotePartner.offer_price,
            offerMessage: quotePartner.offer_message,
            created_at: quotePartner.created_at,
            name: request.name,
            phone: request.phone,
            email: request.email,
            location: request.location,
            date: request.date,
            guests: request.guests,
            budget: request.budget,
            services: request.services,
            extraInfo: request.extraInfo,
            event_type: request.event_type,
            notes: request.notes,
            requestStatus: request.status,
          } satisfies CategoryRequest;
        })
        .filter(
          (request): request is CategoryRequest => request !== null,
        );

      setCategoryRequests(combinedCategoryRequests);
    } catch (error) {
      console.error("Tarjouspyyntöjen lataaminen epäonnistui:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Tuntematon virhe tarjouspyyntöjen lataamisessa.";

      setDirectRequests([]);
      setCategoryRequests([]);
      setErrorMessage(`Tarjouspyyntöjen lataaminen epäonnistui: ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadQuotes();
  }, [loadQuotes]);

  const hasAnyRequests =
    directRequests.length > 0 || categoryRequests.length > 0;

    async function sendCategoryOffer(quotePartnerId: number) {
  try {
    if (!offerPrice.trim()) {
      alert("Anna tarjouksen hinta.");
      return;
    }

    if (!offerExpiresAt) {
      alert("Valitse tarjouksen voimassaoloaika.");
      return;
    }

    setSendingOffer(true);

    const { error } = await supabase
  .from("quote_partners")
  .update({
    offer_price: Number(offerPrice),
    offer_message: offerMessage.trim(),
    expires_at: offerExpiresAt,
    status: "sent",
  })
  .eq("id", quotePartnerId);

    if (error) throw error;

    setExpandedCard(null);
    setOfferPrice("");
    setOfferMessage("");
    setOfferExpiresAt("");

    await loadQuotes();

    alert("Tarjous lähetettiin onnistuneesti.");
  } catch (err) {
    console.error(err);
    alert("Tarjouksen lähettäminen epäonnistui.");
  } finally {
    setSendingOffer(false);
  }
}

async function sendDirectOffer(directRequestId: string) {
  try {
    if (!currentPartnerId) {
      alert("Partneria ei löytynyt.");
      return;
    }

    if (!offerPrice.trim()) {
      alert("Anna tarjouksen hinta.");
      return;
    }

    if (!offerExpiresAt) {
      alert("Valitse tarjouksen voimassaoloaika.");
      return;
    }

    setSendingOffer(true);

     const { data: existingOffer, error: existingError } = await supabase
  .from("direct_request_offers")
  .select("id")
  .eq("direct_request_id", directRequestId)
  .eq("partner_id", currentPartnerId)
  .maybeSingle();

if (existingError) throw existingError;

if (existingOffer) {
  const { error } = await supabase
    .from("direct_request_offers")
    .update({
      price: Number(offerPrice),
      message: offerMessage.trim(),
      expires_at: offerExpiresAt,
      status: "sent",
    })
    .eq("id", existingOffer.id);

  if (error) throw error;
} else {
  const { error } = await supabase
    .from("direct_request_offers")
    .insert({
      direct_request_id: directRequestId,
      partner_id: currentPartnerId,
      price: Number(offerPrice),
      message: offerMessage.trim(),
      expires_at: offerExpiresAt,
      status: "sent",
    });

  if (error) throw error;
}

    const { error: updateError } = await supabase
      .from("direct_requests")
      .update({
        status: "sent",
      })
      .eq("id", directRequestId);

    if (updateError) throw updateError;

    setExpandedCard(null);
    setOfferPrice("");
    setOfferMessage("");
    setOfferExpiresAt("");

    await loadQuotes();

    alert("Tarjous lähetettiin onnistuneesti.");
  } catch (err) {
    console.error(err);
    alert("Tarjouksen lähettäminen epäonnistui.");
  } finally {
    setSendingOffer(false);
  }
}
  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <SectionHeader
        title="Tarjouspyynnöt"
        description="Katso asiakkaiden tarjouspyynnöt ja hallitse lähettämiäsi tarjouksia."
      />

      {errorMessage && (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200"
        >
          {errorMessage}
        </div>
      )}

      {loading && (
        <PartnerCard>
          <p className="text-sm text-zinc-400">
            Ladataan tarjouspyyntöjä...
          </p>
        </PartnerCard>
      )}

      {!loading && !errorMessage && !hasAnyRequests && (
        <EmptyState
          icon="📨"
          title="Ei vielä tarjouspyyntöjä"
          description="Kun asiakkaat lähettävät yrityksellesi sopivia tarjouspyyntöjä, ne näkyvät täällä."
        />
      )}

      {!loading && directRequests.length > 0 && (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold">
              Suorat tarjouspyynnöt
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Asiakkaat ovat valinneet yrityksesi itse Browse-sivulta.
            </p>
          </div>

          {directRequests.map((request) => (
            <PartnerCard key={request.id}>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-300">
                      Suora pyyntö
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        request.status,
                      )}`}
                    >
                      {getStatusLabel(request.status)}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold">
                    {request.event_type || "Tapahtuma"}
                  </h3>

                  <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-zinc-500">Päivämäärä</p>
                      <p className="mt-1 text-zinc-200">
                        {formatDate(request.event_date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Vierasmäärä</p>
                      <p className="mt-1 text-zinc-200">
                        {request.guests
                          ? `${request.guests} henkilöä`
                          : "Ei ilmoitettu"}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Sijainti</p>
                      <p className="mt-1 text-zinc-200">
                        {request.location || "Ei ilmoitettu"}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Budjetti</p>
                      <p className="mt-1 text-zinc-200">
                        {request.budget || "Ei ilmoitettu"}
                      </p>
                    </div>
                  </div>

                  {request.services && (
                    <div className="mt-5">
                      <p className="text-sm text-zinc-500">
                        Pyydetyt palvelut
                      </p>
                      <p className="mt-1 text-sm text-zinc-300">
                        {request.services}
                      </p>
                    </div>
                  )}

                  {request.notes && (
                    <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <p className="text-sm text-zinc-500">
                        Lisätiedot
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-300">
                        {request.notes}
                      </p>
                    </div>
                  )}
                </div>

              <button
  type="button"
  onClick={() =>
    setExpandedCard(
      expandedCard === request.id ? null : request.id
    )
  }
  className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
>
  {expandedCard === request.id
    ? "Sulje"
    : "Lähetä tarjous"}
</button>
</div>

{expandedCard === request.id && (
  <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
    <h4 className="mb-4 text-lg font-semibold">
      Lähetä tarjous
    </h4>

    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Hinta (€)
        </label>

        <input
  type="number"
  value={offerPrice}
  onChange={(e) => setOfferPrice(e.target.value)}
  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
/>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Viesti asiakkaalle
        </label>

        <textarea
  rows={5}
  value={offerMessage}
  onChange={(e) => setOfferMessage(e.target.value)}
  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
/>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Tarjous voimassa asti
        </label>

       <input
  type="date"
  value={offerExpiresAt}
  onChange={(e) => setOfferExpiresAt(e.target.value)}
  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
/>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setExpandedCard(null)}
          className="rounded-xl border border-zinc-700 px-4 py-2"
        >
          Peruuta
        </button>

        <button
  type="button"
  onClick={() => void sendDirectOffer(request.id)}
  disabled={sendingOffer}
  className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
>
  {sendingOffer ? "Lähetetään..." : "Lähetä tarjous"}
</button>
      </div>
    </div>
  </div>
)}
            </PartnerCard>
          ))}
        </section>
      )}

      {!loading && categoryRequests.length > 0 && (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold">
              Kategoriapohjaiset tarjouspyynnöt
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Järjestelmä on kohdistanut nämä pyynnöt yrityksellesi.
            </p>
          </div>

          {categoryRequests.map((request) => (
            <PartnerCard key={request.quotePartnerId}>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
                      Kategoriapyyntö
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        request.quotePartnerStatus,
                      )}`}
                    >
                      {getStatusLabel(request.quotePartnerStatus)}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold">
                    {request.event_type || "Tapahtuma"}
                  </h3>

                  <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-zinc-500">Päivämäärä</p>
                      <p className="mt-1 text-zinc-200">
                        {formatDate(request.date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Vierasmäärä</p>
                      <p className="mt-1 text-zinc-200">
                        {request.guests
                          ? `${request.guests} henkilöä`
                          : "Ei ilmoitettu"}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Sijainti</p>
                      <p className="mt-1 text-zinc-200">
                        {request.location || "Ei ilmoitettu"}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">Budjetti</p>
                      <p className="mt-1 text-zinc-200">
                        {request.budget || "Ei ilmoitettu"}
                      </p>
                    </div>
                  </div>

                  {(request.service || request.services) && (
                    <div className="mt-5">
                      <p className="text-sm text-zinc-500">
                        Pyydetyt palvelut
                      </p>
                      <p className="mt-1 text-sm text-zinc-300">
                        {request.service || request.services}
                      </p>
                    </div>
                  )}

                  {(request.notes || request.extraInfo) && (
                    <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <p className="text-sm text-zinc-500">
                        Lisätiedot
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-300">
                        {request.notes || request.extraInfo}
                      </p>
                    </div>
                  )}
                </div>

                <button
  type="button"
  onClick={() =>
    setExpandedCard(
      expandedCard === request.quotePartnerId
        ? null
        : request.quotePartnerId
    )
  }
  className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
>
  {expandedCard === request.quotePartnerId
    ? "Sulje"
    : "Lähetä tarjous"}
</button>
</div>

{expandedCard === request.quotePartnerId && (
  <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
    <h4 className="mb-4 text-lg font-semibold">
      Lähetä tarjous
    </h4>

    <div className="space-y-4">

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Hinta (€)
        </label>

        <input
  type="number"
  value={offerPrice}
  onChange={(e) => setOfferPrice(e.target.value)}
  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
/>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Viesti asiakkaalle
        </label>

        <textarea
  rows={5}
  value={offerMessage}
  onChange={(e) => setOfferMessage(e.target.value)}
  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
/>
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-400">
          Tarjous voimassa asti
        </label>

        <input
  type="date"
  value={offerExpiresAt}
  onChange={(e) => setOfferExpiresAt(e.target.value)}
  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-500"
/>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setExpandedCard(null)}
          className="rounded-xl border border-zinc-700 px-4 py-2"
        >
          Peruuta
        </button>

        <button
  type="button"
  onClick={() => void sendCategoryOffer(request.quotePartnerId)}
  disabled={sendingOffer}
  className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
>
  {sendingOffer ? "Lähetetään..." : "Lähetä tarjous"}
</button>
      </div>

    </div>
  </div>
)}
              
            </PartnerCard>
          ))}
        </section>
      )}
    </div>
  );
}