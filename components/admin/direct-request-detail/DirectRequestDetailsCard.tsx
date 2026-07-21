import type { AdminDirectRequest } from "./types";

type DirectRequestDetailsCardProps = {
  request: AdminDirectRequest;
};

function formatDate(value: string | null) {
  if (!value) return "Ei ilmoitettu";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fi-FI").format(date);
}

export default function DirectRequestDetailsCard({
  request,
}: DirectRequestDetailsCardProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-purple-400">
          Suora tarjouspyyntö
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          Asiakkaan juhla- ja yhteystiedot
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Detail label="Tapahtuma" value={request.event_type} />

        <Detail
          label="Päivämäärä"
          value={formatDate(request.event_date)}
        />

        <Detail label="Sijainti" value={request.location} />

        <Detail
          label="Vierasmäärä"
          value={
            request.guests
              ? `${request.guests} henkilöä`
              : "Ei ilmoitettu"
          }
        />

        <Detail
          label="Budjetti"
          value={
            request.budget !== null && request.budget !== ""
              ? `${request.budget} €`
              : "Ei ilmoitettu"
          }
        />

        <Detail
          label="Pyydetyt palvelut"
          value={request.services}
        />

        <Detail
          label="Asiakkaan nimi"
          value={request.customer_name}
        />

        <Detail label="Sähköposti" value={request.email} />

        <Detail label="Puhelinnumero" value={request.phone} />
      </div>

      {request.notes && (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <p className="text-sm text-zinc-500">Lisätiedot</p>

          <p className="mt-2 whitespace-pre-line leading-7 text-zinc-300">
            {request.notes}
          </p>
        </div>
      )}
    </section>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div>
      <p className="text-sm text-zinc-500">{label}</p>

      <p className="mt-1 break-words font-medium text-zinc-100">
        {value || "Ei ilmoitettu"}
      </p>
    </div>
  );
}