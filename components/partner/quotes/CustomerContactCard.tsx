"use client";

import {
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import type {
  CustomerContact,
} from "./types";

type CustomerContactCardProps = {
  requestType:
    | "direct"
    | "category";
  requestId: string | number;
};

type ContactApiResponse = {
  contact?: CustomerContact;
  error?: string;
};

export default function CustomerContactCard({
  requestType,
  requestId,
}: CustomerContactCardProps) {
  const [contact, setContact] =
    useState<CustomerContact | null>(
      null,
    );

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function loadContact() {
    if (loading || contact) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { session },
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        throw new Error(
          "Kirjaudu uudelleen nähdäksesi asiakkaan yhteystiedot.",
        );
      }

      const response = await fetch(
        "/api/partner/customer-contact",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            requestType,
            requestId: String(
              requestId,
            ),
          }),
          cache: "no-store",
        },
      );

      const result =
        (await response
          .json()
          .catch(
            () => ({}),
          )) as ContactApiResponse;

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Asiakkaan yhteystietojen hakeminen epäonnistui.",
        );
      }

      if (!result.contact) {
        throw new Error(
          "Asiakkaan yhteystietoja ei löytynyt.",
        );
      }

      setContact(result.contact);
    } catch (error) {
      console.error(
        "CUSTOMER CONTACT LOAD ERROR:",
        error,
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Asiakkaan yhteystietojen hakeminen epäonnistui.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!contact) {
    return (
      <div className="mt-5 rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-[#11634d]">
              Asiakkaan yhteystiedot
            </p>

            <p className="mt-1 text-sm leading-6 text-[#41685d]">
              Asiakas on vahvistanut
              valintansa. Voit nyt avata
              yhteystiedot ja sopia
              tapahtuman yksityiskohdista.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadContact()
            }
            disabled={loading}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#168365] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#116b53] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Haetaan..."
              : "Näytä yhteystiedot"}
          </button>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-[#edcaca] bg-[#fff3f3] px-4 py-3 text-sm leading-6 text-[#a33d3d]"
          >
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-[#b9dfd0] bg-[#edf8f3] p-5">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#168365]">
          Vahvistettu asiakas
        </p>

        <h4 className="mt-2 text-lg font-bold text-[#11634d]">
          Asiakkaan yhteystiedot
        </h4>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        {contact.name && (
          <ContactItem
            label="Nimi"
            value={contact.name}
            icon="👤"
          />
        )}

        <ContactItem
          label="Sähköposti"
          value={contact.email}
          href={`mailto:${contact.email}`}
          icon="✉️"
        />

        {contact.phone && (
          <ContactItem
            label="Puhelin"
            value={contact.phone}
            href={`tel:${contact.phone}`}
            icon="📞"
          />
        )}
      </dl>

      <p className="mt-4 text-xs leading-5 text-[#41685d]">
        Käytä yhteystietoja vain tämän
        vahvistetun tapahtuman hoitamiseen.
      </p>
    </div>
  );
}

function ContactItem({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-[#cce5dc] bg-white p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-[#618077]">
        <span
          aria-hidden="true"
          className="mr-2"
        >
          {icon}
        </span>

        {label}
      </dt>

      <dd className="mt-2 break-words font-semibold text-[#214f43]">
        {href ? (
          <a
            href={href}
            className="underline decoration-[#8cb9aa] underline-offset-4 transition hover:text-[#168365]"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}