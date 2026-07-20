interface ToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filter?: string;
  onFilterChange?: (v: string) => void;
  filterOptions?: { value: string; label: string }[];
  filterLabel?: string;
  filter2?: string;
  onFilter2Change?: (v: string) => void;
  filter2Options?: { value: string; label: string }[];
  filter2Label?: string;
  onExport: () => void;
  searchPlaceholder?: string;
}

export default function Toolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  filterOptions,
  filterLabel = "All statuses",
  filter2,
  onFilter2Change,
  filter2Options,
  filter2Label = "All plans",
  onExport,
  searchPlaceholder = "Search...",
}: ToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        className="min-w-[200px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-signal focus:outline-none dark:border-slate-600 dark:bg-slate-800"
      />

      {filterOptions && onFilterChange && (
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
        >
          <option value="all">{filterLabel}</option>
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {filter2Options && onFilter2Change && (
        <select
          value={filter2}
          onChange={(e) => onFilter2Change(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
        >
          <option value="all">{filter2Label}</option>
          {filter2Options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={onExport}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
      >
        Export CSV
      </button>
    </div>
  );
}
