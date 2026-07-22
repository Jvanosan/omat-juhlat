"use client";

import {
  useMemo,
  useState,
} from "react";
import Link from "next/link";

import EmptyState from "@/components/partner/EmptyState";
import SectionHeader from "@/components/partner/SectionHeader";

import CategoryRequestCard from "@/components/partner/quotes/CategoryRequestCard";
import DirectRequestCard from "@/components/partner/quotes/DirectRequestCard";
import RequestFilterTabs from "@/components/partner/quotes/RequestFilterTabs";

import {
  filterCategoryRequests,
  filterDirectRequests,
  getRequestFilterCounts,
  type RequestFilter,
} from "@/components/partner/quotes/requestFilters";

import { usePartnerQuotes } from "./usePartnerQuotes";

export default function PartnerQuotesPage() {
  const {
    loading,
    errorMessage,
    directRequests,
    categoryRequests,
    expandedCard,
    draft,
    savingOffer,
    minimumOfferExpiry,
    hasAnyRequests,

    toggleDirectEditor,
    toggleCategoryEditor,
    closeEditor,
    saveDirectOffer,
    saveCategoryOffer,

    setDraftPrice,
    setDraftMessage,
    setDraftExpiry,
  } = usePartnerQuotes();

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<RequestFilter>(
    "action",
  );

  const filterCounts = useMemo(
    () =>
      getRequestFilterCounts(
        directRequests,
        categoryRequests,
      ),
    [
      directRequests,
      categoryRequests,
    ],
  );

  const visibleDirectRequests =
    useMemo(
      () =>
        filterDirectRequests(
          directRequests,
          activeFilter,
        ),
      [
        directRequests,
        activeFilter,
      ],
    );

  const visibleCategoryRequests =
    useMemo(
      () =>
        filterCategoryRequests(
          categoryRequests,
          activeFilter,
        ),
      [
        categoryRequests,
        activeFilter,
      ],
    );

  const visibleRequestCount =
    visibleDirectRequests.length +
    visibleCategoryRequests.length;

  const totalRequests =
    directRequests.length +
    categoryRequests.length;

  function changeFilter(
    filter: RequestFilter,
  ) {
    closeEditor();
    setActiveFilter(filter);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Tarjoukset"
          title="Tarjouspyynnöt"
          description="Katso asiakkaiden pyynnöt ja lähetä tai muokkaa tarjouksiasi."
        />

        <Link
          href="/partner/dashboard"
          className="mb-5 inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-[#d8c7ad] bg-white px-4 py-2 text-sm font-bold text-[#795a28] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b48a45]"
        >
          ← Takaisin dashboardiin
        </Link>
      </div>

      {!loading &&
        !errorMessage &&
        hasAnyRequests && (
          <section
            aria-label="Tarjouspyyntöjen yhteenveto"
            className="grid gap-4 sm:grid-cols-3"
          >
            <SummaryCard
              value={totalRequests}
              label="Kaikki pyynnöt"
              icon="📋"
              tone="gold"
            />

            <SummaryCard
              value={
                directRequests.length
              }
              label="Suorat pyynnöt"
              icon="🎯"
              tone="rose"
            />

            <SummaryCard
              value={
                categoryRequests.length
              }
              label="Kategoriapyynnöt"
              icon="✨"
              tone="blue"
            />
          </section>
        )}

      {errorMessage && (
        <div
          role="alert"
          className="rounded-2xl border border-[#edcaca] bg-[#fff3f3] p-5 text-[#a33d3d]"
        >
          <p className="font-bold">
            Tarjouspyyntöjen lataaminen
            epäonnistui
          </p>

          <p className="mt-1 text-sm leading-6">
            {errorMessage}
          </p>
        </div>
      )}

      {loading && (
        <div
          role="status"
          className="rounded-3xl border border-[#e8ded0] bg-white p-8 text-center shadow-sm"
        >
          <span
            aria-hidden="true"
            className="mx-auto mb-4 block h-9 w-9 animate-spin rounded-full border-4 border-[#eadfce] border-t-[#b48a45]"
          />

          <p className="font-bold text-[#211b16]">
            Ladataan tarjouspyyntöjä...
          </p>

          <p className="mt-1 text-sm text-[#70675e]">
            Haetaan yrityksellesi
            kohdistetut pyynnöt.
          </p>
        </div>
      )}

      {!loading &&
        !errorMessage &&
        !hasAnyRequests && (
          <EmptyState
            icon="📨"
            title="Ei vielä tarjouspyyntöjä"
            description="Kun asiakkaat lähettävät yrityksellesi sopivia tarjouspyyntöjä, ne näkyvät täällä."
          />
        )}

      {!loading &&
        !errorMessage &&
        hasAnyRequests && (
          <RequestFilterTabs
            activeFilter={
              activeFilter
            }
            counts={filterCounts}
            onChange={changeFilter}
          />
        )}

      {!loading &&
        hasAnyRequests &&
        visibleRequestCount === 0 && (
          <div className="rounded-3xl border border-dashed border-[#d8c7ad] bg-white px-6 py-12 text-center shadow-sm">
            <div
              aria-hidden="true"
              className="text-4xl"
            >
              ✅
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#211b16]">
              Tässä ryhmässä ei ole
              tarjouspyyntöjä
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#70675e]">
              Valitse toinen suodatin
              nähdäksesi muut pyynnöt.
            </p>

            {activeFilter !== "all" && (
              <button
                type="button"
                onClick={() =>
                  changeFilter("all")
                }
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#b48a45] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#9f783a]"
              >
                Näytä kaikki
              </button>
            )}
          </div>
        )}

      {!loading &&
        visibleDirectRequests.length >
          0 && (
          <>
            <RequestSectionHeader
              eyebrow="Asiakkaan valinta"
              title="Suorat tarjouspyynnöt"
              description="Asiakkaat ovat valinneet yrityksesi itse palveluntarjoajien selaussivulta."
              count={
                visibleDirectRequests.length
              }
              tone="rose"
            />

            <section className="space-y-5">
              {visibleDirectRequests.map(
                (request) => {
                  const cardId =
                    `direct:${request.id}`;

                  return (
                    <DirectRequestCard
                      key={request.id}
                      request={request}
                      expanded={
                        expandedCard ===
                        cardId
                      }
                      draft={draft}
                      minimumExpiry={
                        minimumOfferExpiry
                      }
                      saving={
                        savingOffer
                      }
                      onToggle={() =>
                        toggleDirectEditor(
                          request,
                        )
                      }
                      onCancel={
                        closeEditor
                      }
                      onPriceChange={
                        setDraftPrice
                      }
                      onMessageChange={
                        setDraftMessage
                      }
                      onExpiryChange={
                        setDraftExpiry
                      }
                      onSubmit={() =>
                        void saveDirectOffer(
                          request,
                        )
                      }
                    />
                  );
                },
              )}
            </section>
          </>
        )}

      {!loading &&
        visibleCategoryRequests.length >
          0 && (
          <>
            <RequestSectionHeader
              eyebrow="Automaattinen kohdistus"
              title="Kategoriapohjaiset tarjouspyynnöt"
              description="Järjestelmä on kohdistanut nämä pyynnöt yrityksellesi palvelun, alueen ja kapasiteetin perusteella."
              count={
                visibleCategoryRequests.length
              }
              tone="blue"
            />

            <section className="space-y-5">
              {visibleCategoryRequests.map(
                (request) => {
                  const cardId =
                    `category:${request.quotePartnerId}`;

                  return (
                    <CategoryRequestCard
                      key={
                        request.quotePartnerId
                      }
                      request={request}
                      expanded={
                        expandedCard ===
                        cardId
                      }
                      draft={draft}
                      minimumExpiry={
                        minimumOfferExpiry
                      }
                      saving={
                        savingOffer
                      }
                      onToggle={() =>
                        toggleCategoryEditor(
                          request,
                        )
                      }
                      onCancel={
                        closeEditor
                      }
                      onPriceChange={
                        setDraftPrice
                      }
                      onMessageChange={
                        setDraftMessage
                      }
                      onExpiryChange={
                        setDraftExpiry
                      }
                      onSubmit={() =>
                        void saveCategoryOffer(
                          request,
                        )
                      }
                    />
                  );
                },
              )}
            </section>
          </>
        )}

      {!loading &&
        hasAnyRequests && (
          <div className="rounded-2xl border border-[#e8ded0] bg-white p-5 text-sm leading-6 text-[#70675e] shadow-sm">
            <strong className="text-[#3f362f]">
              Muista:
            </strong>{" "}
            Tarjouksessa täytyy olla hinta
            ja voimassaoloaika. Voit muokata
            tarjousta niin kauan kuin
            asiakas ei ole tehnyt lopullista
            valintaa.
          </div>
        )}
    </div>
  );
}

