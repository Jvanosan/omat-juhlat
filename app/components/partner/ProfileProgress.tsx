type ProfileProgressProps = {
  currentStep: number;
  totalSteps?: number;
};

const steps = [
  "Perustiedot",
  "Sijainti",
  "Palvelut",
  "Kuvat",
  "Lisätiedot",
  "Esikatselu",
];

export default function ProfileProgress({
  currentStep,
  totalSteps = steps.length,
}: ProfileProgressProps) {
  const safeStep = Math.min(Math.max(currentStep, 1), totalSteps);
  const progress = (safeStep / totalSteps) * 100;

  return (
    <section
      style={{
        marginBottom: 28,
        padding: 20,
        borderRadius: 18,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              color: "#111827",
              fontSize: 16,
              fontWeight: 800,
            }}
          >
            Profiilin eteneminen
          </div>

          <div
            style={{
              marginTop: 4,
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            Vaihe {safeStep} / {totalSteps}:{" "}
            {steps[safeStep - 1] || "Valmis"}
          </div>
        </div>

        <div
          style={{
            color: "#374151",
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          {Math.round(progress)} %
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: 10,
          borderRadius: 999,
          background: "#e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #111827, #d4af37)",
            transition: "width 0.25s ease",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 10,
          marginTop: 18,
        }}
      >
        {steps.slice(0, totalSteps).map((step, index) => {
          const stepNumber = index + 1;
          const completed = stepNumber < safeStep;
          const active = stepNumber === safeStep;

          return (
            <div
              key={step}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: active
                  ? "1px solid #d4af37"
                  : "1px solid #e5e7eb",
                background: completed
                  ? "#f3f4f6"
                  : active
                    ? "#fffbeb"
                    : "#ffffff",
                color: active ? "#92400e" : "#4b5563",
                fontSize: 13,
                fontWeight: active || completed ? 800 : 600,
                textAlign: "center",
              }}
            >
              {completed ? "✓ " : `${stepNumber}. `}
              {step}
            </div>
          );
        })}
      </div>
    </section>
  );
}