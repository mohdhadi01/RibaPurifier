import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// --- ANIMATIONS ---
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spinReverse = keyframes`
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { transform: scale(0.95) rotate(45deg); box-shadow: 0 0 20px rgba(229, 192, 123, 0.2); }
  50% { transform: scale(1.05) rotate(45deg); box-shadow: 0 0 40px rgba(229, 192, 123, 0.6); }
`;

const textShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// --- STYLING ---
const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 20px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
`;

// The Engine Visual
const EngineWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OuterRing = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed rgba(229, 192, 123, 0.3);
  animation: ${spin} 8s linear infinite;
`;

const InnerRing = styled.div`
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top: 2px solid #E5C07B;
  border-bottom: 2px solid #E5C07B;
  animation: ${spinReverse} 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
`;

const CoreStar = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #E5C07B 0%, #C99E52 100%);
  position: relative;
  animation: ${pulseGlow} 2s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    transform: rotate(45deg);
  }
`;

// Typography
const StatusTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  
  /* Shimmering Gold Text */
  background: linear-gradient(
    to right,
    #F4F4F5 20%,
    #E5C07B 40%,
    #E5C07B 60%,
    #F4F4F5 80%
  );
  background-size: 200% auto;
  color: #000;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${textShimmer} 3s linear infinite;
`;

const StatusSubtitle = styled.p`
  font-family: 'Outfit', sans-serif;
  color: #8C9A8E;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.5px;
`;

// File Badge
const FileBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: min(100%, 320px);
  min-width: 0;
  overflow: hidden;
  background: rgba(20, 30, 25, 0.6);
  border: 1px solid rgba(229, 192, 123, 0.15);
  padding: 8px 16px;
  border-radius: 999px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  color: #A1A1AA;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  margin-top: 8px;
  box-sizing: border-box;

  svg {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    color: #E5C07B;
  }
`;

const FileNameText = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface ProcessingProps {
  fileName?: string | null;
}

export default function Processing({ fileName }: ProcessingProps) {
  return (
    <Container
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <EngineWrapper>
        <OuterRing />
        <InnerRing />
        <CoreStar />
      </EngineWrapper>

      <div style={{ textAlign: 'center' }}>
        <StatusTitle>Scanning Ledger...</StatusTitle>
        <StatusSubtitle>Decrypting and isolating transactions</StatusSubtitle>
      </div>

      {fileName && (
        <FileBadge title={fileName}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <FileNameText>{fileName}</FileNameText>
        </FileBadge>
      )}
    </Container>
  );
}