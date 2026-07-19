import { ReactNode } from "react";

type PartnerGridProps = {
  children: ReactNode;
};

export default function PartnerGrid({
  children,
}: PartnerGridProps) {
  return (
    <div className="space-y-12">
      {children}
    </div>
  );
}