import EmptyState from "@/components/partner/EmptyState";
import SectionHeader from "@/components/partner/SectionHeader";

export default function PartnerProfilePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        title="Yritysprofiili"
        description="Muokkaa yrityksesi tietoja, palveluita, kuvia ja hintatietoja."
      />

      <EmptyState
        icon="👤"
        title="Profiilin muokkaus rakennetaan seuraavaksi"
        description="Tälle sivulle tuodaan onboardingissa käytetty lomake, jotta partneri voi päivittää yritysprofiiliaan."
      />
    </div>
  );
}