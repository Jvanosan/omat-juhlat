"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

type AccountSettingsCardProps = {
  company: string;
  email: string;
  slug: string | null;
  status: string | null;
  profileCompleted:
    | boolean
    | null;
};

export function AccountSettingsCard({
  company,
  email,
  slug,
  status,
  profileCompleted,
}: AccountSettingsCardProps) {
  const published =
    status === "approved" &&
    profileCompleted &&
    Boolean(slug);

  return (
    <SettingsCard
      icon="🏢"
      title="Yritys ja käyttäjätili"
      description="Partneritiliin yhdistetyt perustiedot."
    >
      <dl className="grid gap-4 sm:grid-cols-2">
        <AccountDetail
          label="Yritys"
          value={company}
        />

        <AccountDetail
          label="Kirjautumissähköposti"
          value={
            email ||
            "Ei sähköpostiosoitetta"
          }
        />

        <AccountDetail
          label="Tilin tila"
          value={getStatusLabel(
            status,
          )}
        />

        <AccountDetail
          label="Julkinen profiili"
          value={
            published
              ? "Julkaistu"
              : "Ei vielä julkaistu"
          }
          positive={published}
        />
      </dl>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/partner/profile"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#b48a45] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#9f783a]"
        >
          Muokkaa yritysprofiilia
        </Link>

        {published && slug && (
          <Link
            href={`/partner/${encodeURIComponent(
              slug,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#ded3c4] bg-white px-4 py-3 text-sm font-bold text-[#62584f] transition hover:border-[#b48a45] hover:bg-[#fffaf2]"
          >
            Avaa julkinen profiili ↗
          </Link>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-[#d7e1ef] bg-[#f3f7fc] p-4 text-sm leading-6 text-[#4c627e]">
        Kirjautumissähköpostin
        muuttaminen vaatii uuden
        sähköpostiosoitteen vahvistamisen.
        Otamme tämän käyttöön myöhemmässä
        vaiheessa erillisenä turvallisena
        toimintona.
      </div>
    </SettingsCard>
  );
}

type PasswordSettingsCardProps = {
  processing: boolean;

  onUpdate: (
    password: string,
    confirmation: string,
  ) => Promise<boolean>;

  onClearMessages: () => void;
};

export function PasswordSettingsCard({
  processing,
  onUpdate,
  onClearMessages,
}: PasswordSettingsCardProps) {
  const [password, setPassword] =
    useState("");

  const [
    confirmation,
    setConfirmation,
  ] = useState("");

  const [
    showPasswords,
    setShowPasswords,
  ] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const success =
      await onUpdate(
        password,
        confirmation,
      );

    if (success) {
      setPassword("");
      setConfirmation("");
      setShowPasswords(false);
    }
  }

  return (
    <SettingsCard
      icon="🔐"
      title="Vaihda salasana"
      description="Valitse vähintään kahdeksan merkin pituinen uusi salasana."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <PasswordField
          id="settings-password"
          label="Uusi salasana"
          value={password}
          visible={showPasswords}
          disabled={processing}
          autoComplete="new-password"
          onChange={(value) => {
            setPassword(value);
            onClearMessages();
          }}
        />

        <PasswordField
          id="settings-password-confirmation"
          label="Vahvista uusi salasana"
          value={confirmation}
          visible={showPasswords}
          disabled={processing}
          autoComplete="new-password"
          onChange={(value) => {
            setConfirmation(value);
            onClearMessages();
          }}
        />

        <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#62584f]">
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={(event) =>
              setShowPasswords(
                event.target.checked,
              )
            }
            className="h-4 w-4 accent-[#b48a45]"
          />

          Näytä salasanat
        </label>

        <div>
          <button
            type="submit"
            disabled={
              processing ||
              !password ||
              !confirmation
            }
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#168365] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#116b53] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {processing
              ? "Vaihdetaan salasanaa..."
              : "Vaihda salasana"}
          </button>
        </div>
      </form>
    </SettingsCard>
  );
}

export function NotificationSettingsCard() {
  return (
    <SettingsCard
      icon="🔔"
      title="Sähköposti-ilmoitukset"
      description="Tärkeät tapahtumat lähetetään partneritilisi sähköpostiin."
    >
      <div className="space-y-3">
        <NotificationRow
          title="Uudet tarjouspyynnöt"
          description="Saat tiedon, kun yrityksellesi saapuu uusi tarjouspyyntö."
        />

        <NotificationRow
          title="Tarjouksen hyväksyminen"
          description="Saat tiedon, kun asiakas hyväksyy lähettämäsi tarjouksen."
        />

        <NotificationRow
          title="Tärkeät tilimuutokset"
          description="Saat turvallisuuteen ja partneritiliin liittyvät ilmoitukset."
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-[#91877d]">
        Nämä tärkeät ilmoitukset ovat
        tällä hetkellä aina käytössä.
        Valinnaiset markkinointiviestit
        lisätään myöhemmin erikseen.
      </p>
    </SettingsCard>
  );
}

type SessionSettingsCardProps = {
  loggingOut: boolean;
  onLogout: () => void;
};

export function SessionSettingsCard({
  loggingOut,
  onLogout,
}: SessionSettingsCardProps) {
  return (
    <SettingsCard
      icon="🚪"
      title="Kirjautuminen"
      description="Kirjaudu ulos tältä laitteelta turvallisesti."
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-[#edcaca] bg-[#fff7f7] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-[#713d3d]">
            Kirjaudu ulos
          </p>

          <p className="mt-1 text-sm leading-6 text-[#8c6262]">
            Sinut ohjataan takaisin
            partnerin kirjautumissivulle.
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-[#d99e9e] bg-white px-4 py-3 text-sm font-bold text-[#a33d3d] transition hover:bg-[#fff0f0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loggingOut
            ? "Kirjaudutaan ulos..."
            : "Kirjaudu ulos"}
        </button>
      </div>
    </SettingsCard>
  );
}

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#e2d5c4] bg-white shadow-sm">
      <div className="flex items-start gap-4 border-b border-[#eee5d9] bg-[#fffaf2] px-5 py-5 sm:px-6">
        <div
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm"
        >
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#211b16] sm:text-xl">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#70675e]">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

function AccountDetail({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#eee5d9] bg-[#fffdf9] p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-[#91877d]">
        {label}
      </dt>

      <dd
        className={`mt-2 break-words font-bold ${
          positive
            ? "text-[#168365]"
            : "text-[#3f362f]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  visible,
  disabled,
  autoComplete,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  visible: boolean;
  disabled: boolean;
  autoComplete: string;
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

      <input
        id={id}
        type={
          visible
            ? "text"
            : "password"
        }
        required
        minLength={8}
        autoComplete={autoComplete}
        disabled={disabled}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="min-h-13 w-full rounded-xl border border-[#ded3c4] bg-[#fffdf9] px-4 py-3 text-[#211b16] outline-none transition focus:border-[#b48a45] focus:bg-white focus:ring-4 focus:ring-[#ead8b8]/35 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
}

function NotificationRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#d8e6dd] bg-[#f5fbf8] p-4">
      <span
        aria-hidden="true"
        className="mt-0.5 text-[#168365]"
      >
        ✓
      </span>

      <div>
        <p className="font-bold text-[#264d42]">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-[#567269]">
          {description}
        </p>
      </div>
    </div>
  );
}

function getStatusLabel(
  status: string | null,
) {
  switch (
    status
      ?.trim()
      .toLowerCase()
  ) {
    case "approved":
      return "Hyväksytty";

    case "pending":
      return "Odottaa hyväksyntää";

    case "rejected":
      return "Hylätty";

    default:
      return status ||
        "Ei määritetty";
  }
}