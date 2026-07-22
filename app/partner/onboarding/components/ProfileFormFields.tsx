import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  helpText?: string;
};

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  min,
  max,
  inputMode,
  helpText,
}: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#3f362f]">
        {label}

        {required && (
          <span className="ml-1 text-[#a33d3d]">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        min={min}
        max={max}
        inputMode={inputMode}
        required={required}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="min-h-13 w-full rounded-2xl border border-[#ded3c4] bg-white px-4 py-3 text-[#211b16] outline-none transition placeholder:text-[#aaa096] focus:border-[#b48a45] focus:ring-4 focus:ring-[#ead8b8]/35"
      />

      {helpText && (
        <span className="mt-2 block text-xs leading-5 text-[#70675e]">
          {helpText}
        </span>
      )}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  required?: boolean;
  emptyLabel?: string;
  helpText?: string;
};

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  emptyLabel = "Ei ilmoitettu",
  helpText,
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#3f362f]">
        {label}

        {required && (
          <span className="ml-1 text-[#a33d3d]">
            *
          </span>
        )}
      </span>

      <select
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="min-h-13 w-full rounded-2xl border border-[#ded3c4] bg-white px-4 py-3 text-[#211b16] outline-none transition focus:border-[#b48a45] focus:ring-4 focus:ring-[#ead8b8]/35"
      >
        <option value="">
          {emptyLabel}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {helpText && (
        <span className="mt-2 block text-xs leading-5 text-[#70675e]">
          {helpText}
        </span>
      )}
    </label>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  helpText?: string;
};

export function TextAreaField({
  label,
  value,
  onChange,
  rows,
  placeholder,
  required,
  maxLength,
  helpText,
}: TextAreaFieldProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-[#3f362f]">
          {label}

          {required && (
            <span className="ml-1 text-[#a33d3d]">
              *
            </span>
          )}
        </span>

        {maxLength && (
          <span className="text-xs text-[#91877d]">
            {value.length} / {maxLength}
          </span>
        )}
      </div>

      <textarea
        value={value}
        rows={rows}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-y rounded-2xl border border-[#ded3c4] bg-white px-4 py-3 text-[#211b16] outline-none transition placeholder:text-[#aaa096] focus:border-[#b48a45] focus:ring-4 focus:ring-[#ead8b8]/35"
      />

      {helpText && (
        <span className="mt-2 block text-xs leading-5 text-[#70675e]">
          {helpText}
        </span>
      )}
    </label>
  );
}

type BooleanFieldProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (
    checked: boolean,
  ) => void;
};

export function BooleanField({
  label,
  description,
  checked,
  onChange,
}: BooleanFieldProps) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
        checked
          ? "border-[#b9dfd0] bg-[#edf8f3]"
          : "border-[#ded3c4] bg-[#fffdf9] hover:border-[#b48a45]"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked,
          )
        }
        className="mt-1 h-5 w-5 accent-[#168365]"
      />

      <span>
        <span
          className={`block font-bold ${
            checked
              ? "text-[#11634d]"
              : "text-[#3f362f]"
          }`}
        >
          {label}
        </span>

        <span className="mt-1 block text-sm leading-5 text-[#70675e]">
          {description}
        </span>
      </span>
    </label>
  );
}

type FormSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section>
      <div className="mb-5">
        <h3 className="text-xl font-bold text-[#211b16]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-[#70675e]">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}