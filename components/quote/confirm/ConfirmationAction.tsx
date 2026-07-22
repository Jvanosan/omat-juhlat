"use client";

import Link from "next/link";

export default function ConfirmationAction({
  selectedCount,
  confirming,
  alreadyConfirmed,
  errorMessage,
  backHref,
  onConfirm,
}: {
  selectedCount: number;
  confirming: boolean;
  alreadyConfirmed: boolean;
  errorMessage: string;
  backHref: string;
  onConfirm: () => void;
}) {
  if (alreadyConfirmed) {
    return (
      <section className="rounded-3xl border border-[#b9dfd0] bg-[#edf8f3] p-6 text-center shadow-sm sm:p-8">
        <div
          aria-hidden="true"
          className="text-4xl"
        >
          ✅
        </div>

        <h2 className="mt-4 text-2xl font-bold text-[#11634d]">
          Valinta on jo vahvistettu
        </h2>

        <p className="mx-auto mt-2 max-w-xl leading-7 text-[#41685d]">
          Palveluntarjoajille on ilmoitettu
          valinnasta. He ottavat sinuun
          yhteyttä yksityiskohtien
          sopimiseksi.
        </p>

        <Link
          href={backHref}
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#168365] px-6 py-3 font-bold text-white transition hover:bg-[#116b53]"
        >
          Takaisin tarjoussivulle
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[#e1cfad] bg-white p-5 shadow-[0_18px_50px_rgba(73,53,31,0.09)] sm:p-8">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a773b]">
          Lopullinen vahvistus
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#211b16]">
          Valmis vahvistamaan?
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#70675e]">
          Vahvistat {selectedCount}{" "}
          {selectedCount === 1
            ? "palveluntarjoajan"
            : "palveluntarjoajaa"}
          . Vahvistamisen jälkeen valintaa
          ei voi vaihtaa tällä sivulla.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-[#ead29d] bg-[#fff8e8] p-4 text-sm leading-6 text-[#795a28]">
        <strong>Huomio:</strong> OmatJuhlat
        välittää yhteystiedot. Varsinainen
        sopimus, maksaminen, peruutusehdot ja
        tapahtuman yksityiskohdat sovitaan
        suoraan palveluntarjoajan kanssa.
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-2xl border border-[#edcaca] bg-[#fff0f0] p-4 text-sm font-semibold text-[#a33d3d]"
        >
          {errorMessage}
        </div>
      )}

      <button
        type="button"
        onClick={onConfirm}
        disabled={
          confirming ||
          selectedCount === 0
        }
        className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#b48a45] px-6 py-4 text-base font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#9f783a] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        {confirming
          ? "Vahvistetaan valintaa..."
          : "Vahvista palveluntarjoajien valinta"}
      </button>

      {selectedCount === 0 && (
        <Link
          href={backHref}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#d8c7ad] bg-white px-5 py-3 font-bold text-[#795a28] transition hover:border-[#b48a45] hover:bg-[#fffdf9]"
        >
          Palaa valitsemaan tarjous
        </Link>
      )}
    </section>
  );
}