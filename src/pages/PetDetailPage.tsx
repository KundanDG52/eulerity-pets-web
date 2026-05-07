import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

import { usePetsContext } from "../context/PetsContext";
import { getPetFromId, formatDate, downloadSelectedPets } from "../utils";

/* ─── Layout ─── */

const Page = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 80px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 24px 16px 80px;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BreadcrumbLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Separator = styled.span`
  opacity: 0.4;
`;

/* ─── Main content ─── */

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

/* ─── Image panel ─── */

const ImagePanel = styled.div`
  position: sticky;
  top: 88px; /* below navbar */

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: static;
  }
`;

const ImageWrapper = styled.div`
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
  aspect-ratio: 4/3;
  box-shadow: ${({ theme }) => theme.colors.cardShadowHover};
`;

const Image = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  transition: opacity 0.4s ease;
`;

const SkeletonImg = styled.div`
  width: 100%;
  height: 100%;
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

/* ─── Info panel ─── */

const InfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Tag = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentLight};
  padding: 4px 10px;
  border-radius: 999px;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const MetaItem = styled.div``;

const MetaLabel = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 3px;
`;

const MetaValue = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

/* ─── Actions ─── */

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.button`
  flex: 1;
  min-width: 140px;
  padding: 13px 20px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  transition: background 0.15s ease, transform 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryBtn = styled.button<{ $active?: boolean }>`
  flex: 1;
  min-width: 140px;
  padding: 13px 20px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9rem;
  font-weight: 600;
  border: 2px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.accent : theme.colors.border};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.text};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentLight : theme.colors.surface};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentLight};
  }
`;

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 8px 0;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

/* ─── Not found ─── */

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 24px;
  text-align: center;
  gap: 16px;
`;

const NotFoundEmoji = styled.span`font-size: 3.5rem;`;
const NotFoundTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.75rem;
  font-weight: 700;
`;
const NotFoundText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 340px;
`;

/* ─── Component ─── */

export const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pets, isSelected, toggleSelect } = usePetsContext();

  const [imgLoaded, setImgLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const pet = id ? getPetFromId(pets, id) : undefined;

  // Show not-found if pets have loaded but no match
  if (pets.length > 0 && !pet) {
    return (
      <Page>
        <NotFound>
          <NotFoundEmoji>🐾</NotFoundEmoji>
          <NotFoundTitle>Pet not found</NotFoundTitle>
          <NotFoundText>
            We couldn't find this pet. It may have been removed.
          </NotFoundText>
          <SecondaryBtn onClick={() => navigate("/")}>
            ← Back to Gallery
          </SecondaryBtn>
        </NotFound>
      </Page>
    );
  }

  // Loading state — pets not fetched yet
  if (!pet) {
    return (
      <Page>
        <Content>
          <ImagePanel>
            <ImageWrapper>
              <SkeletonImg />
            </ImageWrapper>
          </ImagePanel>
          <InfoPanel>
            <div style={{ height: 24, background: "#E8E0D5", borderRadius: 8, width: "30%" }} />
            <div style={{ height: 48, background: "#E8E0D5", borderRadius: 8 }} />
            <div style={{ height: 80, background: "#E8E0D5", borderRadius: 8 }} />
          </InfoPanel>
        </Content>
      </Page>
    );
  }

  const selected = isSelected(pet.url);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadSelectedPets([pet], new Set([pet.url]));
    setDownloading(false);
  };

  // Derive a simple extension label for the meta grid
  const ext = pet.url.split(".").pop()?.split("?")[0]?.toUpperCase() ?? "IMG";

  return (
    <Page>
      {/* Breadcrumb navigation */}
      <Breadcrumb>
        <BreadcrumbLink to="/">Gallery</BreadcrumbLink>
        <Separator>/</Separator>
        <span>{pet.title}</span>
      </Breadcrumb>

      <Content>
        {/* Left: sticky image */}
        <ImagePanel>
          <ImageWrapper>
            {!imgLoaded && <SkeletonImg />}
            <Image
              src={pet.url}
              alt={pet.title}
              $loaded={imgLoaded}
              onLoad={() => setImgLoaded(true)}
            />
          </ImageWrapper>
        </ImagePanel>

        {/* Right: info + actions */}
        <InfoPanel>
          <Tag>Pet Profile</Tag>

          <Title>{pet.title}</Title>

          <Description>{pet.description}</Description>

          {/* Meta details grid */}
          <MetaGrid>
            <MetaItem>
              <MetaLabel>Added on</MetaLabel>
              <MetaValue>{formatDate(pet.created)}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Format</MetaLabel>
              <MetaValue>{ext}</MetaValue>
            </MetaItem>
            <MetaItem style={{ gridColumn: "1 / -1" }}>
              <MetaLabel>Image URL</MetaLabel>
              <MetaValue
                style={{
                  fontSize: "0.72rem",
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                  opacity: 0.7,
                }}
              >
                {pet.url}
              </MetaValue>
            </MetaItem>
          </MetaGrid>

          {/* Action buttons */}
          <Actions>
            <PrimaryBtn onClick={handleDownload} disabled={downloading}>
              {downloading ? "Downloading…" : "⬇ Download"}
            </PrimaryBtn>
            <SecondaryBtn
              $active={selected}
              onClick={() => toggleSelect(pet.url)}
            >
              {selected ? "✓ Selected" : "+ Add to Selection"}
            </SecondaryBtn>
          </Actions>

          <BackBtn onClick={() => navigate(-1)}>← Back to Gallery</BackBtn>
        </InfoPanel>
      </Content>
    </Page>
  );
};
