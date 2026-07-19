"use client";

import {
  PRICING_TEMPLATES,
  PRICING_UNIT_LABELS,
  PricingUnit,
} from "../pricingTemplates";
import type { ServiceCategoryId } from "../serviceOptions";

export type PricingItem = {
  id: string;
  categoryId: ServiceCategoryId;
  templateId: string;
  label: string;
  description: string;
  price: string;
  unit: PricingUnit;
};

type PricingStepProps = {
  selectedCategories: ServiceCategoryId[];
  pricingItems: PricingItem[];
  onChange: (items: PricingItem[]) => void;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d7d7d7",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "#ffffff",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontWeight: 600,
  color: "#2c241c",
};

export default function PricingStep({
  selectedCategories,
  pricingItems,
  onChange,
}: PricingStepProps) {
  const createPricingItem = (
    categoryId: ServiceCategoryId,
    templateId: string,
    label: string,
    defaultUnit: PricingUnit,
    description = ""
  ): PricingItem => {
    return {
      id: crypto.randomUUID(),
      categoryId,
      templateId,
      label,
      description,
      price: "",
      unit: defaultUnit,
    };
  };

  const addTemplateItem = (
    categoryId: ServiceCategoryId,
    templateId: string
  ) => {
    const template = PRICING_TEMPLATES.find(
      (item) => item.categoryId === categoryId
    );

    const templateItem = template?.items.find(
      (item) => item.id === templateId
    );

    if (!templateItem) return;

    const alreadyExists = pricingItems.some(
      (item) =>
        item.categoryId === categoryId &&
        item.templateId === templateId
    );

    if (alreadyExists) return;

    onChange([
      ...pricingItems,
      createPricingItem(
        categoryId,
        templateItem.id,
        templateItem.label,
        templateItem.defaultUnit,
        templateItem.description ?? ""
      ),
    ]);
  };

  const addCustomItem = (categoryId: ServiceCategoryId) => {
    onChange([
      ...pricingItems,
      createPricingItem(
        categoryId,
        `custom-${Date.now()}`,
        "",
        "fixed"
      ),
    ]);
  };

  const updatePricingItem = (
    itemId: string,
    field: keyof PricingItem,
    value: string
  ) => {
    onChange(
      pricingItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removePricingItem = (itemId: string) => {
    onChange(pricingItems.filter((item) => item.id !== itemId));
  };

  if (selectedCategories.length === 0) {
    return (
      <div
        style={{
          padding: 22,
          borderRadius: 14,
          border: "1px dashed #d4c8b8",
          backgroundColor: "#faf8f4",
          color: "#6d655c",
          textAlign: "center",
        }}
      >
        Valitse ensin vähintään yksi palvelukategoria.
      </div>
    );
  }

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
          Hinnoittelu
        </h2>

        <p
          style={{
            marginTop: 0,
            color: "#666",
          }}
        >
          Lisää valmiita hintapaketteja tai luo omia hintoja.
        </p>
      </div>

      {selectedCategories.map((categoryId) => {
        const template = PRICING_TEMPLATES.find(
          (item) => item.categoryId === categoryId
        );

        if (!template) return null;

        const categoryItems = pricingItems.filter(
          (item) => item.categoryId === categoryId
        );

        return (
          <section
            key={categoryId}
            style={{
              display: "grid",
              gap: 18,
              padding: 22,
              borderRadius: 14,
              border: "1px solid #e3ddd5",
              backgroundColor: "#faf8f4",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 6px",
                }}
              >
                {template.categoryLabel}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#6e675f",
                  fontSize: 14,
                }}
              >
                Valitse sopivat hintapohjat tai lisää oma hinnoittelurivi.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {template.items.map((templateItem) => {
                const alreadyAdded = categoryItems.some(
                  (item) => item.templateId === templateItem.id
                );

                return (
                  <button
                    key={templateItem.id}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() =>
                      addTemplateItem(categoryId, templateItem.id)
                    }
                    style={{
                      padding: "10px 13px",
                      borderRadius: 9,
                      border: alreadyAdded
                        ? "1px solid #d8d3cb"
                        : "1px solid #b8903e",
                      backgroundColor: alreadyAdded
                        ? "#f0ede8"
                        : "#fff8e8",
                      color: alreadyAdded ? "#8b857d" : "#7d5d1b",
                      fontWeight: 700,
                      cursor: alreadyAdded ? "not-allowed" : "pointer",
                    }}
                  >
                    {alreadyAdded ? "✓ " : "+ "}
                    {templateItem.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => addCustomItem(categoryId)}
                style={{
                  padding: "10px 13px",
                  borderRadius: 9,
                  border: "1px solid #9f988f",
                  backgroundColor: "#ffffff",
                  color: "#443d35",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Oma hintarivi
              </button>
            </div>

            {categoryItems.length === 0 && (
              <div
                style={{
                  padding: 18,
                  borderRadius: 12,
                  border: "1px dashed #d6cec3",
                  backgroundColor: "#ffffff",
                  color: "#746d64",
                  textAlign: "center",
                }}
              >
                Tälle palvelulle ei ole vielä lisätty hintoja.
              </div>
            )}

            <div
              style={{
                display: "grid",
                gap: 16,
              }}
            >
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gap: 14,
                    padding: 18,
                    borderRadius: 12,
                    border: "1px solid #e0dad2",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(190px, 1fr))",
                      gap: 14,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Paketin nimi</label>

                      <input
                        style={inputStyle}
                        value={item.label}
                        placeholder="Esim. Lauantaipaketti"
                        onChange={(event) =>
                          updatePricingItem(
                            item.id,
                            "label",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Hinta (€)</label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        style={inputStyle}
                        value={item.price}
                        placeholder="0"
                        onChange={(event) =>
                          updatePricingItem(
                            item.id,
                            "price",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Hintayksikkö</label>

                      <select
                        style={inputStyle}
                        value={item.unit}
                        onChange={(event) =>
                          updatePricingItem(
                            item.id,
                            "unit",
                            event.target.value
                          )
                        }
                      >
                        {Object.entries(PRICING_UNIT_LABELS).map(
                          ([unit, label]) => (
                            <option key={unit} value={unit}>
                              {label}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Lisätiedot</label>

                    <textarea
                      rows={3}
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                      }}
                      value={item.description}
                      placeholder="Kerro mitä hintaan sisältyy."
                      onChange={(event) =>
                        updatePricingItem(
                          item.id,
                          "description",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removePricingItem(item.id)}
                    style={{
                      justifySelf: "start",
                      padding: "9px 14px",
                      borderRadius: 9,
                      border: "1px solid #d8c4c4",
                      backgroundColor: "#fffafa",
                      color: "#8c3535",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Poista hintarivi
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}