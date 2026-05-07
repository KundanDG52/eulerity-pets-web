import React from "react";
import styled from "styled-components";
import { usePetsContext } from "../context/PetsContext";

const Wrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 420px;
`;

const Icon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
  font-size: 1rem;
  line-height: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 36px 10px 40px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  font-weight: 400;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentLight};
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  padding: 2px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentLight};
  }
`;

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = usePetsContext();

  return (
    <Wrapper>
      <Icon>🔍</Icon>
      <Input
        type="text"
        placeholder="Search by name or description…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search pets"
      />
      {searchQuery && (
        <ClearBtn onClick={() => setSearchQuery("")} aria-label="Clear search">
          ✕
        </ClearBtn>
      )}
    </Wrapper>
  );
};