function SummaryCard({
  value,
  label,
  icon,
  tone,
}: {
  value: number;
  label: string;
  icon: string;
  tone:
    | "gold"
    | "rose"
    | "blue";
}) {
  const styles = {
    gold: "border-[#ead29d] bg-[#fff8e8] text-[#795a28]",
    rose: "border-[#efcdd3] bg-[#fff3f5] text-[#9d5261]",
    blue: "border-[#cdddf1] bg-[#f1f6fd] text-[#3564a8]",
  }[tone];

  return (
    <div
      className={`rounded-2xl border p-5 ${styles}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-3xl font-black">
            {value}
          </p>

          <p className="mt-1 text-sm font-bold">
            {label}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="text-2xl"
        >
          {icon}
        </span>
      </div>
    </div>
  );
}

function RequestSectionHeader({
  eyebrow,
  title,
  description,
  count,
  tone,
}: {
  eyebrow: string;
  title: string;
  description: string;
  count: number;
  tone: "rose" | "blue";
}) {
  const badge =
    tone === "rose"
      ? "border-[#efcdd3] bg-[#fff3f5] text-[#9d5261]"
      : "border-[#cdddf1] bg-[#f1f6fd] text-[#3564a8]";

  return (
    <div className="flex flex-col gap-4 border-b border-[#ded3c4] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a773b]">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#211b16] sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#70675e]">
          {description}
        </p>
      </div>

      <span
        className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-sm font-bold ${badge}`}
      >
        {count}{" "}
        {count === 1
          ? "pyyntö"
          : "pyyntöä"}
      </span>
    </div>
  );
}