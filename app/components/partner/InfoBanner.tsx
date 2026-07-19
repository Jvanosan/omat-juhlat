export default function InfoBanner() {
  return (
    <div
      style={{
        marginBottom: 28,
        padding: 24,
        borderRadius: 20,
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 12,
        }}
      >
        👋 Tervetuloa Partner Dashboardiin
      </div>

      <p
        style={{
          lineHeight: 1.8,
          color: "#d1d5db",
          marginBottom: 18,
        }}
      >
        Täällä hallitset kaikki tarjouspyyntösi yhdestä paikasta.
        Vastaa uusiin tarjouspyyntöihin mahdollisimman nopeasti,
        sillä asiakas näkee tarjouksesi heti sen lähettämisen jälkeen.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 14,
        }}
      >
        <div>
          <strong>1️⃣ Uusi tarjouspyyntö</strong>
          <p style={{ marginTop: 6, color: "#cbd5e1" }}>
            Saat uuden tarjouspyynnön dashboardiin.
          </p>
        </div>

        <div>
          <strong>2️⃣ Lähetä tarjous</strong>
          <p style={{ marginTop: 6, color: "#cbd5e1" }}>
            Anna hinta ja halutessasi viesti asiakkaalle.
          </p>
        </div>

        <div>
          <strong>3️⃣ Asiakas päättää</strong>
          <p style={{ marginTop: 6, color: "#cbd5e1" }}>
            Asiakas vertailee tarjoukset ja tekee päätöksen.
          </p>
        </div>

        <div>
          <strong>4️⃣ Seuraa tilaa</strong>
          <p style={{ marginTop: 6, color: "#cbd5e1" }}>
            Näet heti, onko tarjouksesi hyväksytty tai hylätty.
          </p>
        </div>
      </div>
    </div>
  );
}