import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { usePetsContext } from "../context/PetsContext";
import {
  ESTIMATED_SIZE_PER_IMAGE_KB,
  formatFileSize,
  downloadSelectedPets,
} from "../utils";

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const Bar = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  animation: ${slideUp} 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

  background: ${({ theme }) => theme.colors.text};
  color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 40px rgba(26, 18, 8, 0.35);
  flex-wrap: wrap;
  max-width: calc(100vw - 48px);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    bottom: 12px;
    padding: 12px 14px;
    gap: 8px;
  }
`;

const Info = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;

  strong {
    color: ${({ theme }) => theme.colors.accentLight};
  }
`;

const Divider = styled.span`
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
`;

const ActionBtn = styled.button<{ $primary?: boolean }>`
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: ${({ theme }) => theme.radii.sm};
  white-space: nowrap;
  transition: all 0.15s ease;

  background: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : "rgba(255,255,255,0.1)"};
  color: white;

  &:hover {
    background: ${({ theme, $primary }) =>
      $primary ? theme.colors.accentHover : "rgba(255,255,255,0.2)"};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SelectionBar: React.FC = () => {
  const { selectedCount, selectedUrls, pets, selectAll, clearSelection } =
    usePetsContext();
  const [downloading, setDownloading] = useState(false);

  if (selectedCount === 0) return null;

  const estimatedKB = selectedCount * ESTIMATED_SIZE_PER_IMAGE_KB;

  const handleDownload = async () => {
    setDownloading(true);
    await downloadSelectedPets(pets, selectedUrls);
    setDownloading(false);
  };

  return (
    <Bar role="status" aria-live="polite">
      <Info>
        <strong>{selectedCount}</strong>{" "}
        {selectedCount === 1 ? "image" : "images"} selected
      </Info>
      <Info style={{ opacity: 0.65 }}>{formatFileSize(estimatedKB)} est.</Info>
      <Divider />
      <ActionBtn onClick={selectAll}>Select All</ActionBtn>
      <ActionBtn onClick={clearSelection}>Clear</ActionBtn>
      <Divider />
      <ActionBtn $primary onClick={handleDownload} disabled={downloading}>
        {downloading ? "Downloading…" : "⬇ Download"}
      </ActionBtn>
    </Bar>
  );
};
