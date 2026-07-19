import EmptyState from "@/components/partner/EmptyState";
import SectionHeader from "@/components/partner/SectionHeader";

export default function PartnerCalendarPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        title="Kalenteri"
        description="Hallitse yrityksesi vapaita ja varattuja ajankohtia."
      />

      <EmptyState
        icon="📅"
        title="Kalenteri ei ole vielä käytössä"
        description="Tälle sivulle rakennetaan kalenteri, jossa voit merkitä vapaat ja varatut päivät."
      />
    </div>
  );
}