import type { ReactNode } from "react";
import PartnerHeader from "@/components/partner/PartnerHeader";
import PartnerSidebar from "@/components/partner/PartnerSidebar";

type PartnerLayoutProps = {
  children: ReactNode;
};

export default function PartnerLayout({
  children,
}: PartnerLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <PartnerSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <PartnerHeader />

          <main className="flex-1 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}