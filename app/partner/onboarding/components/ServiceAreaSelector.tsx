"use client";

import { useMemo, useState } from "react";

import {
  parseServiceAreas,
  PARTNER_SERVICE_AREAS,
  serializeServiceAreas,
} from "@/lib/locations";

type ServiceAreaSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export default function ServiceAreaSelector({
  value,
  onChange,
  required = false,
}: ServiceAreaSelectorProps) {
  const [search, setSearch] =
    useState("");

  const selectedAreas =
    parseServiceAreas(value);

  const normalizedSearch =
    search.trim().toLocaleLowerCase(
      "fi-FI",
    );

  const visibleAreas = useMemo(
    () =>
      PARTNER_SERVICE_AREAS.filter(
        (area) =>
          !normalizedSearch ||
          area
            .toLocaleLowerCase("fi-FI")
            .includes(normalizedSearch),
      ),
    [normalizedSearch],
  );

  function toggleArea(area: string) {
    const alreadySelected =
      selectedAreas.includes(area);

    if (alreadySelected) {
      onChange(
        serializeServiceAreas(
          selectedAreas.filter(
            (selected) =>
              selected !== area,
          ),
        ),
      );

      return;
    }

    // Koko Suomi korvaa yksittäiset
    // paikkakunnat.
    if (area === "Koko Suomi") {
      onChange("Koko Suomi");
      return;
    }

    // Yksittäisen paikkakunnan valinta
    // poistaa Koko Suomi -valinnan.
    const withoutWholeCountry =
      selectedAreas.filter(
        (selected) =>
          selected !== "Koko Suomi",
      );

    onChange(
      serializeServiceAreas([
        ...withoutWholeCountry,
        area,
      ]),
    );
  }

  function removeArea(area: string) {
    onChange(
      serializeServiceAreas(
        selectedAreas.filter(
          (selected) =>
            selected !== area,
        ),
      ),
    );
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor="partner-area-search"
          className="text-sm font-bold text-[#3f362f]"
        >
          Toiminta-alueet
          {required && (
            <span className="ml-1 text-[#a33d3d]">
              *
            </span>
          )}
        </label>

        <span className="text-xs text-[#91877d]">
          {selectedAreas.length}{" "}
          {selectedAreas.length === 1
            ? "alue valittu"
            : "aluetta valittu"}
        </span>
      </div>

      {selectedAreas.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedAreas.map(
            (area) => (
              <span
                key={area}
                className="inline-flex items-center gap-2 rounded-full border border-[#d9c69f] bg-[#fff7e8] px-3 py-1.5 text-sm font-bold text-[#795a28]"
              >
                {area}

                <button
                  type="button"
                  onClick={() =>
                    removeArea(area)
                  }
                  aria-label={`Poista ${area}`}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[#98743b] transition hover:bg-[#ead8b8]"
                >
                  ×
                </button>
              </span>
            ),
          )}
        </div>
      )}

      <div className="rounded-2xl border border-[#ded3c4] bg-[#fffdf9] p-3">
        <input
          id="partner-area-search"
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
          placeholder="Hae paikkakuntaa..."
          className="min-h-12 w-full rounded-xl border border-[#ded3c4] bg-white px-4 text-[#211b16] outline-none transition placeholder:text-[#aaa096] focus:border-[#b48a45] focus:ring-4 focus:ring-[#ead8b8]/35"
        />

        <div className="mt-3 max-h-64 overflow-y-auto">
          {visibleAreas.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-[#91877d]">
              Paikkakuntaa ei löytynyt.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {visibleAreas.map(
                (area) => {
                  const checked =
                    selectedAreas.includes(
                      area,
                    );

                  return (
                    <label
                      key={area}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition ${
                        checked
                          ? "border-[#b9dfd0] bg-[#edf8f3] text-[#11634d]"
                          : "border-transparent bg-white text-[#62584f] hover:border-[#d8c7ad]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleArea(area)
                        }
                        className="h-5 w-5 accent-[#168365]"
                      />

                      <span className="text-sm font-semibold">
                        {area}
                      </span>
                    </label>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs leading-5 text-[#70675e]">
        Valitse kaikki paikkakunnat,
        joilla palvelette. Jos voitte
        palvella valtakunnallisesti,
        valitse “Koko Suomi”.
      </p>

      {required &&
        selectedAreas.length === 0 && (
          <p className="mt-2 text-xs font-semibold text-[#a33d3d]">
            Valitse vähintään yksi
            toiminta-alue.
          </p>
        )}
    </div>
  );
}