type DashboardHeaderProps = {
  onLogout: () => void;
};

export default function DashboardHeader({
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#111827",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          📥 Saapuneet tarjouspyynnöt
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "#6b7280",
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          Hallitse tarjouspyyntöjä ja seuraa asiakkaiden päätöksiä.
        </p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        style={{
          background: "#ef4444",
          color: "#ffffff",
          border: "none",
          padding: "11px 17px",
          borderRadius: 10,
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        Kirjaudu ulos
      </button>
    </header>
  );
}