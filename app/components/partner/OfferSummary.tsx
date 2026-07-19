type OfferSummaryProps = {
  item: any;
  onCancel: () => void;
};

export default function OfferSummary({
  item,
  onCancel,
}: OfferSummaryProps) {
  if (!item.offer_price) {
    return null;
  }

  return (
    <div
      style={{
        background: "#ecfdf5",
        padding: 16,
        borderRadius: 12,
        color: "#111827",
        marginTop: 12,
        border: "1px solid #a7f3d0",
        lineHeight: 1.7,
      }}
    >
      <p style={{ marginTop: 0 }}>
        <strong>Lähettämäsi tarjous:</strong>
      </p>

      <p>💰 {item.offer_price} €</p>

      {item.offer_message && (
        <p>💬 {item.offer_message}</p>
      )}

      {item.status === "offered" && (
        <button
          type="button"
          onClick={onCancel}
          style={{
            marginTop: 8,
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ❌ Peru tarjous
        </button>
      )}
    </div>
  );
}