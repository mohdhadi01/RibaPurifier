import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

// --- ANIMATIONS ---
const shine = keyframes`
  0% { left: -100%; }
  20% { left: 100%; }
  100% { left: 100%; }
`;

// --- STYLING (Ultra-Premium Midnight Oasis) ---
const NavHeader = styled(motion.header)`
  position: sticky;
  top: 24px;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
  padding: 10px 24px;
  
  /* Advanced Beveled Glassmorphism */
  background: rgba(10, 15, 13, 0.45);
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border-radius: 999px;
  
  /* Multi-layered borders for 3D glass edge */
  border: 1px solid rgba(229, 192, 123, 0.15);
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    inset 0 -1px 0 rgba(229, 192, 123, 0.05);

  @media (max-width: 900px) {
    padding: 12px 20px;
    width: 92%;
    top: 16px;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    width: 95%;
    top: 12px;
  }
`;

// --- LOGO AREA ---
const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  
  @media (max-width: 480px) {
    gap: 8px; /* Tighter gap on mobile */
  }
`;

const StarContainer = styled(motion.div)`
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
  }
`;

const StarSquare = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  border: 1.5px solid #E5C07B;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(229, 192, 123, 0.4), inset 0 0 5px rgba(229, 192, 123, 0.2);

  @media (max-width: 480px) {
    width: 14px;
    height: 14px;
  }
`;

const StarSquareRotated = styled(StarSquare)`
  transform: rotate(45deg);
`;

const LogoText = styled.h1`
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  font-size: 1.35rem;
  margin: 0;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #F4F4F5 0%, #E5C07B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(229, 192, 123, 0.2);

  @media (max-width: 480px) {
    font-size: 1.05rem; /* Shrunk slightly to make room for the button */
  }
`;

// --- NAVIGATION LINKS ---
const NavLinksContainer = styled.nav`
  display: flex;
  gap: 36px;
  align-items: center;

  @media (max-width: 900px) {
    display: none; /* Hide on mobile to replace with hamburger */
  }
`;

const StyledLink = styled(Link)<{ $isActive: boolean }>`
  position: relative;
  font-family: 'Outfit', sans-serif;
  text-decoration: none;
  color: ${({ $isActive }) => ($isActive ? '#F4F4F5' : '#8C9A8E')};
  font-weight: ${({ $isActive }) => ($isActive ? '500' : '400')};
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
  padding: 6px 0;

  &:hover {
    color: #E5C07B;
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -6px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #E5C07B, transparent);
  border-radius: 2px;
  box-shadow: 0 0 12px rgba(229, 192, 123, 0.6);
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 480px) {
    gap: 8px; /* Tighter spacing between CTA and Menu Icon */
  }
`;

// --- LUXURY BUTTON ---
const GetStartedBtn = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  background: linear-gradient(180deg, #E5C07B 0%, #C99E52 100%);
  color: #0A0F0D;
  border-radius: 999px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap; /* FIX: Prevents text from breaking into two lines */
  box-shadow: 0 4px 15px rgba(229, 192, 123, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
    transform: skewX(-25deg);
    animation: ${shine} 4s infinite;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 25px rgba(229, 192, 123, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 8px 14px; /* Slightly tighter padding */
    font-size: 0.8rem; /* Smaller font to fit narrow screens */
  }
`;

// --- MOBILE MENU COMPONENTS ---
const MenuToggleBtn = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #E5C07B;

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 28px;
    height: 28px;
  }
`;

const MobileMenuDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 220px;
  background: rgba(10, 15, 13, 0.9);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(229, 192, 123, 0.15);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  transform-origin: top right;
`;

const MobileNavLink = styled(Link)<{ $isActive: boolean }>`
  font-family: 'Outfit', sans-serif;
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 12px;
  color: ${({ $isActive }) => ($isActive ? '#E5C07B' : '#F4F4F5')};
  background: ${({ $isActive }) => ($isActive ? 'rgba(229, 192, 123, 0.1)' : 'transparent')};
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:active {
    background: rgba(229, 192, 123, 0.15);
  }
`;

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Ledger', path: '/ledger' },
    { name: 'Purify', path: '/purify' },
  ];

  // Close mobile menu automatically on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <NavHeader
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <LogoLink to="/">
        <StarContainer
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.8, ease: "anticipate" }}
        >
          <StarSquare />
          <StarSquareRotated />
        </StarContainer>
        <LogoText>RibaPurifier</LogoText>
      </LogoLink>

      <Actions>
        {/* Desktop Links */}
        <NavLinksContainer>
          <AnimatePresence>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <StyledLink key={item.name} to={item.path} $isActive={isActive}>
                  {item.name}
                  {isActive && (
                    <ActiveIndicator
                      layoutId="activeNavIndicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </StyledLink>
              );
            })}
          </AnimatePresence>
        </NavLinksContainer>

        <GetStartedBtn to="/upload">Scan Statement</GetStartedBtn>

        {/* Mobile Menu Toggle Button */}
        <MenuToggleBtn onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </MenuToggleBtn>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <MobileMenuDropdown
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <MobileNavLink 
                    key={item.name} 
                    to={item.path} 
                    $isActive={isActive}
                  >
                    {item.name}
                  </MobileNavLink>
                );
              })}
            </MobileMenuDropdown>
          )}
        </AnimatePresence>
      </Actions>
    </NavHeader>
  );
}