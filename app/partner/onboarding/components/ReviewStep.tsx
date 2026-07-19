"use client";

import type { PricingItem } from "./PricingStep";
import type { ServiceCategoryId } from "../serviceOptions";
import {
  PRICING_UNIT_LABELS,
  type PricingUnit,
} from "../pricingTemplates";
import { SERVICE_OPTIONS } from "../serviceOptions";

type CompanyDetails = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  description: string;
};

type ReviewStepProps = {
  company: CompanyDetails;
  logoUrl: string;
  coverImageUrl: string;
  galleryUrls: string[];
  selectedCategories: ServiceCategoryId[];
  selectedOptions: Record<string, string[]>;
  pricingItems: PricingItem[];
  isSubmitting: boolean;
  submitError: string;
};

const sectionStyle: React.CSSProperties = {
  display: "grid",
  gap: 14,
  padding: 20,
  borderRadius: 14,
  border: "1px solid #e2ddd5",
  backgroundColor: "#ffffff",
};

const labelStyle: React.CSSProperties = {
  margin: 0,
  color: "#71695f",
  fontSize: 13,
  fontWeight: 600,
};

const valueStyle: React.CSSProperties = {
  margin: "3px 0 0",
  color: "#2c241c",
  fontSize: 15,
  lineHeight: 1.5,
  overflowWrap: "anywhere",
};

function getPricingUnitLabel(unit: PricingUnit) {
  return PRICING_UNIT_LABELS[unit] ?? unit;
}

