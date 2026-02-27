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
  padding-top: 40px;
  /* padding-bottom: 4rem; */
  background-color: transparent;
  position: relative;
  overflow: hidden;
  color: #F4F4F5;
  font-family: 'Outfit', sans-serif;
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
`;

const ContentZ = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// Advanced Beveled Glassmorphism Card
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

  &.arch {
    /* Enhanced Modern Islamic Arch */
    border-radius: 100px 100px 32px 32px;
    padding-left: 40px;
    border-top: 1px solid rgba(229, 192, 123, 0.25);
    background: linear-gradient(145deg, rgba(22, 34, 28, 0.7) 0%, rgba(10, 15, 13, 0.95) 100%);
    box-shadow: 
      0 50px 100px rgba(0, 0, 0, 0.5), 
      inset 0 1px 0 rgba(229, 192, 123, 0.1);
  }
`;

const Title = styled.div`
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  color: #8C9A8E;
  font-size: 0.95rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const BigAmount = styled.div`
  margin-top: 16px;
  font-size: 4rem;
  font-family: 'Satoshi', 'Outfit', sans-serif;
  font-weight: 600;
  letter-spacing: -1px;
  
  /* Metallic Gold Gradient Text */
  background: linear-gradient(135deg, #F4F4F5 0%, #E5C07B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 4px 20px rgba(229, 192, 123, 0.15);
`;

const HalalAmount = styled(BigAmount)`
  font-size: 3rem;
  /* Metallic Silver Gradient Text */
  background: linear-gradient(135deg, #FFFFFF 0%, #A1A1AA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 20px rgba(255, 255, 255, 0.05);
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
`;

const SecondaryAction = styled(motion.button)`
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.03);
  color: #E5C07B;
  border: 1px solid rgba(229, 192, 123, 0.2);
  border-radius: 999px;
  font-weight: 500;
  font-size: 1.05rem;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(229, 192, 123, 0.08);
    border-color: rgba(229, 192, 123, 0.4);
  }
`;

// --- EMPTY STATE STYLING ---
const EmptyContainer = styled(motion.div)`
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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
`;

const EmptyTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 500;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #F4F4F5 0%, #E5C07B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const EmptyText = styled.p`
  color: #8C9A8E;
  max-width: 480px;
  line-height: 1.7;
  font-size: 1.15rem;
  font-weight: 300;
  margin-bottom: 48px;
`;

// --- TABLE STYLING ---
const Tr = styled(motion.tr)`
  border-bottom: 1px solid rgba(229, 192, 123, 0.1);
  transition: background 0.3s ease;
  &:hover {
    background: rgba(229, 192, 123, 0.03);
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

  // Respect exclusions from the ledger across the whole app
  const activeResults = results.filter(r => !r.excluded);
  const totalRiba = activeResults.reduce((sum, r) => sum + (r.amount || 0), 0);
  const recent = activeResults.slice(0, 3);
  const hasScan = !!rawText;
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
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <ActionBtn whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/upload')}>
                Initialize Ledger
              </ActionBtn>
              
            </div>
          </EmptyContainer>
        ) : results.length === 0 ? (
          // We have scanned, but no Riba was detected
          <EmptyContainer initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <GeometricIcon />
            <EmptyTitle>No Riba Detected</EmptyTitle>
            <EmptyText>
              We scanned your last statement and did not find any lines matching the current interest/Riba patterns.
              You can adjust the detector keywords later if your bank uses different wording.
            </EmptyText>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <ActionBtn whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/upload')}>
                Scan Another Statement
              </ActionBtn>
            </div>
          </EmptyContainer>
        ) : (
          <Grid variants={containerVariants} initial="hidden" animate="show">
            
            {/* Main Riba Card (Spans 2 cols) */}
            <Card variants={cardVariants} className="arch" style={{ gridColumn: 'span 2' }}>
              <Title>Total Riba Identified</Title>
              <BigAmount>{formatter.format(totalRiba)}</BigAmount>
              <div style={{ marginTop: 12, color: '#8C9A8E', fontSize: '1rem', fontWeight: 300 }}>
                Accumulated across parsed statements. Ready for purification.
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                <ActionBtn whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/purify')}>
                  Purify Wealth Now
                </ActionBtn>
              </div>
            </Card>

            {/* Halal Principal Card */}
            {/* <Card variants={cardVariants}>
              <Title>Halal Principal</Title>
              <HalalAmount>{formatter.format(totalScanned)}</HalalAmount>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', color: '#00DF81', fontWeight: 500 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00DF81', boxShadow: '0 0 12px #00DF81' }} />
                100% Purified Status
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                <Link to="/ledger" style={{ color: '#E5C07B', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, borderBottom: '1px solid rgba(229,192,123,0.3)', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#E5C07B'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(229,192,123,0.3)'}>
                  View Detailed Ledger →
                </Link>
              </div>
            </Card> */}

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
                  width: 8, height: 8, borderRadius: '50%', 
                  backgroundColor: totalRiba > 0 ? '#E5C07B' : '#00DF81', 
                  boxShadow: `0 0 12px ${totalRiba > 0 ? '#E5C07B' : '#00DF81'}` 
                }} />
                {totalRiba > 0 
                  ? `${activeResults.length} entries flagged for review` 
                  : 'Ledger is 100% clean'}
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                <Link to="/ledger" style={{ color: '#E5C07B', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, borderBottom: '1px solid rgba(229,192,123,0.3)', paddingBottom: '4px', transition: 'border-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#E5C07B'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(229,192,123,0.3)'}>
                  View Detailed Ledger →
                </Link>
              </div>
            </Card>

            {/* Recent Transactions Table */}
            <Card variants={cardVariants} style={{ gridColumn: '1 / -1', padding: '32px' }}>
              <Title style={{ marginBottom: '24px' }}>Recent Flagged Entries</Title>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                  <thead>
                    <tr style={{ color: '#8C9A8E', textAlign: 'left', borderBottom: '1px solid rgba(229, 192, 123, 0.2)' }}>
                      <th style={{ padding: '0 20px 20px 0', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Date</th>
                      <th style={{ padding: '0 20px 20px 0', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Description</th>
                      <th style={{ padding: '0 0 20px 0', fontWeight: 500, textAlign: 'right', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Amount</th>
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
                        <td style={{ padding: '20px 20px 20px 0', color: '#A1A1AA' }}>{r.date || 'Unknown'}</td>
                        <td style={{ padding: '20px 20px 20px 0', color: '#F4F4F5' }}>{r.description}</td>
                        <td style={{ padding: '20px 0 20px 0', color: '#E5C07B', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                          {formatter.format(r.amount)}
                        </td>
                      </Tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            
          </Grid>
        )}
      </ContentZ>
    </PageWrapper>
  );
}