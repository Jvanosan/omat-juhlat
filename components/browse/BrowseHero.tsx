export default function BrowseHero() {
  return (
    <div className="relative h-[220px] md:h-[280px] flex items-end">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/juhlat.png')",
        }}
      />

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative max-w-5xl mx-auto px-6 pb-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Löydä palvelut tapahtumaasi
        </h1>

        <p className="mt-3 text-lg text-zinc-300 max-w-md">
          Valitse haluamasi palveluntarjoajat ja lähetä tarjouspyyntö suoraan
          heille.
        </p>
      </div>
    </div>
  );
}