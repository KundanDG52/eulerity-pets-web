import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { usePetsContext } from "../context/PetsContext";

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(250, 247, 242, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;

  span {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.textMuted};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentLight : "transparent"};
  transition: all 0.18s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentLight};
  }
`;

const SelectionBadge = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  border-radius: 999px;
  padding: 2px 9px;
  min-width: 24px;
  text-align: center;
`;

export const Navbar: React.FC = () => {
  const { selectedCount } = usePetsContext();
  const { pathname } = useLocation();

  return (
    <Nav>
      <NavInner>
        <Logo to="/">
          Paw<span>Gallery</span>
        </Logo>
        <NavLinks>
          <NavLink to="/" $active={pathname === "/"}>
            Gallery
          </NavLink>
          <NavLink to="/about" $active={pathname === "/about"}>
            About
          </NavLink>
          {selectedCount > 0 && (
            <SelectionBadge>{selectedCount} selected</SelectionBadge>
          )}
        </NavLinks>
      </NavInner>
    </Nav>
  );
};
