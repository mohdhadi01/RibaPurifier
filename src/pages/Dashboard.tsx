import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useParser } from '../context/ParserContext';

// --- ANIMATIONS ---
const shine = keyframes`
  0% { left: -100%; }
  20% { left: 100%; }
  100% { left: 100%; }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(45deg); }
  50% { transform: translateY(-12px) rotate(45deg); }
  100% { transform: translateY(0px) rotate(45deg); }
`;

const PageWrapper = styled.div`
  min-height: calc(100vh - 80px);
  padding: 40px 0 40px;
  background-color: transparent;
  position: relative;
  overflow: hidden;
  color: #F4F4F5;
  font-family: 'Outfit', sans-serif;

  @media (max-width: 768px) {
    padding: 32px 0 32px;
  }

  @media (max-width: 480px) {
    padding: 20px 0 28px;
  }
`;

// Deep ambient spiritual glow
const AmbientGlow = styled.div`
  position: absolute;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(ellipse, rgba(229, 192, 123, 0.05) 0%, rgba(10, 15, 13, 0) 70%);
  z-index: 0;
  pointer-events: none;

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vw;
  }
`;

const ContentZ = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

// --- CARDS ---
const Card = styled(motion.div)`
  background: linear-gradient(145deg, rgba(18, 28, 23, 0.6) 0%, rgba(10, 15, 13, 0.9) 100%);
  backdrop-filter: blur(24px) saturate(120%);
  -webkit-backdrop-filter: blur(24px) saturate(120%);
  padding: 40px 32px;
  border-radius: 32px;
  border: 1px solid rgba(229, 192, 123, 0.15);
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.4), 
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 28px 24px;
    border-radius: 28px;
  }

  @media (max-width: 480px) {
    padding: 24px 20px;
    border-radius: 24px;
  }
`;

// Replaces inline gridColumn span logic for flawless mobile breaking
const MainCard = styled(Card)`
  grid-column: span 2;
  
  &.arch {
    border-radius: 100px 100px 32px 32px;
    padding-left: 40px;
    border-top: 1px solid rgba(229, 192, 123, 0.25);
    background: linear-gradient(145deg, rgba(22, 34, 28, 0.7) 0%, rgba(10, 15, 13, 0.95) 100%);
    box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(229, 192, 123, 0.1);
  }

  @media (max-width: 900px) {
    grid-column: 1 / -1; /* Reset to full width on mobile */
  }

  @media (max-width: 768px) {
    &.arch {
      border-radius: 80px 80px 28px 28px;
      padding-left: 28px;
    }
  }

  @media (max-width: 480px) {
    &.arch {
      border-radius: 40px 40px 24px 24px; /* Flattens arch slightly for small screens */
      padding-left: 20px;
    }
  }
`;

const TableCard = styled(Card)`
  grid-column: 1 / -1;
  padding: 32px;

  @media (max-width: 480px) {
    padding: 24px 16px;
  }
`;

// --- TYPOGRAPHY ---
const Title = styled.div`
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  color: #8C9A8E;
  font-size: 0.95rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const BigAmount = styled.div`
  margin-top: 16px;
  font-size: 4rem;
  font-family: 'Satoshi', 'Outfit', sans-serif;
  font-weight: 600;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #F4F4F5 0%, #E5C07B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 4px 20px rgba(229, 192, 123, 0.15);

  @media (max-width: 768px) {
    font-size: 3.2rem;
  }

  @media (max-width: 480px) {
    font-size: 2.6rem;
    margin-top: 12px;
  }
`;

// --- LUXURY BUTTONS ---
const ActionBtn = styled(motion.button)`
  position: relative;
  margin-top: auto;
  padding: 16px 32px;
  background: linear-gradient(180deg, #E5C07B 0%, #C99E52 100%);
  color: #0A0F0D;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(229, 192, 123, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  font-family: 'Outfit', sans-serif;
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
    box-shadow: 0 15px 35px rgba(229, 192, 123, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 480px) {
    width: 100%; /* Full width on mobile */
    padding: 14px 24px;
    font-size: 1rem;
  }
`;

// --- EMPTY STATE STYLING ---
const EmptyContainer = styled(motion.div)`
  padding: 72px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 768px) {
    padding: 56px 0;
  }

  @media (max-width: 480px) {
    padding: 32px 0;
  }
`;

const GeometricIcon = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 40px;
  position: relative;
  background: rgba(229, 192, 123, 0.05);
  border: 1px solid rgba(229, 192, 123, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(229, 192, 123, 0.1);
  animation: ${float} 6s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 1px solid rgba(229, 192, 123, 0.3);
    transform: rotate(45deg);
  }

  @media (max-width: 480px) {
    width: 64px;
    height: 64px;
    margin-bottom: 32px;
  }
`;

const EmptyTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 500;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #F4F4F5 0%, #E5C07B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const EmptyText = styled.p`
  color: #8C9A8E;
  max-width: 480px;
  line-height: 1.7;
  font-size: 1.15rem;
  font-weight: 300;
  margin-bottom: 48px;

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 32px;
    padding: 0 16px;
  }
`;

// --- TABLE STYLING ---
const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Th = styled.th`
  padding: 0 20px 20px 0;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: #8C9A8E;
  text-align: left;
  border-bottom: 1px solid rgba(229, 192, 123, 0.2);

  &:last-child {
    text-align: right;
    padding-right: 0;
  }

  @media (max-width: 480px) {
    padding: 0 12px 16px 0;
    font-size: 0.75rem;
  }
