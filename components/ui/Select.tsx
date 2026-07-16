import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export default function Select({
  label,
  error,
  className = "",
  id,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <select
        id={id}
        className={[
          "w-full rounded-xl border border-gray-300 bg-white px-4 py-3",
          "outline-none transition duration-200",
          "focus:border-[#C8A96A] focus:ring-2 focus:ring-[#C8A96A]/20",
          error ? "border-red-500" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </select>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}