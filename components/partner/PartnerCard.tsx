import type { ReactNode } from "react";

type PartnerCardProps = {
  children: ReactNode;
  className?: string;
};

export default function PartnerCard({
  children,
  className = "",
}: PartnerCardProps) {
  return (
    <div
      className={`rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}