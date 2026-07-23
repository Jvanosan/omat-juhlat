"use client";

import {
  FINNISH_LOCATIONS,
} from "@/lib/locations";

import {
  PARTNER_SERVICE_CATEGORIES,
} from "@/app/partner/apply/types";

import type {
  PartnerApplicationForm,
} from "@/app/partner/apply/types";

type PartnerApplicationFormProps = {
  form: PartnerApplicationForm;
  loading: boolean;
  errorMessage: string;

  onChange: (
    field: keyof PartnerApplicationForm,
    value: string,
  ) => void;

  onSubmit: () => void;
};

export default function PartnerApplicationForm({
  form,
  loading,
  errorMessage,
  onChange,
  onSubmit,
}: PartnerApplicationFormProps) {
  return (
    <section
      aria-labelledby="application-title"
      className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-[0_22px_65px_rgba(73,53,31,0.12)]"
    >
      <div className="border-b border-[#eee5d9] bg-[#fffaf2] px-5 py-6 sm:px-8 sm:py-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
          Kumppanihakemus
        </p>

        <h2
          id="application-title"
          className="mt-2 text-2xl font-bold text-[#211b16] sm:text-3xl"
        >
          Kerro yrityksestäsi
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#70675e] sm:text-base">
          Täytä tiedot huolellisesti.
          Käymme jokaisen hakemuksen
          läpi ennen kumppanuuden
          hyväksymistä.
        </p>

        <p className="mt-4 text-sm text-[#70675e]">
          <span className="font-bold text-[#a33d3d]">
            *
          </span>{" "}
          merkityt kentät ovat pakollisia.
        </p>
      </div>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="space-y-8 px-5 py-7 sm:px-8"
      >
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-4 text-[#a33d3d]"
          >
            <span
              aria-hidden="true"
              className="text-lg"
            >
              ⚠️
            </span>

            <div>
              <p className="font-bold">
                Tarkista hakemuksen tiedot
              </p>

              <p className="mt-1 text-sm leading-6">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <FormSection
          title="Yrityksen perustiedot"
          description="Näiden tietojen avulla tunnistamme yrityksesi ja yhteyshenkilön."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="application-company"
              label="Yrityksen nimi"
              required
              autoComplete="organization"
              value={form.company_name}
              onChange={(value) =>
                onChange(
                  "company_name",
                  value,
                )
              }
            />

            <TextField
              id="application-contact"
              label="Yhteyshenkilön nimi"
              required
              autoComplete="name"
              value={form.contact_name}
              onChange={(value) =>
                onChange(
                  "contact_name",
                  value,
                )
              }
            />

            <TextField
              id="application-email"
              label="Sähköposti"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={form.email}
              onChange={(value) =>
                onChange(
                  "email",
                  value,
                )
              }
            />

            <TextField
              id="application-phone"
              label="Puhelinnumero"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(value) =>
                onChange(
                  "phone",
                  value,
                )
              }
            />

            <TextField
              id="application-website"
              label="Verkkosivusto"
              type="url"
              autoComplete="url"
              inputMode="url"
              placeholder="https://yritys.fi"
              value={form.website}
              onChange={(value) =>
                onChange(
                  "website",
                  value,
                )
              }
            />
          </div>
        </FormSection>

        <FormSection
          title="Palvelu ja toiminta-alue"
          description="Valitse yrityksesi tärkein palvelukategoria ja kotipaikkakunta."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              id="application-category"
              label="Palvelukategoria"
              required
              value={
                form.service_category
              }
              placeholder="Valitse palvelukategoria"
              options={[
                ...PARTNER_SERVICE_CATEGORIES,
              ]}
              onChange={(value) =>
                onChange(
                  "service_category",
                  value,
                )
              }
            />

            <SelectField
              id="application-city"
              label="Kaupunki tai alue"
              required
              value={form.city}
              placeholder="Valitse kaupunki"
              options={
                FINNISH_LOCATIONS
              }
              onChange={(value) =>
                onChange(
                  "city",
                  value,
                )
              }
            />
          </div>
        </FormSection>

        <FormSection
          title="Kerro yrityksestäsi"
          description="Lyhyt kuvaus auttaa meitä arvioimaan, miten yrityksesi sopii OmatJuhlat-palveluun."
        >
          <TextAreaField
            id="application-description"
            label="Yrityksen kuvaus"
            value={form.description}
            maxLength={2000}
            rows={6}
            placeholder="Kerro yrityksen palveluista, kokemuksesta ja siitä, millaisia tapahtumia palvelette."
            onChange={(value) =>
              onChange(
                "description",
                value,
              )
            }
          />

          <TextAreaField
            id="application-notes"
            label="Lisätiedot"
            value={form.notes}
            maxLength={1000}
            rows={4}
            placeholder="Muu hakemukseen liittyvä tieto (valinnainen)"
            onChange={(value) =>
              onChange(
                "notes",
                value,
              )
            }
          />
        </FormSection>

        <div className="rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-5">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="text-xl"
            >
              🔒
            </span>

            <div>
              <p className="font-bold text-[#11634d]">
                Tietosi käsitellään
                luottamuksellisesti
              </p>

              <p className="mt-1 text-sm leading-6 text-[#41685d]">
                Hakemuksen lähettäminen ei
                sido yritystäsi
                kumppanuuteen. Tietoja
                käytetään vain hakemuksen
                käsittelyyn.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(180,138,69,0.25)] transition hover:-translate-y-0.5 hover:bg-[#9f783a] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading
            ? "Lähetetään hakemusta..."
            : "Lähetä kumppanihakemus"}
        </button>
      </form>
    </section>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-5">
      <legend className="text-xl font-bold text-[#211b16]">
        {title}
      </legend>

      <p className="-mt-3 text-sm leading-6 text-[#70675e]">
        {description}
      </p>

      {children}
    </fieldset>
  );
}

function TextField({
  id,
  label,
  value,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
  inputMode,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?:
    | "text"
    | "email"
    | "tel"
    | "url";
  onChange: (value: string) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="block"
    >
      <span className="mb-2 block text-sm font-bold text-[#3f362f]">
        {label}

        {required && (
          <span className="text-[#a33d3d]">
            {" "}
            *
          </span>
        )}
      </span>

      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="min-h-13 w-full rounded-xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3 text-[#211b16] outline-none transition placeholder:text-[#a69b90] focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35"
      />
    </label>
  );
}

function SelectField({
  id,
  label,
  value,
  placeholder,
  options,
  required = false,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: readonly string[];
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="block"
    >
      <span className="mb-2 block text-sm font-bold text-[#3f362f]">
        {label}

        {required && (
          <span className="text-[#a33d3d]">
            {" "}
            *
          </span>
        )}
      </span>

      <select
        id={id}
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="min-h-13 w-full rounded-xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3 text-[#211b16] outline-none transition focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  id,
  label,
  value,
  maxLength,
  rows,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  maxLength: number;
  rows: number;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="block"
    >
      <span className="mb-2 block text-sm font-bold text-[#3f362f]">
        {label}
      </span>

      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-y rounded-xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3 text-[#211b16] outline-none transition placeholder:text-[#a69b90] focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35"
      />

      <span className="mt-1 block text-right text-xs text-[#91877d]">
        {value.length}/{maxLength} merkkiä
      </span>
    </label>
  );
}