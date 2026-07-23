import "server-only";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Supabase-palvelimen ympäristömuuttujat puuttuvat.",
  );
}

const supabase = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

type ReleaseSelectionsOptions = {
  partnerIds: string[];
  eventDate: string;
  excludeQuoteId?: number;
};

type ReleaseSelectionsResult = {
  releasedSelections: number;
  affectedQuoteIds: number[];
};

export async function releaseCompetingQuoteSelections({
  partnerIds,
  eventDate,
  excludeQuoteId,
}: ReleaseSelectionsOptions): Promise<ReleaseSelectionsResult> {
  const uniquePartnerIds =
    Array.from(
      new Set(
        partnerIds
          .map((partnerId) =>
            String(
              partnerId,
            ).trim(),
          )
          .filter(Boolean),
      ),
    );

  if (
    uniquePartnerIds.length === 0 ||
    !eventDate
  ) {
    return {
      releasedSelections: 0,
      affectedQuoteIds: [],
    };
  }

  let selectionsQuery =
    supabase
      .from("quote_partners")
      .select(`
        id,
        quote_id,
        partner_id
      `)
      .in(
        "partner_id",
        uniquePartnerIds,
      )
      .in("status", [
        "selected",
        "valittu",
      ]);

  if (
    excludeQuoteId !==
    undefined
  ) {
    selectionsQuery =
      selectionsQuery.neq(
        "quote_id",
        excludeQuoteId,
      );
  }

  const {
    data: selectedRows,
    error: selectedRowsError,
  } = await selectionsQuery;

  if (selectedRowsError) {
    throw selectedRowsError;
  }

  if (
    !selectedRows ||
    selectedRows.length === 0
  ) {
    return {
      releasedSelections: 0,
      affectedQuoteIds: [],
    };
  }

  const possibleQuoteIds =
    Array.from(
      new Set(
        selectedRows.map(
          (row) =>
            Number(row.quote_id),
        ),
      ),
    ).filter(
      (quoteId) =>
        Number.isInteger(
          quoteId,
        ) &&
        quoteId > 0,
    );

  if (
    possibleQuoteIds.length === 0
  ) {
    return {
      releasedSelections: 0,
      affectedQuoteIds: [],
    };
  }

  const {
    data: competingQuotes,
    error: competingQuotesError,
  } = await supabase
    .from("request_quotes")
    .select(`
      id,
      status,
      date
    `)
    .in("id", possibleQuoteIds)
    .eq("date", eventDate);

  if (competingQuotesError) {
    throw competingQuotesError;
  }

  const affectedQuoteIds =
    (competingQuotes ?? [])
      .filter((quote) => {
        const status =
          String(
            quote.status ?? "",
          )
            .trim()
            .toLowerCase();

        return (
          status !== "confirmed" &&
          status !== "suljettu"
        );
      })
      .map((quote) =>
        Number(quote.id),
      )
      .filter(
        (quoteId) =>
          Number.isInteger(
            quoteId,
          ) &&
          quoteId > 0,
      );

  if (
    affectedQuoteIds.length === 0
  ) {
    return {
      releasedSelections: 0,
      affectedQuoteIds: [],
    };
  }

  const selectionIdsToRelease =
    selectedRows
      .filter((row) =>
        affectedQuoteIds.includes(
          Number(row.quote_id),
        ),
      )
      .map((row) =>
        Number(row.id),
      )
      .filter(
        (selectionId) =>
          Number.isInteger(
            selectionId,
          ) &&
          selectionId > 0,
      );

  if (
    selectionIdsToRelease.length ===
    0
  ) {
    return {
      releasedSelections: 0,
      affectedQuoteIds: [],
    };
  }

  const {
    data: releasedRows,
    error: releaseError,
  } = await supabase
    .from("quote_partners")
    .update({
      status: "offered",
    })
    .in(
      "id",
      selectionIdsToRelease,
    )
    .in("status", [
      "selected",
      "valittu",
    ])
    .select("id");

  if (releaseError) {
    throw releaseError;
  }

  return {
    releasedSelections:
      releasedRows?.length ?? 0,
    affectedQuoteIds,
  };
}