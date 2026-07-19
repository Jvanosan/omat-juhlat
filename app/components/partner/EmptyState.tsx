type DashboardFilter =
  | "all"
  | "waiting"
  | "offered"
  | "selected";

type EmptyStateProps = {
  activeFilter: DashboardFilter;
};

export default function EmptyState({
  activeFilter,
}: EmptyStateProps) {
  const messages: Record<
    DashboardFilter,
    {
      icon: string;
      title: string;
      description: string;
    }
  > = {
    all: {
      icon: "📭",
      title: "Ei tarjouspyyntöjä",
      description:
        "Sinulle ei ole tällä hetkellä avoimia tarjouspyyntöjä.",
    },
    waiting: {
      icon: "✅",
      title: "Kaikkiin on vastattu",
      description:
        "Sinulla ei ole tällä hetkellä vastausta odottavia tarjouspyyntöjä.",
    },
    offered: {
      icon: "💰",
      title: "Ei lähetettyjä tarjouksia",
      description:
        "Lähettämäsi tarjoukset näkyvät myöhemmin tässä.",
    },
    selected: {
      icon: "🏆",
      title: "Ei hyväksyttyjä tarjouksia",
      description:
        "Asiakkaiden valitsemat tarjoukset näkyvät tässä.",
    },
  };

  const content = messages[activeFilter];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: "40px 24px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 42,
          marginBottom: 14,
        }}
      >
        {content.icon}
      </div>

      <h2
        style={{
          color: "#111827",
          fontSize: 22,
          margin: "0 0 8px",
        }}
      >
        {content.title}
      </h2>

      <p
        style={{
          color: "#6b7280",
          fontSize: 16,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {content.description}
      </p>
    </div>
  );
}