# 🐾 PawGallery — Eulerity Web Take-Home Challenge

A fully-featured pet image gallery built with **React**, **TypeScript**, and **styled-components**. Fetches live data from the Eulerity API and presents it in a polished, interactive, and fully responsive UI.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
# → Opens at http://localhost:5173

# 3. Build for production
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## 📁 Project Structure

```
eulerity-pets/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styled.d.ts
    │
    ├── types/
    │   └── index.ts
    ├── hooks/
    │   └── usePets.ts
    ├── context/
    │   └── PetsContext.tsx
    ├── utils/
    │   └── index.ts
    ├── styles/
    │   └── GlobalStyles.ts
    │
    ├── components/
    │   ├── Navbar.tsx
    │   ├── SearchBar.tsx
    │   ├── SortControls.tsx
    │   ├── SelectionBar.tsx
    │   ├── PetCard.tsx
    │   └── Pagination.tsx
    │
    └── pages/
        ├── GalleryPage.tsx
        ├── PetDetailPage.tsx
        └── AboutPage.tsx
```

---

## 📄 File-by-File Explanation

### `src/main.tsx`

The Vite entry point. Mounts the React application into the `<div id="root">` element in `index.html`. Wraps the app in React `StrictMode` to surface potential issues during development.

---

### `src/App.tsx`

The root component and structural backbone of the app. Sets up three nested providers in a deliberate order:

```
ThemeProvider            ← injects design tokens into all styled-components
  └── BrowserRouter      ← enables URL-based navigation
        └── PetsProvider ← global state: data, selection, search, sort, pagination
              ├── Navbar          ← visible on every page
              ├── Routes          ← swaps the active page based on URL
              │     ├── /             → GalleryPage
              │     ├── /pets/:id     → PetDetailPage
              │     ├── /about        → AboutPage
              │     └── *             → GalleryPage (catch-all)
              └── SelectionBar    ← floating bar, visible on every page
```

**Key decision:** `PetsProvider` sits _above_ `<Routes>` so the context is never destroyed during navigation — selections survive a round-trip to the detail view and back.

---

### `src/styled.d.ts`

A TypeScript declaration file that extends styled-components' built-in `DefaultTheme` with our custom `Theme` type from `GlobalStyles.ts`. Without this, TypeScript throws errors on every `theme.colors.x` access inside styled-component template literals.

---

### `src/types/index.ts`

Central TypeScript type definitions shared across the whole project:

- **`Pet`** — shape returned by the `/pets` API: `url`, `title`, `description`, `created`
- **`SortOption`** — union of 4 string literals (`"name-asc" | "name-desc" | "date-newest" | "date-oldest"`) keeping the sort dropdown fully type-safe

---

### `src/hooks/usePets.ts`

Custom React hook — the only place in the app that talks to the Eulerity API.

- Makes a `GET` request to `https://eulerity-hackathon.appspot.com/pets` using native `fetch`
- Returns `loading`, `error`, `isEmpty`, `pets`, and `refetch`
- Uses a **cancellation flag** (`let cancelled = false`) to prevent state updates on unmounted components
- `refetch()` works by incrementing a `fetchCount` counter that re-triggers `useEffect` — no external library needed
- Tracks three independent states so every UI scenario (loading, error, empty, data) is handled explicitly

---

### `src/context/PetsContext.tsx`

Global state manager using React Context API. Consumes `usePets` and builds all derived state on top.

| State          | Type          | Purpose                |
| -------------- | ------------- | ---------------------- |
| `pets`         | `Pet[]`       | Raw API response       |
| `searchQuery`  | `string`      | Live search input      |
| `sortOption`   | `SortOption`  | Active sort mode       |
| `selectedUrls` | `Set<string>` | URLs of selected pets  |
| `currentPage`  | `number`      | Active pagination page |

**Derived via `useMemo`:**

- `filteredPets` — filtered by search query then sorted; recomputes only when dependencies change
- `paginatedPets` — 8-item slice of `filteredPets` for the current page

**Performance decisions:**

- All mutation functions wrapped in `useCallback` for stable references
- `Set<string>` gives O(1) `.has()` / `.add()` / `.delete()` vs O(n) array `.includes()`
- Search and sort handlers also reset `currentPage` to 1 automatically
- `selectAll` only adds currently _filtered_ pets — respects the active search

---

### `src/utils/index.ts`

Pure, side-effect-free helper functions.

| Function                           | Purpose                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| `getPetId(pet)`                    | Base64-encodes a pet's image URL for use in route paths |
| `getPetFromId(pets, id)`           | Decodes a base64 route param and finds the matching pet |
| `formatDate(dateStr)`              | Converts ISO date to `"6 May 2026"`                     |
| `formatFileSize(kb)`               | Converts KB to `"~150 KB"` or `"~1.5 MB"`               |
| `downloadSelectedPets(pets, urls)` | Fetches images as Blobs and triggers browser downloads  |
| `ESTIMATED_SIZE_PER_IMAGE_KB`      | 150 KB constant for size estimation                     |

