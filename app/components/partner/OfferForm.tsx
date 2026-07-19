type OfferFormProps = {
  price: string;
  message: string;
  onPriceChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
};

export default function OfferForm({
  price,
  message,
  onPriceChange,
  onMessageChange,
  onSubmit,
}: OfferFormProps) {
  return (
    <div style={{ marginTop: 18 }}>
      <input
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        placeholder="Hinta (€)"
        value={price}
        onChange={(event) =>
          onPriceChange(event.target.value)
        }
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 8,
          borderRadius: 10,
          border: "1px solid #d1d5db",
          fontSize: 16,
          boxSizing: "border-box",
          color: "#111827",
          background: "#ffffff",
          WebkitTextFillColor: "#111827",
          caretColor: "#111827",
        }}
      />

      <textarea
        placeholder="Viesti asiakkaalle (valinnainen)"
        value={message}
        onChange={(event) =>
          onMessageChange(event.target.value)
        }
        maxLength={1000}
        rows={4}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
          borderRadius: 10,
          border: "1px solid #d1d5db",
          fontSize: 16,
          boxSizing: "border-box",
          color: "#111827",
          background: "#ffffff",
          WebkitTextFillColor: "#111827",
          caretColor: "#111827",
          resize: "vertical",
        }}
      />

      <button
        type="button"
        onClick={onSubmit}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 10,
          border: "none",
          background:
            "linear-gradient(90deg, #10b981, #34d399)",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        💰 Lähetä tarjous
      </button>
    </div>
  );
}