`;

const Td = styled.td`
  padding: 20px 20px 20px 0;

  &:last-child {
    text-align: right;
    padding-right: 0;
  }

  @media (max-width: 480px) {
    padding: 16px 12px 16px 0; /* Tighter padding for mobile */
  }
`;

const Tr = styled(motion.tr)`
  border-bottom: 1px solid rgba(229, 192, 123, 0.1);
  transition: background 0.3s ease;
  &:hover {
    background: rgba(229, 192, 123, 0.03);
  }
`;

const ActionWrapper = styled.div`
  margin-top: auto;
  padding-top: 40px;

  @media (max-width: 480px) {
    padding-top: 24px;
    display: flex;
    flex-direction: column; /* Stacks button nicely */
  }
`;

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Dashboard() {
  const { results, rawText, totalScanned } = useParser();
  const navigate = useNavigate();

  const activeResults = results.filter(r => !r.excluded);
  const totalRiba = activeResults.reduce((sum, r) => sum + (r.amount || 0), 0);
  const recent = activeResults.slice(0, 3);
  const isEmpty = totalRiba === 0 && activeResults.length === 0;

  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

  return (
    <PageWrapper> 
      <AmbientGlow />
      <ContentZ>  
        
        {isEmpty ? (
            <EmptyContainer initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <GeometricIcon />
            <EmptyTitle>Your Ledger Awaits</EmptyTitle>
            <EmptyText>
              Wealth is a trust. Keeping it pure is an act of mindfulness. 
              Initialize your ledger to identify any non-compliant earnings and begin your purification journey.
            </EmptyText>
            <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center', padding: '0 16px' }}>
              <ActionBtn whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/upload')}>
                Initialize Ledger
              </ActionBtn>
            </div>
          </EmptyContainer>
        ) : results.length === 0 ? (
          <EmptyContainer initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <GeometricIcon />
            <EmptyTitle>No Riba Detected</EmptyTitle>
            <EmptyText>
              We scanned your last statement and did not find any lines matching the current interest/Riba patterns.
              You can adjust the detector keywords later if your bank uses different wording.
            </EmptyText>
            <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center', padding: '0 16px' }}>
              <ActionBtn whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/upload')}>
                Scan Another Statement
              </ActionBtn>
            </div>
          </EmptyContainer>
        ) : (
          <Grid variants={containerVariants} initial="hidden" animate="show">
            
            {/* Main Riba Card */}
            <MainCard variants={cardVariants} className="arch">
              <Title>Total Riba Identified</Title>
              <BigAmount>{formatter.format(totalRiba)}</BigAmount>
              <div style={{ marginTop: 12, color: '#8C9A8E', fontSize: '1rem', fontWeight: 300 }}>
                Accumulated across parsed statements. Ready for purification.
              </div>
              <ActionWrapper>
                <ActionBtn whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/purify')}>
                  Purify Wealth Now
                </ActionBtn>
              </ActionWrapper>
            </MainCard>

            {/* Analysis Summary */}
            <Card variants={cardVariants}>
              <Title>Analysis Summary</Title>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '16px' }}>
                <BigAmount style={{ marginTop: 0 }}>
                  {totalScanned || 0}
                </BigAmount>
                <span style={{ fontSize: '1.1rem', color: '#8C9A8E', fontWeight: 300 }}>
                  lines scanned
                </span>
              </div>
              
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', color: totalRiba > 0 ? '#E5C07B' : '#00DF81', fontWeight: 500 }}>
                <div style={{ 
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  backgroundColor: totalRiba > 0 ? '#E5C07B' : '#00DF81', 
                  boxShadow: `0 0 12px ${totalRiba > 0 ? '#E5C07B' : '#00DF81'}` 
                }} />
                {totalRiba > 0 
                  ? `${activeResults.length} entries flagged` 
                  : 'Ledger is 100% clean'}
              </div>
              
              <ActionWrapper style={{ paddingTop: '32px' }}>
                <Link to="/ledger" style={{ color: '#E5C07B', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, borderBottom: '1px solid rgba(229,192,123,0.3)', paddingBottom: '4px', transition: 'border-color 0.3s', display: 'inline-block' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#E5C07B'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(229,192,123,0.3)'}>
                  View Detailed Ledger →
                </Link>
              </ActionWrapper>
            </Card>

            {/* Recent Transactions Table */}
            <TableCard variants={cardVariants}>
              <Title style={{ marginBottom: '24px' }}>Recent Flagged Entries</Title>
              <TableWrapper>
                <StyledTable>
                  <thead>
                    <tr>
                      <Th>Date</Th>
                      <Th>Description</Th>
                      <Th>Amount</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r, i) => (
                      <Tr 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                      >
                        <Td style={{ color: '#A1A1AA', whiteSpace: 'nowrap' }}>{r.date || 'Unknown'}</Td>
                        <Td style={{ color: '#F4F4F5' }}>{r.description}</Td>
                        <Td style={{ color: '#E5C07B', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                          {formatter.format(r.amount)}
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </StyledTable>
              </TableWrapper>
            </TableCard>
            
          </Grid>
        )}
      </ContentZ>
    </PageWrapper>
  );
}