import {
  getMonthLabel,
} from "./calendarUtils";

type CalendarToolbarProps = {
  year: number;
  month: number;
  loading: boolean;

  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onCurrentMonth: () => void;
  onReload: () => void;
};

export default function CalendarToolbar({
  year,
  month,
  loading,
  onPreviousMonth,
  onNextMonth,
  onCurrentMonth,
  onReload,
}: CalendarToolbarProps) {
  return (
    <div className="border-b border-[#e8ded0] bg-[#fffdf9] p-4 sm:p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47c3c]">
            Kuukausinäkymä
          </p>

          <h2
            aria-live="polite"
            className="mt-1 text-2xl font-bold capitalize text-[#211b16] sm:text-3xl"
          >
            {getMonthLabel(
              year,
              month,
            )}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={
              onPreviousMonth
            }
            disabled={loading}
            aria-label="Näytä edellinen kuukausi"
            title="Edellinen kuukausi"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#ded3c4] bg-white text-lg font-bold text-[#62584f] shadow-sm transition hover:border-[#c8a96a] hover:bg-[#fffaf2] hover:text-[#87652f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ←
          </button>

          <button
            type="button"
            onClick={
              onCurrentMonth
            }
            disabled={loading}
            className="min-h-11 flex-1 whitespace-nowrap rounded-xl border border-[#decba9] bg-[#fbf5e9] px-4 py-2 text-sm font-bold text-[#87652f] transition hover:border-[#b48a45] hover:bg-[#f5ead8] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            Tämä kuukausi
          </button>

          <button
            type="button"
            onClick={onNextMonth}
            disabled={loading}
            aria-label="Näytä seuraava kuukausi"
            title="Seuraava kuukausi"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#ded3c4] bg-white text-lg font-bold text-[#62584f] shadow-sm transition hover:border-[#c8a96a] hover:bg-[#fffaf2] hover:text-[#87652f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            →
          </button>

          <button
            type="button"
            onClick={onReload}
            disabled={loading}
            aria-label="Päivitä kalenterin tiedot"
            title="Päivitä kalenteri"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#b9dfd0] bg-[#edf8f3] text-lg text-[#11634d] transition hover:bg-[#dff2ea] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              aria-hidden="true"
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            >
              ↻
            </span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#e8ded0] bg-white px-3 py-2 text-xs leading-5 text-[#70675e] sm:hidden">
        <span aria-hidden="true">
          👆
        </span>

        Napauta päivää avataksesi
        sen tiedot.
      </div>
    </div>
  );
}