import { useState, useMemo, type ReactNode } from "react";

export interface DataGridColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  exportValue?: (row: T) => string | number;
}

interface FilterOption {
  label: string;
  value: string;
}

interface BulkAction<T> {
  label: string;
  onClick: (selected: T[]) => void;
  danger?: boolean;
}

interface DataGridProps<T> {
  columns: DataGridColumn<T>[];
  data: T[];
  searchFields: (row: T) => string;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  rowKey: (row: T) => string | number;
  exportFilename?: string;
  filterOptions?: FilterOption[];
  filterValue?: (row: T) => string;
  bulkActions?: BulkAction<T>[];
  onRefresh?: () => void;
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function DataGrid<T>({
  columns,
  data,
  searchFields,
  pageSize = 10,
  loading = false,
  emptyMessage = "No results.",
  rowKey,
  exportFilename = "export.csv",
  filterOptions,
  filterValue,
  bulkActions,
  onRefresh,
}: DataGridProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [visibleCols, setVisibleCols] = useState<Set<string>>(new Set(columns.map((c) => c.key)));
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const filtered = useMemo(() => {
    let rows = data;
    if (filter !== "all" && filterValue) {
      rows = rows.filter((row) => filterValue(row) === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((row) => searchFields(row).toLowerCase().includes(q));
    }
    return rows;
  }, [data, search, filter, filterValue, searchFields]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeColumns = columns.filter((c) => visibleCols.has(c.key));

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleColumn(key: string) {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleRowSelected(key: string | number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === pageData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pageData.map(rowKey)));
    }
  }

  function handleExport() {
    const headers = activeColumns.map((c) => c.header || c.key);
    const rows = sorted.map((row) =>
      activeColumns.map((c) => {
        const val = c.exportValue ? c.exportValue(row) : c.sortValue ? c.sortValue(row) : "";
        return String(val);
      }),
    );
    downloadCsv(exportFilename, [headers, ...rows]);
  }

  const selectedRows = data.filter((row) => selected.has(rowKey(row)));

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="min-w-[180px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-signal focus:outline-none dark:border-slate-600 dark:bg-slate-800"
        />

        {filterOptions && filterOptions.length > 0 && (
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          >
            <option value="all">All statuses</option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        <div className="relative">
          <button
            onClick={() => setColumnsOpen((o) => !o)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
          >
            Columns
          </button>
          {columnsOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {columns.map((c) => (
                <label
                  key={c.key}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <input
                    type="checkbox"
                    checked={visibleCols.has(c.key)}
                    onChange={() => toggleColumn(c.key)}
                  />
                  {c.header || c.key}
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleExport}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
        >
          Export
        </button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-signal hover:text-signal dark:border-slate-600 dark:text-slate-300"
          >
            Refresh
          </button>
        )}

        <span className="ml-auto whitespace-nowrap text-xs text-slate-400">
          {sorted.length} result{sorted.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Bulk actions bar — only shows when rows are selected */}
      {bulkActions && bulkActions.length > 0 && selected.size > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-signal/30 bg-signal/5 px-3 py-2 text-xs">
          <span className="font-semibold text-signal">{selected.size} selected</span>
          {bulkActions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                action.onClick(selectedRows);
                setSelected(new Set());
              }}
              className={`rounded-lg border px-3 py-1.5 font-semibold ${
                action.danger
                  ? "border-red-200 text-red-500 hover:bg-red-50"
                  : "border-slate-300 text-slate-600 hover:border-signal hover:text-signal"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800">
            <tr>
              {bulkActions && bulkActions.length > 0 && (
                <th className="w-8 px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={pageData.length > 0 && selected.size === pageData.length}
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              {activeColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortValue && toggleSort(col.key)}
                  className={`px-4 py-2.5 text-xs font-semibold text-slate-500 ${
                    col.sortValue ? "cursor-pointer select-none hover:text-signal" : ""
                  }`}
                >
                  {col.header}
                  {sortKey === col.key && (sortDir === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                  {bulkActions && bulkActions.length > 0 && <td className="px-4 py-3" />}
                  {activeColumns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={activeColumns.length + (bulkActions ? 1 : 0)}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageData.map((row) => {
                const key = rowKey(row);
                return (
                  <tr
                    key={key}
                    className="border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    {bulkActions && bulkActions.length > 0 && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(key)}
                          onChange={() => toggleRowSelected(key)}
                        />
                      </td>
                    )}
                    {activeColumns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-600 hover:border-signal hover:text-signal disabled:opacity-40 dark:border-slate-600 dark:text-slate-300"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-600 hover:border-signal hover:text-signal disabled:opacity-40 dark:border-slate-600 dark:text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