export default function ReviewStep({
  company,
  logoUrl,
  coverImageUrl,
  galleryUrls,
  selectedCategories,
  selectedOptions,
  pricingItems,
  isSubmitting,
  submitError,
}: ReviewStepProps) {
  const validGalleryImages = galleryUrls.filter(
    (imageUrl) => imageUrl.trim().length > 0
  );

  return (
    <div
      style={{
        display: "grid",
        gap: 24,
      }}
    >
      <div>
        <h2
          style={{
            marginBottom: 6,
          }}
        >
          Tarkista tiedot
        </h2>

        <p
          style={{
            marginTop: 0,
            color: "#666",
          }}
        >
          Tarkista profiilin tiedot ennen kuin lähetät sen adminin
          tarkistettavaksi.
        </p>
      </div>

      <section style={sectionStyle}>
        <h3
          style={{
            margin: 0,
          }}
        >
          Yrityksen perustiedot
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
          }}
        >
          <div>
            <p style={labelStyle}>Yrityksen nimi</p>
            <p style={valueStyle}>
              {company.companyName || "Ei täytetty"}
            </p>
          </div>

          <div>
            <p style={labelStyle}>Yhteyshenkilö</p>
            <p style={valueStyle}>
              {company.contactName || "Ei täytetty"}
            </p>
          </div>

          <div>
            <p style={labelStyle}>Sähköposti</p>
            <p style={valueStyle}>
              {company.email || "Ei täytetty"}
            </p>
          </div>

          <div>
            <p style={labelStyle}>Puhelin</p>
            <p style={valueStyle}>
              {company.phone || "Ei täytetty"}
            </p>
          </div>

          <div>
            <p style={labelStyle}>Kaupunki</p>
            <p style={valueStyle}>
              {company.city || "Ei täytetty"}
            </p>
          </div>

          <div>
            <p style={labelStyle}>Nettisivu</p>
            <p style={valueStyle}>
              {company.website || "Ei täytetty"}
            </p>
          </div>
        </div>

        <div>
          <p style={labelStyle}>Yrityksen kuvaus</p>
          <p
            style={{
              ...valueStyle,
              whiteSpace: "pre-wrap",
            }}
          >
            {company.description || "Ei täytetty"}
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h3
          style={{
            margin: 0,
          }}
        >
          Kuvat
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <div>
            <p style={labelStyle}>Logo</p>

            {logoUrl.trim() ? (
              <img
                src={logoUrl}
                alt="Yrityksen logo"
                style={{
                  width: "100%",
                  height: 150,
                  marginTop: 8,
                  objectFit: "contain",
                  borderRadius: 12,
                  border: "1px solid #e2ddd5",
                  backgroundColor: "#faf8f4",
                  padding: 12,
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <p style={valueStyle}>Ei lisätty</p>
            )}
          </div>

          <div>
            <p style={labelStyle}>Kansikuva</p>

            {coverImageUrl.trim() ? (
              <img
                src={coverImageUrl}
                alt="Yrityksen kansikuva"
                style={{
                  width: "100%",
                  height: 150,
                  marginTop: 8,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid #e2ddd5",
                  backgroundColor: "#faf8f4",
                }}
              />
            ) : (
              <p style={valueStyle}>Ei lisätty</p>
            )}
          </div>
        </div>

        <div>
          <p style={labelStyle}>
            Galleriakuvat ({validGalleryImages.length})
          </p>

          {validGalleryImages.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 10,
                marginTop: 8,
              }}
            >
              {validGalleryImages.map((imageUrl, index) => (
                <img
                  key={`${imageUrl}-${index}`}
                  src={imageUrl}
                  alt={`Galleriakuva ${index + 1}`}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid #e2ddd5",
                    backgroundColor: "#faf8f4",
                  }}
                />
              ))}
            </div>
          ) : (
            <p style={valueStyle}>Ei lisätty</p>
          )}
        </div>
      </section>

      <section style={sectionStyle}>
        <h3
          style={{
            margin: 0,
          }}
        >
          Palvelut
        </h3>

        {selectedCategories.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {selectedCategories.map((categoryId) => {
              const category = SERVICE_OPTIONS.find(
                (item) => item.id === categoryId
              );

              if (!category) return null;

              const categoryOptions =
                selectedOptions[categoryId] ?? [];

              const selectedOptionLabels = category.options
                .filter((option) =>
                  categoryOptions.includes(option.id)
                )
                .map((option) => option.label);

              return (
                <div
                  key={category.id}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid #e5dfd7",
                    backgroundColor: "#faf8f4",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 8px",
                      color: "#2c241c",
                      fontWeight: 700,
                    }}
                  >
                    {category.icon} {category.label}
                  </p>

                  {selectedOptionLabels.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {selectedOptionLabels.map((label) => (
                        <span
                          key={label}
                          style={{
                            padding: "7px 10px",
                            borderRadius: 999,
                            backgroundColor: "#fff8e8",
                            color: "#7d5d1b",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p
                      style={{
                        margin: 0,
                        color: "#746d64",
                        fontSize: 14,
                      }}
                    >
                      Tarkempia ominaisuuksia ei ole valittu.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p style={valueStyle}>
            Palvelukategorioita ei ole valittu.
          </p>
        )}
      </section>

      <section style={sectionStyle}>
        <h3
          style={{
            margin: 0,
          }}
        >
          Hinnoittelu
        </h3>

        {pricingItems.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            {pricingItems.map((item) => {
              const category = SERVICE_OPTIONS.find(
                (service) => service.id === item.categoryId
              );

              return (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0, 1fr) auto",
                    gap: 16,
                    alignItems: "start",
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid #e5dfd7",
                    backgroundColor: "#faf8f4",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 5px",
                        color: "#2c241c",
                        fontWeight: 700,
                      }}
                    >
                      {category?.icon}{" "}
                      {item.label || "Nimetön hintarivi"}
                    </p>

                    <p
                      style={{
                        margin: 0,
                        color: "#746d64",
                        fontSize: 13,
                      }}
                    >
                      {category?.label ?? item.categoryId}
                    </p>

                    {item.description.trim() && (
                      <p
                        style={{
                          margin: "8px 0 0",
                          color: "#5f5850",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#2c241c",
                        fontSize: 18,
                        fontWeight: 800,
                      }}
                    >
                      {item.price
                        ? `${item.price} €`
                        : "Hinta puuttuu"}
                    </p>

                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#746d64",
                        fontSize: 12,
                      }}
                    >
                      {getPricingUnitLabel(item.unit)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={valueStyle}>Hintoja ei ole lisätty.</p>
        )}
      </section>

      <div
        style={{
          padding: 18,
          borderRadius: 12,
          border: "1px solid #e2d2a8",
          backgroundColor: "#fff8e8",
          color: "#624a18",
          lineHeight: 1.55,
        }}
      >
        Lähettämisen jälkeen profiili siirtyy adminin tarkistettavaksi.
        Profiilia ei julkaista automaattisesti asiakkaille.
      </div>

      {submitError && (
        <div
          role="alert"
          style={{
            padding: 16,
            borderRadius: 12,
            border: "1px solid #e0baba",
            backgroundColor: "#fff5f5",
            color: "#8c3535",
            lineHeight: 1.5,
          }}
        >
          {submitError}
        </div>
      )}

      {isSubmitting && (
        <p
          aria-live="polite"
          style={{
            margin: 0,
            color: "#6e675f",
            fontWeight: 600,
          }}
        >
          Profiilia lähetetään…
        </p>
      )}
    </div>
  );
}