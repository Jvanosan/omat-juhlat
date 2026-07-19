import EmptyState from "@/components/partner/EmptyState";
import SectionHeader from "@/components/partner/SectionHeader";

export default function PartnerSettingsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        title="Asetukset"
        description="Hallitse käyttäjätiliä, ilmoituksia ja yrityksen asetuksia."
      />

      <EmptyState
        icon="⚙️"
        title="Asetukset rakennetaan myöhemmin"
        description="Tälle sivulle lisätään esimerkiksi sähköposti-ilmoitukset, käyttäjätilin tiedot ja kirjautumisasetukset."
      />
    </div>
  );
}