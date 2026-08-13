"use client";

import { useEffect, useState } from "react";

const MEASUREMENT_ID = "G-S142DXTJ4E";
const CONSENT_KEY = "omatjuhlat-analytics-consent";

type ConsentChoice = "granted" | "denied" | null;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    omatJuhlatAnalyticsLoaded?: boolean;
  }
}

function loadGoogleAnalytics() {
  if (
    typeof window === "undefined" ||
    window.omatJuhlatAnalyticsLoaded
  ) {
    return;
  }

  window.omatJuhlatAnalyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];

  window.gtag = function gtag(..._args: unknown[]) {
  window.dataLayer.push(arguments);
};

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;

  document.head.appendChild(script);
}

export default function GoogleAnalyticsConsent() {
  const [consent, setConsent] = useState<ConsentChoice>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const savedConsent =
      localStorage.getItem(CONSENT_KEY) as ConsentChoice;

    if (savedConsent === "granted") {
      setConsent("granted");
      loadGoogleAnalytics();
      return;
    }

    if (savedConsent === "denied") {
      setConsent("denied");
      return;
    }

    setShowBanner(true);
  }, []);

  function allowAnalytics() {
    localStorage.setItem(CONSENT_KEY, "granted");
    setConsent("granted");
    setShowBanner(false);
    loadGoogleAnalytics();
  }

  function rejectAnalytics() {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }

  localStorage.setItem(CONSENT_KEY, "denied");
  setConsent("denied");
  setShowBanner(false);
}

  function reopenSettings() {
    setShowBanner(true);
  }

  return (
    <>
      {showBanner && (
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Evästeasetukset"
          style={{
            position: "fixed",
            right: "20px",
            bottom: "20px",
            zIndex: 9999,
            width: "min(440px, calc(100% - 40px))",
            padding: "24px",
            border: "1px solid #d7c6a6",
            borderRadius: "18px",
            background: "#fffdf8",
            color: "#2f261d",
            boxShadow: "0 15px 45px rgba(47, 38, 29, 0.22)",
          }}
        >
          <h2 style={{ margin: "0 0 10px", fontSize: "22px" }}>
            Evästeasetukset
          </h2>

          <p style={{ margin: "0 0 18px", lineHeight: 1.6 }}>
            Käytämme välttämättömien evästeiden lisäksi Google
            Analyticsia ymmärtääksemme, miten sivustoa käytetään.
            Analytiikka käynnistyy vain suostumuksellasi.{" "}
            <a
              href="/tietosuoja"
              style={{ color: "#8a5a16", textDecoration: "underline" }}
            >
              Lue tietosuojasta
            </a>
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={allowAnalytics}
              style={{
                cursor: "pointer",
                border: "1px solid #a66c13",
                borderRadius: "999px",
                padding: "11px 18px",
                background: "#a66c13",
                color: "white",
                fontWeight: 700,
              }}
            >
              Salli analytiikka
            </button>

            <button
              type="button"
              onClick={rejectAnalytics}
              style={{
                cursor: "pointer",
                border: "1px solid #8f806d",
                borderRadius: "999px",
                padding: "11px 18px",
                background: "transparent",
                color: "#2f261d",
                fontWeight: 700,
              }}
            >
              Vain välttämättömät
            </button>
          </div>
        </section>
      )}

      {!showBanner && consent !== null && (
        <button
          type="button"
          onClick={reopenSettings}
          style={{
            position: "fixed",
            left: "12px",
            bottom: "12px",
            zIndex: 9998,
            cursor: "pointer",
            border: "1px solid #d7c6a6",
            borderRadius: "999px",
            padding: "8px 12px",
            background: "#fffdf8",
            color: "#5b4630",
            fontSize: "12px",
            boxShadow: "0 4px 14px rgba(47, 38, 29, 0.14)",
          }}
        >
          Evästeasetukset
        </button>
      )}
    </>
  );
}