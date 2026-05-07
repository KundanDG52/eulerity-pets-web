import { useState, useEffect } from "react";
import type { Pet } from "../types";

interface UsePetsReturn {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  refetch: () => void;
}

const API_URL = "https://eulerity-hackathon.appspot.com/pets";

/**
 * Custom hook that fetches the list of pets from the Eulerity API.
 * Explicitly handles loading, error, and empty states.
 */
export function usePets(): UsePetsReturn {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchPets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const data: Pet[] = await response.json();

        if (!cancelled) {
          setPets(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "An unexpected error occurred."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPets();

    // Cleanup: ignore stale responses if component unmounts or refetch is triggered
    return () => {
      cancelled = true;
    };
  }, [fetchCount]);

  /** Trigger a re-fetch manually */
  const refetch = () => setFetchCount((c) => c + 1);

  return {
    pets,
    loading,
    error,
    isEmpty: !loading && !error && pets.length === 0,
    refetch,
  };
}
