import { useState, useMemo } from "react";

interface UseTableControlsOptions<T> {
  data: T[];
  searchFields: (row: T) => string[];
  filterValue?: (row: T) => string;
  filterValue2?: (row: T) => string;
  pageSize?: number;
}

export function useTableControls<T>({
  data,
  searchFields,
  filterValue,
  filterValue2,
  pageSize = 10,
}: UseTableControlsOptions<T>) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [filter2, setFilter2] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = data;

    if (filter !== "all" && filterValue) {
      result = result.filter((row) => filterValue(row) === filter);
    }

    if (filter2 !== "all" && filterValue2) {
      result = result.filter((row) => filterValue2(row) === filter2);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((row) =>
        searchFields(row).some((field) => field?.toLowerCase().includes(q)),
      );
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, search, filter, filter2]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const paged = filtered.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateFilter(value: string) {
    setFilter(value);
    setPage(1);
  }

  function updateFilter2(value: string) {
    setFilter2(value);
    setPage(1);
  }

  return {
    search,
    setSearch: updateSearch,
    filter,
    setFilter: updateFilter,
    filter2,
    setFilter2: updateFilter2,
    page,
    setPage,
    totalPages,
    filtered,
    paged,
  };
}
