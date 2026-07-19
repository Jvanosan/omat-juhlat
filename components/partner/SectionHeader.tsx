type SectionHeaderProps = {
  title: string;
  description?: string;
};

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>

      {description && (
        <p className="mt-1 text-sm text-zinc-500">
          {description}
        </p>
      )}
    </div>
  );
}