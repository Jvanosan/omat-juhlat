import OfferForm from "./OfferForm";
import OfferSummary from "./OfferSummary";
import QuoteStatus from "./QuoteStatus";

type QuoteCardProps = {
  item: any;
  price: string;
  message: string;
  onPriceChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmitOffer: () => void;
  onCancelOffer: () => void;
};

export default function QuoteCard({
  item,
  price,
  message,
  onPriceChange,
  onMessageChange,
  onSubmitOffer,
  onCancelOffer,
}: QuoteCardProps) {
  const canSendOffer =
    !item.offer_price && item.status === "sent";

  return (
    <article
      style={{
        background: "white",
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <QuoteStatus item={item} />

      <h3
        style={{
          marginBottom: 10,
          fontSize: 22,
          fontWeight: 700,
          wordBreak: "break-word",
          color: "#111827",
          lineHeight: 1.4,
        }}
      >
        📦 Palvelu: {item.service || "Ei määritelty"}
      </h3>

      <div
        style={{
          color: "#111827",
          fontSize: 17,
          fontWeight: 500,
          lineHeight: 1.8,
        }}
      >
        <div>
          📅 {item.quote?.date || "Päivämäärä puuttuu"}
        </div>

        <div>
          📍 {item.quote?.location || "Paikkakunta puuttuu"}
        </div>

        <div>
          👥 {item.quote?.guests || 0} vierasta
        </div>
      </div>

      {item.quote?.extraInfo && (
        <div
          style={{
            marginTop: 12,
            padding: 14,
            background: "#f9fafb",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            color: "#111827",
            lineHeight: 1.7,
          }}
        >
          <strong
            style={{
              color: "#111827",
              fontSize: 16,
            }}
          >
            Lisätiedot:
          </strong>

          <br />

          {item.quote.extraInfo}
        </div>
      )}

      {canSendOffer ? (
        <OfferForm
          price={price}
          message={message}
          onPriceChange={onPriceChange}
          onMessageChange={onMessageChange}
          onSubmit={onSubmitOffer}
        />
      ) : (
        <OfferSummary
          item={item}
          onCancel={onCancelOffer}
        />
      )}
    </article>
  );
}