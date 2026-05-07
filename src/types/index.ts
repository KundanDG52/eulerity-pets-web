/** Represents a single pet returned from the /pets API */
export interface Pet {
  url: string;
  title: string;
  description: string;
  created: string;
}

/** Sort options available in the gallery */
export type SortOption =
  | "name-asc"
  | "name-desc"
  | "date-newest"
  | "date-oldest";
