import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { theme, GlobalStyles } from "./styles/GlobalStyles";
import { PetsProvider } from "./context/PetsContext";
import { Navbar } from "./components/Navbar";
import { SelectionBar } from "./components/SelectionBar";

import { GalleryPage } from "./pages/GalleryPage";
import { PetDetailPage } from "./pages/PetDetailPage";
import { AboutPage } from "./pages/AboutPage";

/**
 * Root component.
 * - ThemeProvider injects the theme into all styled-components.
 * - PetsProvider wraps the entire app so selection state persists
 *   across route changes (navigating to detail view and back keeps selections).
 * - Navbar and SelectionBar are rendered outside <Routes> so they
 *   appear on every page.
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <PetsProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<GalleryPage />} />
            <Route path="/pets/:id" element={<PetDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Catch-all: redirect unknown routes to gallery */}
            <Route path="*" element={<GalleryPage />} />
          </Routes>
          <SelectionBar />
        </PetsProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
