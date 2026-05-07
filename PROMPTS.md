# PROMPTS.md — AI Tool Usage Log

This file is a complete log of every prompt sent to AI tools during the development
of this project, as required by the Eulerity submission guidelines.

**Tool used:** Claude by Anthropic — claude.ai
**Model:** Claude Sonnet 4.6

---

## Prompt 1 — Project Kickoff

> Eulerity Take-Home Challenge [...] The task is to build out a front-end accomplishing
> the following using React and Typescript [full challenge requirements pasted]

**Purpose:** Scaffold the entire project structure from the challenge brief.

**What was generated:**

- `src/types/index.ts` — `Pet` interface and `SortOption` union type
- `src/hooks/usePets.ts` — custom data-fetching hook with loading/error/empty states
- `src/context/PetsContext.tsx` — global state with search, sort, selection, pagination
- `src/utils/index.ts` — helper functions (formatDate, download, getPetId etc.)
- `src/styles/GlobalStyles.ts` — theme object and global CSS reset
- All 6 components: `Navbar`, `SearchBar`, `SortControls`, `SelectionBar`, `PetCard`, `Pagination`

---

## Prompt 2 — Project Structure Overview

> could also provide the component structure for this code and how to start the
> project and the dependencies that would be required in the project

**Purpose:** Get a clear picture of the folder tree, required packages, and startup commands.

**What was generated:**

- Visual folder tree of the full project structure
- Dependency table with version numbers and reasons (`react-router-dom`, `styled-components`, etc.)
- Step-by-step commands: `npm create vite`, `npm install`, `npm run dev`, `npm run build`
- Note about the babel plugin for styled-components in `vite.config.ts` (later corrected — not needed)

---

## Prompt 3 — Check Current File State

> current folder file structure

**Purpose:** Verify which files had been created and what was still missing before continuing.

**What was identified as missing:**

- `src/pages/GalleryPage.tsx`
- `src/pages/PetDetailPage.tsx`
- `src/pages/AboutPage.tsx`
- `src/App.tsx` (had been deleted during project cleanup)

---

## Prompt 4 — Fix TypeScript Errors (Screenshot)

> [Screenshot of VS Code showing 9 errors across vite.config.ts and GlobalStyles.ts]

**Errors shown:**

- `vite.config.ts` — `'babel' does not exist in type 'Options'`
- `GlobalStyles.ts` — `Property 'colors' does not exist on type 'DefaultTheme'` (×4)
- `GlobalStyles.ts` — `Property 'fonts' does not exist on type 'DefaultTheme'` (×2)

**What was diagnosed and fixed:**

1. **`vite.config.ts`** — The `babel` config block was unnecessary for this version of `@vitejs/plugin-react`. Removed it entirely; default `react()` works fine.
2. **`styled.d.ts` created** — styled-components ships with an empty `DefaultTheme` interface. The fix was creating `src/styled.d.ts` to extend it with our custom `Theme` type, making `theme.colors.x` valid everywhere.

---

## Prompt 5 — Generate Remaining Files + Apply All Fixes

> yes and also all the other files from earlier with the fix of the above error

**Purpose:** Complete the project by generating all missing pages and `App.tsx`, while applying all TypeScript fixes discovered in Prompt 4.

**What was generated:**

- `src/App.tsx` — root component with `ThemeProvider`, `BrowserRouter`, `PetsProvider`, all routes
- `src/pages/GalleryPage.tsx` — full gallery with toolbar, 4 UI states, skeleton loaders, responsive grid
- `src/pages/PetDetailPage.tsx` — `/pets/:id` detail view with sticky image, metadata, download/select
- `src/pages/AboutPage.tsx` — `/about` static page with features and tech stack

**Fixes applied across existing files:**

- Changed all value imports to `import type { X }` (TS2305/TS1484 strict mode errors)
- Removed unused `React` default import from `PetsContext.tsx` (modern JSX transform)
- Removed stale `import './index.css'` from `main.tsx`

**Verification:** `tsc --noEmit` and `npm run build` both confirmed zero errors, clean 294 KB bundle.

---

## Prompt 6 — Code Explanation + PROMPT.md

> explain what's happening in the code and also PROMPT.md file

**Purpose:** Get a detailed walkthrough of every file for understanding, and create project documentation.

**What was generated:**

- File-by-file explanation covering every architectural decision
- `PROMPT.md` documenting the project (later superseded by this `PROMPTS.md` file)

---

## Prompt 7 — Bug Report: "Pet not found" on Detail Page

> [Screenshot showing "Pet not found" screen when clicking "View →" on any pet card]

**Purpose:** Debug why the detail page was always showing the not-found state.

**Root cause diagnosed:**

```
PetCard:        getPetId(pet) → encodeURIComponent(url) → "https%3A%2F%2F..."
                <Link to={`/pets/${petId}`}>

React Router:   useParams() auto-decodes route params
                id = "https://..."   ← already decoded!

PetDetailPage:  getPetFromId checks encodeURIComponent(p.url) === id
                "https%3A%2F%2F..."  ===  "https://..."  → FALSE → "Pet not found"
```

**Fix applied in `src/utils/index.ts`:**
Replaced `encodeURIComponent` with base64 encoding using `btoa()` with URL-safe character substitutions. React Router does not interfere with base64 strings, so the ID arrives in `useParams` exactly as it was encoded.

```ts
// Before (broken)
export function getPetId(pet: Pet): string {
  return encodeURIComponent(pet.url);
}
export function getPetFromId(pets: Pet[], id: string): Pet | undefined {
  return pets.find((p) => encodeURIComponent(p.url) === id);
}

// After (fixed)
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
```

---

## Prompt 8 — Final Documentation

> provide 1. readme.md file which explains what each code file does 2. PROMPTS.md
> file 3. Bugs.md for bugs found during development

**Purpose:** Generate submission-ready documentation files from the actual uploaded project zip.

**What was generated:**

- `README.md` — complete file-by-file documentation, architecture decisions, requirements checklist
- `PROMPTS.md` — this file, the full AI tool interaction log
- `BUGS.md` — detailed log of every bug encountered, root cause, and fix applied

---

## Honest Reflection

Claude was used as a **development accelerator** throughout this project. All key architectural decisions — placing `PetsProvider` above `<Routes>`, using `Set<string>` for O(1) selection lookup, the cancellation flag pattern in `usePets`, and the base64 ID encoding — were reviewed, understood, and verified before inclusion. Every bug that surfaced in VS Code was debugged interactively rather than blindly accepted. The final build was confirmed with `tsc --noEmit` and `npm run build` showing zero errors.
