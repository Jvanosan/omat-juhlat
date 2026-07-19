type DashboardFilter = "all" | "waiting" | "offered" | "selected";

type DashboardStatsProps = {
  total: number;
  waiting: number;
  offered: number;
  selected: number;
  activeFilter: DashboardFilter;
  onFilterChange: (filter: DashboardFilter) => void;
};

export default function DashboardStats({
  total,
  waiting,
  offered,
  selected,
  activeFilter,
  onFilterChange,
}: DashboardStatsProps) {
  const cards: {
    title: string;
    value: number;
    icon: string;
    filter: DashboardFilter;
  }[] = [
    {
      title: "Kaikki",
      value: total,
      icon: "📦",
      filter: "all",
    },
    {
      title: "Odottaa vastausta",
      value: waiting,
      icon: "🕒",
      filter: "waiting",
    },
    {
      title: "Lähetetyt tarjoukset",
      value: offered,
      icon: "💰",
      filter: "offered",
    },
    {
      title: "Hyväksytyt",
      value: selected,
      icon: "🏆",
      filter: "selected",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
        marginBottom: 30,
      }}
    >
      {cards.map((card) => {
        const isActive = activeFilter === card.filter;

        return (
          <button
            key={card.title}
            type="button"
            onClick={() => onFilterChange(card.filter)}
            style={{
              width: "100%",
              textAlign: "left",
              background: isActive ? "#ecfdf5" : "#ffffff",
              borderRadius: 18,
              padding: 20,
              border: isActive
                ? "2px solid #10b981"
                : "1px solid #e5e7eb",
              boxShadow: isActive
                ? "0 12px 28px rgba(16,185,129,0.16)"
                : "0 10px 20px rgba(0,0,0,0.06)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>
              {card.icon}
            </div>

            <div
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              {card.value}
            </div>

            <div
              style={{
                color: isActive ? "#047857" : "#6b7280",
                marginTop: 6,
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {card.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}