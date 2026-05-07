import type { Pet } from "../types";

/**
 * Estimates file size of a URL by using a rough heuristic.
 * A real implementation would use a HEAD request to get Content-Length.
 * We approximate: pet images average around 150KB each.
 */
export const ESTIMATED_SIZE_PER_IMAGE_KB = 150;

export function formatFileSize(totalKB: number): string {
  if (totalKB < 1024) return `~${totalKB} KB`;
  return `~${(totalKB / 1024).toFixed(1)} MB`;
}

/**
 * Downloads a set of images by opening each in a new tab.
 * A proper multi-file download requires a backend or JSZip.
 * This is a client-only friendly fallback.
 */
export async function downloadSelectedPets(
  pets: Pet[],
  selectedUrls: Set<string>,
): Promise<void> {
  const selected = pets.filter((p) => selectedUrls.has(p.url));

  for (const pet of selected) {
    try {
      // Fetch the image and trigger a real download via blob URL
      const response = await fetch(pet.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      // Derive a filename from the title or the URL path
      const ext = pet.url.split(".").pop()?.split("?")[0] ?? "jpg";
      a.download = `${pet.title.replace(/\s+/g, "-").toLowerCase()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      // Slight delay so browsers don't throttle multiple downloads
      await new Promise((r) => setTimeout(r, 400));
    } catch {
      console.error(`Failed to download: ${pet.url}`);
    }
  }
}

// /** Returns a URL-safe unique key for a pet (uses URL since no ID field) */
// export function getPetId(pet: Pet): string {
//   return encodeURIComponent(pet.url);
// }

// /** Reverse of getPetId */
// export function getPetFromId(pets: Pet[], id: string): Pet | undefined {
//   return pets.find((p) => encodeURIComponent(p.url) === id);
// }
export function getPetId(pet: Pet): string {
  return btoa(pet.url)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function getPetFromId(pets: Pet[], id: string): Pet | undefined {
  try {
    const url = atob(id.replace(/-/g, "+").replace(/_/g, "/"));
    return pets.find((p) => p.url === url);
  } catch {
    return undefined;
  }
}

/** Formats an ISO date string into a friendly display format */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
