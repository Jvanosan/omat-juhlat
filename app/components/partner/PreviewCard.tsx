type PreviewData = {
  company_name: string;
  description: string;
  city: string;
  service_category: string;
  min_guests: string;
  max_guests: string;
  price_range: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  cover_image_url: string;
};

type PreviewCardProps = {
  form: PreviewData;
};

export default function PreviewCard({
  form,
}: PreviewCardProps) {
  return (
    <section
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: 24,
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        marginBottom: 24,
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 20,
          fontSize: 24,
          fontWeight: 800,
          color: "#111827",
        }}
      >
        👀 Profiilin esikatselu
      </h2>

      {form.cover_image_url && (
        <img
          src={form.cover_image_url}
          alt="Kansikuva"
          style={{
            width: "100%",
            height: 260,
            objectFit: "cover",
            borderRadius: 16,
            marginBottom: 20,
            border: "1px solid #e5e7eb",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <img
          src={
            form.logo_url ||
            "https://placehold.co/120x120?text=Logo"
          }
          alt="Logo"
          style={{
            width: 110,
            height: 110,
            objectFit: "contain",
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            background: "#fff",
          }}
        />

        <div>
          <h2
            style={{
              margin: 0,
              color: "#111827",
              fontSize: 28,
            }}
          >
            {form.company_name || "Yrityksen nimi"}
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#6b7280",
            }}
          >
            📍 {form.city || "Kaupunki"}
          </p>

          <p
            style={{
              marginTop: 6,
              color: "#6b7280",
            }}
          >
            🎉 {form.service_category || "Palvelukategoria"}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Info title="Vierasmäärä">
          {form.min_guests || "0"} - {form.max_guests || "0"}
        </Info>

        <Info title="Hintataso">
          {form.price_range || "-"}
        </Info>

        <Info title="Puhelin">
          {form.phone || "-"}
        </Info>

        <Info title="Sähköposti">
          {form.email || "-"}
        </Info>

        <Info title="Verkkosivut">
          {form.website || "-"}
        </Info>
      </div>

      <div>
        <h3
          style={{
            marginBottom: 10,
            color: "#111827",
          }}
        >
          Yrityksen esittely
        </h3>

        <p
          style={{
            lineHeight: 1.8,
            color: "#4b5563",
            whiteSpace: "pre-wrap",
          }}
        >
          {form.description ||
            "Yrityksen kuvaus näkyy tässä."}
        </p>
      </div>
    </section>
  );
}

function Info({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 14,
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          color: "#6b7280",
          fontSize: 13,
          marginBottom: 6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#111827",
          fontWeight: 700,
        }}
      >
        {children}
      </div>
    </div>
  );
}