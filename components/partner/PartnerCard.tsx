import type { ReactNode } from "react";

type PartnerCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
};

export default function PartnerCard({
  children,
  className = "",
  as = "div",
}: PartnerCardProps) {
  const Component = as;

  return (
    <Component
      className={`rounded-3xl border border-[#e8ded0] bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </Component>
  );
}