import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- ANIMATIONS ---
const shine = keyframes`
  0% { left: -100%; }
  20% { left: 100%; }
  100% { left: 100%; }
`;

const scan = keyframes`
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseHighlight = keyframes`
  0% { background: rgba(229, 192, 123, 0.05); border-color: rgba(229, 192, 123, 0.1); }
  50% { background: rgba(229, 192, 123, 0.15); border-color: rgba(229, 192, 123, 0.5); box-shadow: 0 0 20px rgba(229, 192, 123, 0.2); }
  100% { background: rgba(229, 192, 123, 0.05); border-color: rgba(229, 192, 123, 0.1); }
`;

// --- LAYOUT WRAPPER ---
const PageWrapper = styled.div`
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1.75rem 1.25rem 2.25rem;
    align-items: flex-start;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem 2rem;
  }
`;

const AmbientGlow = styled.div`
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(229, 192, 123, 0.05) 0%, rgba(10, 15, 13, 0) 70%);
  z-index: 0;
  pointer-events: none;
`;

const Hero = styled(motion.section)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  max-width: 1200px;
  width: 100%;
  color: #F4F4F5;
  z-index: 1;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    gap: 4rem;
  }
`;

// --- LEFT COLUMN ---
const Left = styled(motion.div)`
  max-width: 560px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 900px) {
    align-items: center;
  }
`;

const ArabicEyebrow = styled.div`
  font-family: 'Amiri', serif;
  font-size: 1.5rem;
  color: #E5C07B; 
  margin-bottom: 12px;
  letter-spacing: 1px;
  text-shadow: 0 0 20px rgba(229, 192, 123, 0.2);
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 4rem;
  font-weight: 600;
  margin: 0 0 24px 0;
  line-height: 1.1;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #F4F4F5 0%, #E5C07B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 20px rgba(229, 192, 123, 0.15);

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Lead = styled.p`
  font-family: 'Outfit', sans-serif;
  color: #8C9A8E;
  font-size: 1.15rem;
  line-height: 1.6;
  font-weight: 300;
  margin-bottom: 40px;
  max-width: 480px;
