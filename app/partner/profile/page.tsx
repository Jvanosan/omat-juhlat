import Link from "next/link";

import ProfileEditor from "@/components/partner/profile/ProfileEditor";
import SectionHeader from "@/components/partner/SectionHeader";

export default function PartnerProfilePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        eyebrow="Yritysprofiili"
        title="Muokkaa yrityksesi tietoja"
        description="Pidä yhteystiedot, toiminta-alueet, palvelut, kuvat ja hinnat ajan tasalla. Kattava profiili auttaa asiakkaita valitsemaan yrityksesi."
        action={
          <Link
            href="/partner/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#d8c7ad] bg-white px-4 py-2 text-sm font-bold text-[#795a28] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b48a45]"
          >
            ← Takaisin dashboardiin
          </Link>
        }
      />

      <ProfileEditor />
    </div>
  );
}