import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

/* ─── Layout ─── */

const Page = styled.main`
  max-width: 860px;
  margin: 0 auto;
  padding: 60px 24px 100px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 40px 16px 80px;
  }
`;

const Eyebrow = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

const Lead = styled.p`
  font-size: 1.125rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 640px;
  margin-bottom: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

/* ─── Feature cards ─── */

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 56px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.colors.cardShadow};
    transform: translateY(-2px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 1.75rem;
  margin-bottom: 12px;
  line-height: 1;
`;

const FeatureTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const FeatureText = styled.p`
  font-size: 0.875rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ─── Tech stack ─── */

const StackSection = styled.div`
  margin-bottom: 56px;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`;

const StackList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const StackTag = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accentLight};
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.accent}33;
`;

/* ─── CTA ─── */

const CTA = styled.div`
  padding: 40px;
  background: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.lg};
  text-align: center;
`;

const CTATitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
`;

const CTAText = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 24px;
`;

const CTABtn = styled(Link)`
  display: inline-block;
  padding: 12px 28px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: background 0.15s ease, transform 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accentHover};
    transform: translateY(-1px);
  }
`;

/* ─── Features data ─── */

const FEATURES = [
  {
    icon: "🔍",
    title: "Smart Search",
    text: "Instantly filter pets by name or description with a live search that updates as you type.",
  },
  {
    icon: "☑️",
    title: "Batch Selection",
    text: "Select multiple pets at once, with your selection persisting as you navigate between pages.",
  },
  {
    icon: "⬇️",
    title: "Bulk Download",
    text: "Download individual images or your entire selection in one click, straight to your device.",
  },
  {
    icon: "↕️",
    title: "Flexible Sorting",
    text: "Sort by name A–Z or Z–A, or by date newest-first or oldest-first — your choice.",
  },
  {
    icon: "📄",
    title: "Paginated Gallery",
    text: "Browsable, paginated grid with 8 pets per page and smart page controls.",
  },
  {
    icon: "📱",
    title: "Responsive Design",
    text: "Optimised for every screen: 1 column on mobile, 2 on tablet, and 4 on desktop.",
  },
];

const STACK = [
  "React 18",
  "TypeScript",
  "styled-components v6",
  "React Router v6",
  "Vite",
  "Context API",
  "Custom Hooks",
  "Fetch API",
];

/* ─── Component ─── */

export const AboutPage: React.FC = () => {
  return (
    <Page>
      <Eyebrow>About this project</Eyebrow>
      <Title>PawGallery</Title>
      <Lead>
        A take-home challenge project built for Eulerity. A fully featured
        pet image gallery with search, sort, selection, batch download, dynamic
        routing, and a responsive layout — built with React, TypeScript, and
        styled-components.
      </Lead>

      {/* Feature highlights */}
      <FeatureGrid>
        {FEATURES.map((f) => (
          <FeatureCard key={f.title}>
            <FeatureIcon>{f.icon}</FeatureIcon>
            <FeatureTitle>{f.title}</FeatureTitle>
            <FeatureText>{f.text}</FeatureText>
          </FeatureCard>
        ))}
      </FeatureGrid>

      {/* Tech stack */}
      <StackSection>
        <SectionTitle>Built with</SectionTitle>
        <StackList>
          {STACK.map((s) => (
            <StackTag key={s}>{s}</StackTag>
          ))}
        </StackList>
      </StackSection>

      {/* CTA */}
      <CTA>
        <CTATitle>Ready to browse?</CTATitle>
        <CTAText>
          Head back to the gallery to explore and select your favourite pets.
        </CTAText>
        <CTABtn to="/">Open Gallery →</CTABtn>
      </CTA>
    </Page>
  );
};
