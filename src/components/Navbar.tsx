import React from 'react';
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
  margin: 0 auto 0px auto;
  padding: 10px 24px;
  
  /* Advanced Beveled Glassmorphism */
  background: rgba(10, 15, 13, 0.45); /* More transparent for better blur */
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border-radius: 999px;
  
  /* Multi-layered borders for 3D glass edge */
  border: 1px solid rgba(229, 192, 123, 0.15);
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.4), /* Deep drop shadow */
    inset 0 1px 0 rgba(255, 255, 255, 0.05), /* Top light reflection */
    inset 0 -1px 0 rgba(229, 192, 123, 0.05); /* Bottom gold reflection */

  @media (max-width: 900px) {
    padding: 12px 16px;
    width: 92%;
    top: 16px;
  }
`;

// --- LOGO AREA ---
const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  group: hover;
`;

const StarContainer = styled(motion.div)`
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Creating the classic 8-point Islamic star (Rub el Hizb)
const StarSquare = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  border: 1.5px solid #E5C07B;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(229, 192, 123, 0.4), inset 0 0 5px rgba(229, 192, 123, 0.2);
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
  /* Metallic Gradient Text */
  background: linear-gradient(135deg, #F4F4F5 0%, #E5C07B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(229, 192, 123, 0.2);
`;

// --- NAVIGATION LINKS ---
const NavLinksContainer = styled.nav`
  display: flex;
  gap: 36px;
  align-items: center;

  @media (max-width: 900px) {
    display: none;
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
  box-shadow: 0 4px 15px rgba(229, 192, 123, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  /* The sweeping shine effect */
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
`;

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Ledger', path: '/ledger' },
    { name: 'Purify', path: '/purify' },
  ];

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
      </Actions>
    </NavHeader>
  );
}