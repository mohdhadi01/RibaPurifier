import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParser } from '../context/ParserContext';

// --- ANIMATIONS ---
const shine = keyframes`
  0% { left: -100%; }
  20% { left: 100%; }
  100% { left: 100%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// --- STYLING (Ultra-Premium Midnight Oasis) ---
const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 80px 0 4rem;
  background-color: transparent;
  color: #F4F4F5;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow-x: hidden; /* CRITICAL: Prevents horizontal scrolling from glow */

  @media (max-width: 768px) {
    padding: 72px 0 3.5rem;
  }

  @media (max-width: 480px) {
    padding: 40px 0 3rem;
  }
`;

// Ambient glow behind the ledger
const AmbientGlow = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 600px;
  background: radial-gradient(ellipse, rgba(229, 192, 123, 0.05) 0%, rgba(10, 15, 13, 0) 70%);
  z-index: -1;
  pointer-events: none;

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vw;
  }
`;

const ContentZ = styled.div`
  max-width: 1060px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2.5rem;

  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.75rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #F4F4F5 0%, #E5C07B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 20px rgba(229, 192, 123, 0.15);

  @media (max-width: 768px) {
    font-size: 2.3rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    margin: 0 0 8px 0;
  }
`;

const Subtitle = styled.p`
  color: #8C9A8E;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 300;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const Card = styled(motion.div)`
  background: linear-gradient(145deg, rgba(18, 28, 23, 0.6) 0%, rgba(10, 15, 13, 0.9) 100%);
  backdrop-filter: blur(24px) saturate(120%);
  -webkit-backdrop-filter: blur(24px) saturate(120%);
  border-radius: 24px;
  border: 1px solid rgba(229, 192, 123, 0.15);
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.5), 
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
  position: relative;

  @media (max-width: 480px) {
    border-radius: 20px;
  }
`;

// --- TABLE STYLING ---
const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  
  /* Stylish Scrollbar for Webkit */
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(10, 15, 13, 0.5);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(229, 192, 123, 0.3);
    border-radius: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
`;

const Th = styled.th`
  text-align: left;
  padding: 20px 24px;
  color: #8C9A8E;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 500;
  border-bottom: 1px solid rgba(229, 192, 123, 0.15);
  background: rgba(0, 0, 0, 0.2);

  @media (max-width: 600px) {
    padding: 16px 18px;
    font-size: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 14px 16px;
  }
`;

const Tr = styled(motion.tr)<{ $isExcluded: boolean }>`
  transition: background 0.3s ease, opacity 0.3s ease, transform 0.2s ease;
  opacity: ${({ $isExcluded }) => ($isExcluded ? 0.5 : 1)};

  &:hover {
    background: rgba(229, 192, 123, 0.03);
    transform: translateY(-1px);
  }

  td {
    color: ${({ $isExcluded }) => ($isExcluded ? '#5C6A60' : '#F4F4F5')};
    text-decoration: ${({ $isExcluded }) => ($isExcluded ? 'line-through' : 'none')};
    transition: all 0.3s ease;
  }

  td.amount {
    color: ${({ $isExcluded }) => ($isExcluded ? '#5C6A60' : '#E5C07B')};
  }
`;

const Td = styled.td`
  padding: 18px 24px;
  border-bottom: 1px solid rgba(229, 192, 123, 0.05);
  font-size: 1rem;
  font-weight: 400;

  &.amount {
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 600px) {
    padding: 16px 18px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 0.9rem;
  }
`;

