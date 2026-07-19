"use client";

import { SERVICE_OPTIONS, ServiceCategoryId } from "../serviceOptions";

type Props = {
  selectedCategories: ServiceCategoryId[];
  selectedOptions: Record<string, string[]>;
  onToggleCategory: (category: ServiceCategoryId) => void;
  onToggleOption: (
    category: ServiceCategoryId,
    optionId: string
  ) => void;
};

export default function ServicesStep({
  selectedCategories,
  selectedOptions,
  onToggleCategory,
  onToggleOption,
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gap: 28,
      }}
    >
      <div>
        <h2
          style={{
            marginBottom: 6,
          }}
        >
          Palvelut
        </h2>

        <p
          style={{
            marginTop: 0,
            color: "#666",
          }}
        >
          Valitse kaikki palvelut, joita yrityksesi tarjoaa.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
        }}
      >
        {SERVICE_OPTIONS.map((category) => {
          const selected = selectedCategories.includes(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onToggleCategory(category.id)}
              style={{
                borderRadius: 14,
                padding: 18,
                cursor: "pointer",
                textAlign: "left",
                border: selected
                  ? "2px solid #b8903e"
                  : "1px solid #dddddd",
                background: selected
                  ? "#fff8ea"
                  : "#ffffff",
                transition: ".2s",
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  marginBottom: 10,
                }}
              >
                {category.icon}
              </div>

              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 6,
                  fontSize: 17,
                }}
              >
                {category.label}
              </div>

              <div
                style={{
                  color: "#666",
                  fontSize: 14,
                  lineHeight: 1.45,
                }}
              >
                {category.description}
              </div>
            </button>
          );
        })}
      </div>

      {selectedCategories.map((categoryId) => {
        const category = SERVICE_OPTIONS.find(
          (service) => service.id === categoryId
        );

        if (!category) return null;

        const activeOptions =
          selectedOptions[categoryId] ?? [];

        return (
          <div
            key={category.id}
            style={{
              border: "1px solid #e3e3e3",
              borderRadius: 14,
              padding: 22,
              background: "#fafafa",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: 6,
              }}
            >
              {category.icon} {category.label}
            </h3>

            <p
              style={{
                marginTop: 0,
                color: "#666",
                marginBottom: 20,
              }}
            >
              Valitse palveluusi liittyvät ominaisuudet.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(260px,1fr))",
                gap: 14,
              }}
            >
                              {category.options.map((option) => {
                const checked = activeOptions.includes(option.id);

                return (
                  <label
                    key={option.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: checked
                        ? "1px solid #b8903e"
                        : "1px solid #dddddd",
                      background: checked
                        ? "#fff8ea"
                        : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onToggleOption(
                          category.id,
                          option.id
                        )
                      }
                    />

                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}