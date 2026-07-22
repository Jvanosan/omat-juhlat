"use client";

import ServiceAreaSelector from "./ServiceAreaSelector";

import {
  BooleanField,
  FormSection,
  SelectField,
  TextAreaField,
  TextField,
} from "./ProfileFormFields";

import type { CompanyDetails } from "../types";

type CompanyDetailsStepProps = {
  form: CompanyDetails;

  onChange: <
    Field extends keyof CompanyDetails,
  >(
    field: Field,
    value: CompanyDetails[Field],
  ) => void;
};

export default function CompanyDetailsStep({
  form,
  onChange,
}: CompanyDetailsStepProps) {
  return (
    <div className="space-y-10">
      <FormSection
        title="Yrityksen tiedot"
        description="Yrityksen perustiedot ja asiakkaiden yhteydenottoja hoitava henkilö."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="Yrityksen nimi"
            value={form.companyName}
            onChange={(value) =>
              onChange(
                "companyName",
                value,
              )
            }
            required
            placeholder="Yrityksen virallinen tai julkinen nimi"
          />

          <TextField
            label="Y-tunnus"
            value={form.businessId}
            onChange={(value) =>
              onChange(
                "businessId",
                value,
              )
            }
            placeholder="1234567-8"
            helpText="Y-tunnusta ei näytetä julkisessa profiilissa."
          />

          <TextField
            label="Yhteyshenkilö"
            value={form.contactName}
            onChange={(value) =>
              onChange(
                "contactName",
                value,
              )
            }
            required
            placeholder="Etunimi Sukunimi"
          />

          <TextField
            label="Sähköposti"
            type="email"
            inputMode="email"
            value={form.email}
            onChange={(value) =>
              onChange("email", value)
            }
            required
            placeholder="yritys@example.fi"
          />

          <TextField
            label="Puhelin"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(value) =>
              onChange("phone", value)
            }
            placeholder="+358 40 123 4567"
          />

          <TextField
            label="Verkkosivu"
            type="url"
            inputMode="url"
            value={form.website}
            onChange={(value) =>
              onChange(
                "website",
                value,
              )
            }
            placeholder="https://yritys.fi"
          />
        </div>
      </FormSection>

      <FormSection
        title="Sijainti ja toiminta-alueet"
        description="Valitse paikkakunnat, joilla asiakkaat voivat tilata palveluitanne."
      >
        <ServiceAreaSelector
          value={form.city}
          onChange={(value) =>
            onChange("city", value)
          }
          required
        />

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <TextField
            label="Postinumero"
            value={form.postalCode}
            onChange={(value) =>
              onChange(
                "postalCode",
                value,
              )
            }
            inputMode="numeric"
            placeholder="00100"
            helpText="Yrityksen tai toimipisteen postinumero."
          />

          <TextField
            label="Toimintasäde (km)"
            type="number"
            inputMode="numeric"
            value={
              form.operatingRangeKm
            }
            onChange={(value) =>
              onChange(
                "operatingRangeKm",
                value,
              )
            }
            min={0}
            max={2000}
            placeholder="Esimerkiksi 50"
            helpText="Voit jättää tyhjäksi, jos valitut alueet riittävät."
          />

          <div className="md:col-span-2">
            <TextField
              label="Yrityksen tai toimipisteen osoite"
              value={form.address}
              onChange={(value) =>
                onChange(
                  "address",
                  value,
                )
              }
              placeholder="Katuosoite"
              helpText="Täytä vain, jos osoite on asiakkaalle olennainen tai julkinen."
            />
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Kapasiteetti ja hintataso"
        description="Kerro, minkä kokoisiin tapahtumiin palvelunne sopii ja millä hintatasolla toimitte."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="Vähimmäisvierasmäärä"
            type="number"
            inputMode="numeric"
            value={form.minGuests}
            onChange={(value) =>
              onChange(
                "minGuests",
                value,
              )
            }
            min={0}
            max={10000}
            placeholder="Esimerkiksi 10"
          />

          <TextField
            label="Enimmäisvierasmäärä"
            type="number"
            inputMode="numeric"
            value={form.maxGuests}
            onChange={(value) =>
              onChange(
                "maxGuests",
                value,
              )
            }
            min={0}
            max={10000}
            placeholder="Esimerkiksi 200"
          />

          <div className="md:col-span-2">
            <SelectField
              label="Keskimääräinen hintataso"
              value={
                form.avgPriceLevel
              }
              onChange={(value) =>
                onChange(
                  "avgPriceLevel",
                  value,
                )
              }
              emptyLabel="Valitse hintataso"
              options={[
                {
                  value: "€",
                  label:
                    "€ – Edullinen",
                },
                {
                  value: "€€",
                  label:
                    "€€ – Keskitaso",
                },
                {
                  value: "€€€",
                  label:
                    "€€€ – Korkeampi hintataso",
                },
              ]}
              helpText="Tarkemmat palvelukohtaiset hinnat lisätään Hinnoittelu-osiossa."
            />
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <BooleanField
            label="Pysäköinti saatavilla"
            description="Asiakkaiden käytettävissä on pysäköintipaikkoja."
            checked={form.parking}
            onChange={(checked) =>
              onChange(
                "parking",
                checked,
              )
            }
          />

          <BooleanField
            label="Esteetön"
            description="Tila tai palvelu soveltuu liikuntarajoitteisille."
            checked={
              form.accessibility
            }
            onChange={(checked) =>
              onChange(
                "accessibility",
                checked,
              )
            }
          />
        </div>
      </FormSection>

      <FormSection
        title="Sosiaalinen media"
        description="Lisää yrityksesi julkiset sosiaalisen median osoitteet."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="Instagram"
            type="url"
            inputMode="url"
            value={
              form.instagramUrl
            }
            onChange={(value) =>
              onChange(
                "instagramUrl",
                value,
              )
            }
            placeholder="https://instagram.com/..."
          />

          <TextField
            label="Facebook"
            type="url"
            inputMode="url"
            value={
              form.facebookUrl
            }
            onChange={(value) =>
              onChange(
                "facebookUrl",
                value,
              )
            }
            placeholder="https://facebook.com/..."
          />

          <TextField
            label="TikTok"
            type="url"
            inputMode="url"
            value={form.tiktokUrl}
            onChange={(value) =>
              onChange(
                "tiktokUrl",
                value,
              )
            }
            placeholder="https://tiktok.com/@..."
          />
        </div>
      </FormSection>

      <FormSection
        title="Kuvaus ja aukioloajat"
        description="Nämä tiedot näkyvät asiakkaalle yrityksesi julkisessa profiilissa."
      >
        <div className="space-y-5">
          <TextAreaField
            label="Yrityksen kuvaus"
            value={form.description}
            onChange={(value) =>
              onChange(
                "description",
                value,
              )
            }
            rows={7}
            required
            maxLength={3000}
            placeholder="Kerro yrityksestä, palveluista, kokemuksesta ja siitä, miksi asiakkaan kannattaa valita teidät..."
            helpText="Hyvä kuvaus kertoo asiakkaalle palvelun sisällöstä ja yrityksen vahvuuksista."
          />

          <TextAreaField
            label="Aukioloajat tai tavoitettavuus"
            value={
              form.openingHours
            }
            onChange={(value) =>
              onChange(
                "openingHours",
                value,
              )
            }
            rows={4}
            maxLength={1000}
            placeholder={
              "Ma–Pe 09.00–17.00\nLa sopimuksen mukaan"
            }
          />
        </div>
      </FormSection>
    </div>
  );
}