`;

const PrimaryCTA = styled(Link)`
  position: relative;
  font-family: 'Outfit', sans-serif;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  background: linear-gradient(180deg, #E5C07B 0%, #C99E52 100%);
  color: #0A0F0D;
  text-decoration: none;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1.05rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(229, 192, 123, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4);
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
    box-shadow: 0 15px 35px rgba(229, 192, 123, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }
`;

// --- RIGHT COLUMN: THE DYNAMIC STATEMENT SCANNER ---
const Right = styled(motion.div)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  height: 500px;
  perspective: 1000px; /* Gives the 3D pop effect */

  @media (max-width: 768px) {
    height: 420px;
    max-width: 420px;
  }

  @media (max-width: 480px) {
    height: 380px;
    max-width: 360px;
  }
`;

const DocumentBackdrop = styled.div`
  position: absolute;
  width: 340px;
  height: 420px;
  background: rgba(18, 28, 23, 0.3);
  border: 1px solid rgba(140, 154, 142, 0.1);
  border-radius: 24px;
  transform: rotate(-4deg) translate(-20px, 20px);
  z-index: 1;

  @media (max-width: 768px) {
    width: 300px;
    height: 380px;
  }

  @media (max-width: 480px) {
    width: 260px;
    height: 340px;
    border-radius: 20px;
    transform: rotate(-4deg) translate(-14px, 18px);
  }
`;

const GlassDocument = styled.div`
  position: absolute;
  width: 360px;
  height: 440px;
  background: linear-gradient(145deg, rgba(20, 30, 25, 0.7) 0%, rgba(10, 15, 13, 0.9) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 192, 123, 0.2);
  border-radius: 24px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  padding: 32px 24px;
  z-index: 2;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    width: 320px;
    height: 400px;
    padding: 26px 20px;
    border-radius: 22px;
  }

  @media (max-width: 480px) {
    width: 280px;
    height: 360px;
    padding: 22px 18px;
    border-radius: 20px;
  }
`;

// The Golden Scanner Line
const ScannerLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(to bottom, transparent, rgba(229, 192, 123, 0.2) 80%, rgba(229, 192, 123, 0.8) 100%);
  border-bottom: 2px solid #E5C07B;
  box-shadow: 0 10px 20px rgba(229, 192, 123, 0.3);
  z-index: 10;
  animation: ${scan} 4s ease-in-out infinite;
  pointer-events: none;
`;

const DocHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  div:first-child {
    font-size: 1rem;
    font-weight: 500;
    color: #F4F4F5;
  }
  div:last-child {
    font-size: 0.8rem;
    color: #8C9A8E;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const MockRow = styled.div<{ $isRiba?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: ${({ $isRiba }) => ($isRiba ? 'rgba(229, 192, 123, 0.05)' : 'rgba(255, 255, 255, 0.02)')};
  border: 1px solid ${({ $isRiba }) => ($isRiba ? 'rgba(229, 192, 123, 0.1)' : 'transparent')};
  border-radius: 12px;
  font-family: 'Outfit', sans-serif;
  animation: ${({ $isRiba }) => ($isRiba ? pulseHighlight : 'none')} 4s infinite;
  animation-delay: 2.5s; /* Syncs with when the scanner hits it */

  .desc {
    font-size: 0.95rem;
    color: ${({ $isRiba }) => ($isRiba ? '#E5C07B' : '#A1A1AA')};
    font-weight: ${({ $isRiba }) => ($isRiba ? '500' : '400')};
  }
  .amount {
    font-size: 0.95rem;
    color: ${({ $isRiba }) => ($isRiba ? '#E5C07B' : '#F4F4F5')};
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
`;

const FloatingExtractionCard = styled(motion.div)`
  position: absolute;
  right: -20px;
  bottom: 40px;
  background: linear-gradient(145deg, #1A2620 0%, #121C17 100%);
  backdrop-filter: blur(16px);
  border: 1px solid #E5C07B;
  border-radius: 20px;
  padding: 20px 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 30px rgba(229, 192, 123, 0.15);
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: ${float} 6s ease-in-out infinite;

  @media (max-width: 768px) {
    right: 10px;
    bottom: -10px;
  }
`;

const ExtractLabel = styled.div`
  font-size: 0.8rem;
  color: #8C9A8E;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background: #E5C07B;
    border-radius: 50%;
    box-shadow: 0 0 8px #E5C07B;
  }
`;

const ExtractAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #E5C07B;
  font-family: 'Satoshi', 'Outfit', sans-serif;
`;

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <PageWrapper>
      <AmbientGlow />
      <Hero variants={containerVariants} initial="hidden" animate="show">
        <Left variants={itemVariants}>
          <ArabicEyebrow>طَهِّر مَالَك</ArabicEyebrow>
          <Title>Your Wealth,<br/>Purified.</Title>
          <Lead>
            Upload your bank statement and let our intelligent engine instantly identify hidden interest charges. Purify your ledger and act with absolute confidence.
          </Lead>
          <PrimaryCTA to="/upload">Scan Statement</PrimaryCTA>
        </Left>

        <Right variants={itemVariants}>
          <DocumentBackdrop />
          <GlassDocument>
            <ScannerLine />
            
            <DocHeader>
              <div>Statement_FY25.pdf</div>
              <div>HDFC Bank</div>
            </DocHeader>

            <MockRow>
              <div className="desc">Grocery Store</div>
              <div className="amount">- ₹1,450.00</div>
            </MockRow>

            <MockRow>
              <div className="desc">Salary Credit</div>
              <div className="amount">+ ₹85,000.00</div>
            </MockRow>

            {/* The Highlighted Riba Row */}
            <MockRow $isRiba={true}>
              <div className="desc">CR INT PAID</div>
              <div className="amount">+ ₹240.00</div>
            </MockRow>

            <MockRow>
              <div className="desc">Utility Bill</div>
              <div className="amount">- ₹2,100.00</div>
            </MockRow>
          </GlassDocument>

          <FloatingExtractionCard>
            <ExtractLabel>Riba Identified</ExtractLabel>
            <ExtractAmount>₹240.00</ExtractAmount>
          </FloatingExtractionCard>

        </Right>
      </Hero>
    </PageWrapper>
  );
}