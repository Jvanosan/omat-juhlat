type QuoteStatusProps = {
  item: any;
};

export default function QuoteStatus({ item }: QuoteStatusProps) {
  const isCancelled =
    item.status === "cancelled" || item.status === "peruttu";

  const isSelected =
    item.status === "selected" || item.status === "valittu";

  const isRejected =
    item.status === "rejected" || item.status === "hävitty";

  const isWaiting =
    item.status === "sent" && !item.offer_price;

  const isOffered =
    item.status === "offered" && item.offer_price;

  return (
    <>
      {isCancelled && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "10px 14px",
            borderRadius: 10,
            marginBottom: 12,
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          ❌ Tarjous peruttu
        </div>
      )}

      {isSelected && (
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: 14,
            borderRadius: 10,
            marginBottom: 12,
            border: "1px solid #86efac",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            🏆 Asiakas valitsi tämän tarjouksen
          </div>

          {item.quote?.name && (
            <div>👤 {item.quote.name}</div>
          )}

          {item.quote?.email && (
            <div>📧 {item.quote.email}</div>
          )}

          {item.quote?.phone && (
            <div>📞 {item.quote.phone}</div>
          )}

          {item.quote?.extraInfo && (
            <div style={{ marginTop: 10 }}>
              💬 {item.quote.extraInfo}
            </div>
          )}
        </div>
      )}

      {isRejected && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "10px 14px",
            borderRadius: 10,
            marginBottom: 12,
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          ❌ Asiakas valitsi toisen tarjouksen
        </div>
      )}

      {isWaiting && (
        <p
          style={{
            color: "#92400e",
            fontWeight: "bold",
            marginTop: 0,
          }}
        >
          🕒 Odottaa vastaustasi
        </p>
      )}

      {isOffered && (
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "10px 14px",
            borderRadius: 10,
            marginBottom: 12,
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          ✅ Tarjous lähetetty – odottaa asiakkaan päätöstä
        </div>
      )}
    </>
  );
}