type ProfileHeaderProps = {
  companyName?: string;
  onBack: () => void;
  onLogout: () => void;
};

export default function ProfileHeader({
  companyName,
  onBack,
  onLogout,
}: ProfileHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 20,
        flexWrap: "wrap",
        marginBottom: 28,
      }}
    >
      <div>
        <button
          type="button"
          onClick={onBack}
          style={{
            marginBottom: 16,
            padding: 0,
            border: "none",
            background: "transparent",
            color: "#6b7280",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Takaisin dashboardiin
        </button>

        <h1
          style={{
            margin: 0,
            color: "#111827",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 850,
            lineHeight: 1.15,
          }}
        >
          Täydennä yritysprofiilisi
        </h1>

        <p
          style={{
            margin: "10px 0 0",
            color: "#6b7280",
            fontSize: 16,
            lineHeight: 1.7,
            maxWidth: 680,
          }}
        >
          Lisää yrityksesi tärkeimmät tiedot, palvelut ja kuvat.
          Valmis profiili auttaa asiakkaita tutustumaan yritykseesi
          ja lähettämään sopivia tarjouspyyntöjä.
        </p>

        {companyName && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 14,
              padding: "8px 12px",
              borderRadius: 999,
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              color: "#374151",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            🏢 {companyName}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onLogout}
        style={{
          padding: "11px 17px",
          border: "1px solid #fecaca",
          borderRadius: 10,
          background: "#ffffff",
          color: "#dc2626",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        Kirjaudu ulos
      </button>
    </header>
  );
}