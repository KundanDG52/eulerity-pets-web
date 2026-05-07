import React from "react";
import styled from "styled-components";
import { usePetsContext } from "../context/PetsContext";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 32px 0 80px; /* bottom padding for the SelectionBar */
`;

const PageBtn = styled.button<{ $active?: boolean; $nav?: boolean }>`
  min-width: 38px;
  height: 38px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  border: 1.5px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.accent : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.surface};
  color: ${({ theme, $active }) => ($active ? "white" : theme.colors.text)};
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme, $active }) => ($active ? "white" : theme.colors.accent)};
    background: ${({ theme, $active }) =>
      $active ? theme.colors.accentHover : theme.colors.accentLight};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const Ellipsis = styled.span`
  padding: 0 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
`;

/** Generates page numbers with ellipsis for large ranges */
function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export const Pagination: React.FC = () => {
  const { currentPage, totalPages, setCurrentPage } = usePetsContext();

  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);

  return (
    <Wrapper aria-label="Pagination">
      <PageBtn
        $nav
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        aria-label="Previous page"
      >
        ‹
      </PageBtn>

      {pages.map((p, i) =>
        p === "…" ? (
          <Ellipsis key={`ellipsis-${i}`}>…</Ellipsis>
        ) : (
          <PageBtn
            key={p}
            $active={p === currentPage}
            onClick={() => setCurrentPage(p)}
            aria-label={`Go to page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </PageBtn>
        )
      )}

      <PageBtn
        $nav
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        aria-label="Next page"
      >
        ›
      </PageBtn>
    </Wrapper>
  );
};
