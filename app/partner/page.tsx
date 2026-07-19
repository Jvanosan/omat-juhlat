"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageContainer from "../components/PageContainer"
import DashboardStats from "../components/partner/DashboardStats";
import DashboardHeader from "../components/partner/DashboardHeader";
import QuoteCard from "../components/partner/QuoteCard";
import EmptyState from "../components/partner/EmptyState";
import InfoBanner from "../components/partner/InfoBanner";

export default function PartnerPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
const [activeFilter, setActiveFilter] = useState<
  "all" | "waiting" | "offered" | "selected"
>("all");


  useEffect(() => {
  loadData();

  const interval = setInterval(() => {
    loadData();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
  router.push("/partner/login");
  return;
}

    const { data: partner } = await supabase
      .from("partners")
      .select("*")
      .eq("email", user.email)
      .single();

if (!partner) {
  router.push("/partner/login");
  return;
}
    const { data: qp } = await supabase
      .from("quote_partners")
      .select("*")
      .eq("partner_id", partner.id);

    if (!qp || qp.length === 0) {
      setItems([]);
      return;
    }

    const validQuotePartners = qp.filter(
  (q) => q.quote_id !== null && q.quote_id !== undefined
);

const quoteIds = Array.from(
  new Set(validQuotePartners.map((q) => q.quote_id))
);

    const { data: quotes, error: quotesError } = await supabase
  .from("request_quotes")
  .select("*")
  .in("id", quoteIds);

console.log("PARTNER QUOTE IDS:", quoteIds);
console.log("PARTNER QUOTES:", quotes);
console.log("PARTNER QUOTES ERROR:", quotesError);

const combined = validQuotePartners.map((q) => {
  const quote = quotes?.find(
  (r) => String(r.id) === String(q.quote_id)
);    

return {
        ...q,
        quote,
      };
    });

    setItems(combined);
  }
  
  async function submitOffer(item: any) {
  const price = prices[item.id];
  const message = messages[item.id];

  if (!price) {
    alert("Anna hinta ennen lähettämistä");
    return;
  }

  const { error } = await supabase
    .from("quote_partners")
    .update({
      offer_price: Number(price),
      offer_message: message || "",
      status: "offered",
    })
    .eq("id", item.id);

  if (error) {
    console.error("UPDATE ERROR:", error);
    alert("Virhe tallennuksessa: " + error.message);
    return;
  }

  alert("✅ Tarjous lähetetty");
  loadData();
}

  async function cancelOffer(item: any) {
    if (!confirm("Haluatko varmasti perua tämän tarjouksen?")) return;

    await supabase
      .from("quote_partners")
.update({ status: "cancelled" })
      .eq("id", item.id);

    alert("Tarjous peruttu");
    loadData();
  }
async function handleLogout() {
  await supabase.auth.signOut();
  router.push("/partner/login");
}
const waitingCount = items.filter(
  (item) => item.status === "sent" && !item.offer_price
).length;

const offeredCount = items.filter(
  (item) => item.status === "offered" && item.offer_price
).length;

const selectedCount = items.filter(
  (item) => item.status === "selected" || item.status === "valittu"
).length;

const filteredItems = items.filter((item) => {
  if (activeFilter === "waiting") {
    return item.status === "sent" && !item.offer_price;
  }

  if (activeFilter === "offered") {
    return item.status === "offered" && Boolean(item.offer_price);
  }

  if (activeFilter === "selected") {
    return item.status === "selected" || item.status === "valittu";
  }

  return true;
});
  return (
    <PageContainer>
    <main
  style={{
    minHeight: "100vh",
    padding: 16,
    background: "linear-gradient(180deg, #f3f4f6, #e5e7eb)",
  }}
>

<DashboardHeader onLogout={handleLogout} />
<InfoBanner />
<DashboardStats
  total={items.length}
  waiting={waitingCount}
  offered={offeredCount}
  selected={selectedCount}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
/>

{filteredItems.length === 0 && (
  <EmptyState activeFilter={activeFilter} />
)}

{filteredItems.map((item) => (
  <QuoteCard
    key={item.id}
    item={item}
    price={prices[item.id] || ""}
    message={messages[item.id] || ""}
    onPriceChange={(value) =>
      setPrices({
        ...prices,
        [item.id]: value,
      })
    }
    onMessageChange={(value) =>
      setMessages({
        ...messages,
        [item.id]: value,
      })
    }
    onSubmitOffer={() => submitOffer(item)}
    onCancelOffer={() => cancelOffer(item)}
  />
))}
    </main>
  </PageContainer>
);
}