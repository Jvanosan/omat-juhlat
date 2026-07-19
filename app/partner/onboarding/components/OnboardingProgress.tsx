"use client";

type OnboardingProgressProps = {
  currentStep: number;
  steps: string[];
};

export default function OnboardingProgress({
  currentStep,
  steps,
}: OnboardingProgressProps) {
  const progressPercentage =
    steps.length > 1
      ? ((currentStep - 1) / (steps.length - 1)) * 100
      : 100;

  return (
    <section
      aria-label="Profiilin täyttämisen eteneminen"
      style={{
        width: "100%",
        marginBottom: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 12,
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#6b6258",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Vaihe {currentStep}/{steps.length}
        </p>

        <p
          style={{
            margin: 0,
            color: "#2c241c",
            fontSize: 14,
            fontWeight: 600,
            textAlign: "right",
          }}
        >
          {steps[currentStep - 1]}
        </p>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: 8,
          overflow: "hidden",
          borderRadius: 999,
          backgroundColor: "#ebe5dc",
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: "100%",
            borderRadius: 999,
            background:
              "linear-gradient(90deg, #b8903e 0%, #d2af61 100%)",
            transition: "width 300ms ease",
          }}
        />
      </div>

      <ol
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
          gap: 8,
          margin: "14px 0 0",
          padding: 0,
          listStyle: "none",
        }}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <li
              key={step}
              aria-current={isActive ? "step" : undefined}
              style={{
                minWidth: 0,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    width: 30,
                    height: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    border: isActive
                      ? "2px solid #b8903e"
                      : "1px solid #d8d0c4",
                    backgroundColor:
                      isCompleted || isActive ? "#fff8e8" : "#ffffff",
                    color:
                      isCompleted || isActive ? "#8b681f" : "#8b8379",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {isCompleted ? "✓" : stepNumber}
                </span>
              </div>

              <span
                style={{
                  display: "block",
                  overflow: "hidden",
                  color: isActive ? "#2c241c" : "#777067",
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  lineHeight: 1.35,
                  textOverflow: "ellipsis",
                }}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}