**Why base64 for IDs?** The API has no `id` field so we use the image URL as identifier. `encodeURIComponent` was broken because React Router auto-decodes `useParams()` values — the encoded and decoded strings never matched. Base64 with URL-safe substitutions (`+→-`, `/→_`, `=→removed`) is router-safe.

---

### `src/styles/GlobalStyles.ts`

Two exports establishing the entire visual foundation:

**`theme`** — all design tokens: colors, fonts (Playfair Display + DM Sans), border radii, and breakpoints.

**`GlobalStyles`** — `createGlobalStyle` component applying CSS reset, base typography, Google Fonts import, and a subtle SVG noise grain texture at 2.5% opacity via `body::before`.

---

### `src/components/Navbar.tsx`

Sticky top navigation, rendered on every page.

- `backdrop-filter: blur(12px)` for a frosted-glass effect while scrolling
- Highlights the active route link using `useLocation()`
- Shows a live selection count badge when images are selected; hides when count is 0

---

### `src/components/SearchBar.tsx`

Controlled input wired to `PetsContext`. Every keystroke triggers instant `filteredPets` recomputation via `useMemo`. Shows a clear (✕) button only when there is text. Filters across both `title` and `description`.

---

### `src/components/SortControls.tsx`

Styled native `<select>` with a custom SVG chevron replacing the OS default arrow. Four sort options: Date Newest, Date Oldest, Name A→Z, Name Z→A.

---

### `src/components/SelectionBar.tsx`

Floating action bar that slides up from the bottom when `selectedCount > 0`; returns `null` otherwise.

- Displays count and estimated file size (`count × 150 KB`)
- **Select All**, **Clear**, and **⬇ Download** actions
- Spring easing animation: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Download button disabled while downloading to prevent double-triggering

---

### `src/components/PetCard.tsx`

Core interactive gallery card.

- **Shimmer skeleton** overlaid until `onLoad` fires — zero layout shift
- **`loading="lazy"`** defers off-screen image requests
- Clicking the card toggles selection; the checkbox uses `e.stopPropagation()` to avoid double-firing
- "View →" link uses `e.stopPropagation()` so it doesn't also trigger selection
- Selected state shown via border colour change + accent ring shadow

---

### `src/components/Pagination.tsx`

Page controls below the grid. Returns `null` on single-page datasets. `getPageRange()` generates smart ellipsis patterns (e.g. `[1, …, 4, 5, 6, …, 20]`) — always shows page 1, page N, and the two neighbours of the current page.

---

### `src/pages/GalleryPage.tsx`

Main `/` route. Handles five UI states:

| State             | UI                                |
| ----------------- | --------------------------------- |
| Loading           | 8 animated shimmer skeleton cards |
| Error             | Error message + retry button      |
| Empty API         | "No pets found" message           |
| No search results | "No matches" message              |
| Normal            | Responsive pet grid + pagination  |

Grid breakpoints: 4 columns (desktop ≥1024px) → 2 columns (tablet) → 1 column (mobile ≤480px).

---

### `src/pages/PetDetailPage.tsx`

Dynamic `/pets/:id` route.

- Decodes the base64 route param to find the pet via `getPetFromId()`
- Shows skeleton while data loads, "not found" state if ID doesn't match
- Left panel: full-size image, sticky on desktop
- Right panel: title, description, metadata grid, Download + Select/Deselect buttons, back navigation

---

### `src/pages/AboutPage.tsx`

Static `/about` route — no API calls. Contains a project overview, 6 feature highlight cards, tech stack tags, and a CTA linking back to the gallery.

---

## ✅ Requirements Checklist

| #   | Requirement                                     | Implementation                                    |
| --- | ----------------------------------------------- | ------------------------------------------------- |
| 1   | Fetch and display pets from `/pets`             | `usePets` hook with native `fetch`                |
| 2   | Select images, show count + estimated file size | `SelectionBar`                                    |
| 3   | Select All / Clear Selection                    | Toolbar + SelectionBar buttons                    |
| 4   | Sort: Name A-Z, Z-A, Date Newest, Oldest        | `SortControls` dropdown                           |
| 5   | Search by title or description                  | `SearchBar` live filtering                        |
| 6   | styled-components for all UI                    | 100% styled-components, no external CSS           |
| 7   | react-router-dom: `/`, `/pets/:id`, `/about`    | `App.tsx` + `useParams`                           |
| 8   | Custom hook with loading/error/empty states     | `usePets.ts`                                      |
| 9   | Global state persisting across routes           | `PetsContext` above `<Routes>`                    |
| 10  | Pagination                                      | 8 per page, smart ellipsis, resets on filter/sort |
| 11  | Responsive: 1 / 2 / 4 columns                   | CSS Grid + 3 breakpoints                          |
| 12  | Code documentation                              | JSDoc comments throughout                         |

---

## 📦 Dependencies

| Package                | Purpose              |
| ---------------------- | -------------------- |
| `react` + `react-dom`  | UI framework         |
| `react-router-dom` v6  | Client-side routing  |
| `styled-components` v6 | All styling          |
| `typescript`           | Static typing        |
| `vite`                 | Dev server + bundler |

No Redux. No Axios. No extra state libraries.
