import { createGlobalStyle } from "styled-components";

export const theme = {
  colors: {
    bg: "#FAF7F2",
    surface: "#FFFFFF",
    border: "#E8E0D5",
    text: "#1A1208",
    textMuted: "#7A6F62",
    accent: "#C8522A",      // warm burnt orange
    accentLight: "#F5E6DF",
    accentHover: "#A83E1A",
    success: "#3A7D44",
    cardShadow: "0 2px 16px rgba(26,18,8,0.08)",
    cardShadowHover: "0 8px 32px rgba(26,18,8,0.15)",
  },
  fonts: {
    display: "'Playfair Display', Georgia, serif",
    body: "'DM Sans', sans-serif",
  },
  radii: {
    sm: "6px",
    md: "12px",
    lg: "20px",
  },
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
  },
};

export type Theme = typeof theme;

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
    display: block;
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: none;
  }

  input {
    font-family: inherit;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accentLight};
    color: ${({ theme }) => theme.colors.accent};
  }

  /* Subtle grain texture overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 128px;
  }
`;
