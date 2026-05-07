import React from "react";
import styled from "styled-components";
import type { SortOption } from "../types";
import { usePetsContext } from "../context/PetsContext";

const Select = styled.select`
  padding: 10px 14px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A6F62' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentLight};
  }
`;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date-newest", label: "Date: Newest First" },
  { value: "date-oldest", label: "Date: Oldest First" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
];

export const SortControls: React.FC = () => {
  const { sortOption, setSortOption } = usePetsContext();

  return (
    <Select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value as SortOption)}
      aria-label="Sort pets"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
};