const ExcludeBtn = styled.button<{ $isExcluded: boolean }>`
  background: ${({ $isExcluded }) => ($isExcluded ? 'rgba(229, 192, 123, 0.1)' : 'transparent')};
  border: 1px solid ${({ $isExcluded }) => ($isExcluded ? '#E5C07B' : 'rgba(140, 154, 142, 0.2)')};
  color: ${({ $isExcluded }) => ($isExcluded ? '#E5C07B' : '#8C9A8E')};
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $isExcluded }) => ($isExcluded ? 'rgba(229, 192, 123, 0.16)' : 'rgba(239, 68, 68, 0.1)')};
    border-color: ${({ $isExcluded }) => ($isExcluded ? '#E5C07B' : '#EF4444')};
    color: ${({ $isExcluded }) => ($isExcluded ? '#E5C07B' : '#EF4444')};
  }

  /* Responsive Text Swapping logic */
  .mobile-text {
    display: none;
  }

  @media (max-width: 480px) {
    padding: 6px 14px;
    font-size: 0.8rem;
    
    .desktop-text {
      display: none;
    }
    .mobile-text {
      display: inline;
    }
  }
`;

// --- EMPTY STATE & BUTTONS ---
const EmptyState = styled.div`
  padding: 6.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 5.5rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 4rem 1.25rem;
  }
`;

const FloatingIcon = styled.div`
  animation: ${float} 4s ease-in-out infinite;
  margin-bottom: 24px;
  color: rgba(229, 192, 123, 0.5);

  @media (max-width: 480px) {
    margin-bottom: 16px;
    svg {
      width: 48px;
      height: 48px;
    }
  }
`;

const EmptyText = styled.div`
  color: #8C9A8E;
  font-size: 1.15rem;
  font-weight: 300;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 24px;
    line-height: 1.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ActionBtn = styled(motion.button)`
  position: relative;
  padding: 14px 32px;
  background: linear-gradient(180deg, #E5C07B 0%, #C99E52 100%);
  color: #0A0F0D;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(229, 192, 123, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  font-family: 'Outfit', sans-serif;

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
    box-shadow: 0 15px 35px rgba(229, 192, 123, 0.3);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 14px 24px;
  }
`;

// --- FRAMER MOTION VARIANTS ---
const tableVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function Ledger() {
  const { results, rawText, setResults } = useParser();
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

  const handleExclude = (index: number) => {
    setResults(prev =>
      prev.map((tx, i) =>
        i === index ? { ...tx, excluded: !tx.excluded } : tx
      )
    );
  };

  return (
    <PageWrapper>
      <AmbientGlow />
      <ContentZ>
        <Header>
          <Title>Detailed Ledger</Title>
          <Subtitle>Review, verify, and manage your identified transactions.</Subtitle>
        </Header>

        <Card
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {!rawText ? (
            <EmptyState>
              <FloatingIcon>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </FloatingIcon>
              <EmptyText>No transactions detected yet. Scan a statement to populate your ledger.</EmptyText>
              <ButtonGroup>
                <ActionBtn whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/upload')}>
                  Scan Statement
                </ActionBtn>
              </ButtonGroup>
            </EmptyState>
          ) : (
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <Th>Date</Th>
                    <Th>Description</Th>
                    <Th>Amount</Th>
                    <Th style={{ textAlign: 'right' }}>Status</Th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={tableVariants}
                  initial="hidden"
                  animate="show"
                >
                  {results.length === 0 ? (
                    <tr>
                      <Td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#8C9A8E' }}>
                        We scanned your last statement but did not detect any Riba entries with the current patterns.
                      </Td>
                    </tr>
                  ) : (
                    results.map((r, i) => {
                      const isExcluded = !!r.excluded;
                      return (
                        <Tr key={i} variants={rowVariants} $isExcluded={isExcluded}>
                          <Td>{r.date || 'Unknown'}</Td>
                          <Td>{r.description}</Td>
                          <Td className="amount">{formatter.format(r.amount)}</Td>
                          <Td style={{ textAlign: 'right' }}>
                            <ExcludeBtn 
                              $isExcluded={isExcluded}
                              onClick={() => handleExclude(i)}
                            >
                              <span className="desktop-text">{isExcluded ? 'Include again' : 'Exclude from total'}</span>
                              <span className="mobile-text">{isExcluded ? 'Include' : 'Exclude'}</span>
                            </ExcludeBtn>
                          </Td>
                        </Tr>
                      );
                    })
                  )}
                </motion.tbody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </ContentZ>
    </PageWrapper>
  );
}