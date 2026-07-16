import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export default function Textarea({
  label,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <textarea
        id={id}
        className={[
          "min-h-32 w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3",
          "outline-none transition duration-200",
          "focus:border-[#C8A96A] focus:ring-2 focus:ring-[#C8A96A]/20",
          "placeholder:text-gray-400",
          error ? "border-red-500" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}