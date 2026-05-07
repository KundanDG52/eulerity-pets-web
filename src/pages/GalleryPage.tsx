import React from "react";
import styled from "styled-components";

import { usePetsContext } from "../context/PetsContext";
import { SearchBar } from "../components/SearchBar";
import { SortControls } from "../components/SortControls";
import { PetCard } from "../components/PetCard";
import { Pagination } from "../components/Pagination";

/* ─── Layout ─── */

const Page = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 24px 16px 0;
  }
`;

const Hero = styled.div`
  margin-bottom: 36px;
`;

const HeroEyebrow = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 8px;
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

const HeroSub = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 520px;
`;

/* ─── Toolbar ─── */

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
`;

const ResultCount = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  white-space: nowrap;
`;

const QuickActionBtn = styled.button`
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentLight};
  }
`;

/* ─── Grid ─── */

/**
 * Responsive grid:
 * - 1 column  on mobile  (< 480px)
 * - 2 columns on tablet  (480px–1023px)
 * - 4 columns on desktop (≥ 1024px)
 */
const Grid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

/* ─── States ─── */

const StateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
  gap: 12px;
`;

const StateEmoji = styled.span`
  font-size: 3rem;
  line-height: 1;
`;

const StateTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const StateText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 360px;
`;

const RetryBtn = styled.button`
  margin-top: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
  }
`;

/* ─── Skeleton loader cards ─── */

const SkeletonCard = styled.div`
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
`;

const SkeletonImg = styled.div`
  aspect-ratio: 4/3;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.border} 25%,
    ${({ theme }) => theme.colors.accentLight} 50%,
    ${({ theme }) => theme.colors.border} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;

  @keyframes shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
`;

const SkeletonBody = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonLine = styled.div<{ $width?: string }>`
  height: 12px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.border};
  width: ${({ $width }) => $width ?? "100%"};
`;

const LoadingGrid: React.FC = () => (
  <Grid>
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i}>
        <SkeletonImg />
        <SkeletonBody>
          <SkeletonLine $width="60%" />
          <SkeletonLine $width="100%" />
          <SkeletonLine $width="80%" />
        </SkeletonBody>
      </SkeletonCard>
    ))}
  </Grid>
);

/* ─── Component ─── */

export const GalleryPage: React.FC = () => {
  const {
    loading,
    error,
    isEmpty,
    refetch,
    filteredPets,
    paginatedPets,
    selectAll,
    clearSelection,
    selectedCount,
  } = usePetsContext();

  return (
    <Page>
      <Hero>
        <HeroEyebrow>Eulerity Pet Gallery</HeroEyebrow>
        <HeroTitle>Meet Our Furry Friends</HeroTitle>
        <HeroSub>
          Browse, select, and download photos of pets. Use the search and sort
          tools to find your favourites.
        </HeroSub>
      </Hero>

      <Toolbar>
        {/* Search takes flexible width */}
        <SearchBar />

        <ToolbarRight>
          <ResultCount>
            {filteredPets.length} {filteredPets.length === 1 ? "result" : "results"}
          </ResultCount>
          <QuickActionBtn onClick={selectAll}>Select All</QuickActionBtn>
          {selectedCount > 0 && (
            <QuickActionBtn onClick={clearSelection}>Clear</QuickActionBtn>
          )}
          <SortControls />
        </ToolbarRight>
      </Toolbar>

      {/* Loading state — animated skeleton grid */}
      {loading && <LoadingGrid />}

      {/* Error state */}
      {!loading && error && (
        <StateBox>
          <StateEmoji>⚠️</StateEmoji>
          <StateTitle>Something went wrong</StateTitle>
          <StateText>{error}</StateText>
          <RetryBtn onClick={refetch}>Try Again</RetryBtn>
        </StateBox>
      )}

      {/* Empty API response */}
      {!loading && isEmpty && (
        <StateBox>
          <StateEmoji>🐾</StateEmoji>
          <StateTitle>No pets found</StateTitle>
          <StateText>The API returned an empty list. Check back later!</StateText>
        </StateBox>
      )}

      {/* No search results */}
      {!loading && !error && !isEmpty && filteredPets.length === 0 && (
        <StateBox>
          <StateEmoji>🔍</StateEmoji>
          <StateTitle>No matches</StateTitle>
          <StateText>
            No pets match your search. Try a different keyword.
          </StateText>
        </StateBox>
      )}

      {/* Pet grid */}
      {!loading && !error && paginatedPets.length > 0 && (
        <>
          <Grid>
            {paginatedPets.map((pet) => (
              <PetCard key={pet.url} pet={pet} />
            ))}
          </Grid>
          <Pagination />
        </>
      )}
    </Page>
  );
};
