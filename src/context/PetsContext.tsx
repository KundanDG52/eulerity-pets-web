import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import type { Pet, SortOption } from "../types";
import { usePets } from "../hooks/usePets";

interface PetsContextValue {
  // Data
  pets: Pet[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  refetch: () => void;

  // Search & Sort
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortOption: SortOption;
  setSortOption: (opt: SortOption) => void;
  filteredPets: Pet[];

  // Selection (persists across route changes)
  selectedUrls: Set<string>;
  toggleSelect: (url: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isSelected: (url: string) => boolean;
  selectedCount: number;

  // Pagination
  currentPage: number;
  setCurrentPage: (p: number) => void;
  petsPerPage: number;
  totalPages: number;
  paginatedPets: Pet[];
}

const PetsContext = createContext<PetsContextValue | null>(null);

/** Sorts a list of pets according to the chosen option */
function sortPets(pets: Pet[], option: SortOption): Pet[] {
  const sorted = [...pets];
  switch (option) {
    case "name-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "date-newest":
      return sorted.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );
    case "date-oldest":
      return sorted.sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      );
    default:
      return sorted;
  }
}

const PETS_PER_PAGE = 8;

export function PetsProvider({ children }: { children: ReactNode }) {
  const { pets, loading, error, isEmpty, refetch } = usePets();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date-newest");
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  /** Derived: filtered + sorted pets */
  const filteredPets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = q
      ? pets.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        )
      : pets;
    return sortPets(filtered, sortOption);
  }, [pets, searchQuery, sortOption]);

  // Reset to page 1 when filter/sort changes
  const totalPages = Math.max(1, Math.ceil(filteredPets.length / PETS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedPets = useMemo(() => {
    const start = (safePage - 1) * PETS_PER_PAGE;
    return filteredPets.slice(start, start + PETS_PER_PAGE);
  }, [filteredPets, safePage]);

  const toggleSelect = useCallback((url: string) => {
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      next.has(url) ? next.delete(url) : next.add(url);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    // Select all currently *filtered* pets so "select all" respects search
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      filteredPets.forEach((p) => next.add(p.url));
      return next;
    });
  }, [filteredPets]);

  const clearSelection = useCallback(() => {
    setSelectedUrls(new Set());
  }, []);

  const isSelected = useCallback(
    (url: string) => selectedUrls.has(url),
    [selectedUrls]
  );

  const handleSetSearchQuery = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, []);

  const handleSetSortOption = useCallback((opt: SortOption) => {
    setSortOption(opt);
    setCurrentPage(1);
  }, []);

  const value: PetsContextValue = {
    pets,
    loading,
    error,
    isEmpty,
    refetch,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    sortOption,
    setSortOption: handleSetSortOption,
    filteredPets,
    selectedUrls,
    toggleSelect,
    selectAll,
    clearSelection,
    isSelected,
    selectedCount: selectedUrls.size,
    currentPage: safePage,
    setCurrentPage,
    petsPerPage: PETS_PER_PAGE,
    totalPages,
    paginatedPets,
  };

  return <PetsContext.Provider value={value}>{children}</PetsContext.Provider>;
}

/** Hook to consume the PetsContext — throws if used outside provider */
export function usePetsContext(): PetsContextValue {
  const ctx = useContext(PetsContext);
  if (!ctx) {
    throw new Error("usePetsContext must be used within a PetsProvider");
  }
  return ctx;
}
