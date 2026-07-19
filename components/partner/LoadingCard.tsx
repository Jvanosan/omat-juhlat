type LoadingCardProps = {
  count?: number;
};

export default function LoadingCard({
  count = 1,
}: LoadingCardProps) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="h-4 w-32 rounded bg-zinc-800" />
              <div className="mt-4 h-8 w-20 rounded bg-zinc-800" />
            </div>

            <div className="h-11 w-11 rounded-2xl bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}