import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import type { Pet } from "../types";
import { usePetsContext } from "../context/PetsContext";
import { getPetId, formatDate } from "../utils";

/* ─── Styled Components ─── */

const Card = styled.article<{ $selected: boolean }>`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  border: 2px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.accent : theme.colors.border};
  box-shadow: ${({ theme, $selected }) =>
    $selected ? `0 0 0 3px ${theme.colors.accentLight}` : theme.colors.cardShadow};
  transition: border-color 0.18s ease, box-shadow 0.18s ease,
    transform 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: ${({ theme }) => theme.colors.cardShadowHover};
    transform: translateY(-3px);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
`;

const Img = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease, opacity 0.3s ease;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};

  ${Card}:hover & {
    transform: scale(1.04);
  }
`;

const SkeletonImg = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.border} 25%,
    ${({ theme }) => theme.colors.accentLight} 50%,
    ${({ theme }) => theme.colors.border} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;

  @keyframes shimmer {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
`;

const Checkbox = styled.button<{ $checked: boolean }>`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  border: 2px solid
    ${({ theme, $checked }) =>
      $checked ? theme.colors.accent : "rgba(255,255,255,0.8)"};
  background: ${({ theme, $checked }) =>
    $checked ? theme.colors.accent : "rgba(255,255,255,0.7)"};
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: white;
  transition: all 0.15s ease;
  z-index: 2;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme, $checked }) =>
      $checked ? theme.colors.accentHover : "rgba(255,255,255,0.95)"};
  }
`;

const Body = styled.div`
  padding: 14px 16px 16px;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Date = styled.span`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

const ViewLink = styled(Link)`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.accentLight};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: white;
  }
`;

/* ─── Component ─── */

interface PetCardProps {
  pet: Pet;
}

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const { isSelected, toggleSelect } = usePetsContext();
  const [imgLoaded, setImgLoaded] = useState(false);
  const selected = isSelected(pet.url);
  const petId = getPetId(pet);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSelect(pet.url);
  };

  return (
    <Card
      $selected={selected}
      onClick={() => toggleSelect(pet.url)}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => e.key === " " && toggleSelect(pet.url)}
    >
      <ImageWrapper>
        {!imgLoaded && <SkeletonImg />}
        <Img
          src={pet.url}
          alt={pet.title}
          $loaded={imgLoaded}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        <Checkbox
          $checked={selected}
          onClick={handleCheckboxClick}
          aria-label={selected ? `Deselect ${pet.title}` : `Select ${pet.title}`}
        >
          {selected ? "✓" : ""}
        </Checkbox>
      </ImageWrapper>

      <Body>
        <Title title={pet.title}>{pet.title}</Title>
        <Description>{pet.description}</Description>
        <Meta>
          <Date>{formatDate(pet.created)}</Date>
          <ViewLink
            to={`/pets/${petId}`}
            onClick={(e) => e.stopPropagation()}
          >
            View →
          </ViewLink>
        </Meta>
      </Body>
    </Card>
  );
};
