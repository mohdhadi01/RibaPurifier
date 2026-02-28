import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { QRCodeSVG } from 'qrcode.react'; 
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParser } from '../context/ParserContext';

// --- ANIMATIONS ---
const shine = keyframes`
  0% { left: -100%; }
  20% { left: 100%; }
  100% { left: 100%; }
`;

// --- STYLING (Ultra-Premium Midnight Oasis) ---
const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 80px 0 4rem;
  background-color: transparent;
  color: #F4F4F5;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 72px 0 3.5rem;
  }

  @media (max-width: 480px) {
    padding: 64px 0 3rem;
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
  background: radial-gradient(ellipse, rgba(229, 192, 123, 0.06) 0%, rgba(10, 15, 13, 0) 70%);
  z-index: 0;
  pointer-events: none;
`;

const ContentZ = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1060px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 480px) {
    padding: 0 1.1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3.5rem;

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const Title = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
  /* Metallic Gradient Text */
  background: linear-gradient(135deg, #F4F4F5 0%, #E5C07B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 20px rgba(229, 192, 123, 0.15);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2.1rem;
  }
`;

const Subtitle = styled.p`
  color: #8C9A8E;
  font-size: 1.15rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 300;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// --- HIGHLIGHT CARD ---
const BalanceCard = styled(motion.div)`
  background: linear-gradient(145deg, rgba(18, 28, 23, 0.6) 0%, rgba(10, 15, 13, 0.9) 100%);
  backdrop-filter: blur(24px) saturate(120%);
  -webkit-backdrop-filter: blur(24px) saturate(120%);
  border: 1px solid rgba(229, 192, 123, 0.15);
  border-radius: 32px;
  padding: 32px;
  text-align: center;
  max-width: 440px;
  margin: 0 auto 4rem auto;
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.4), 
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  @media (max-width: 480px) {
    padding: 26px 22px;
    border-radius: 26px;
    margin-bottom: 3rem;
  }
`;

const BalanceLabel = styled.div`
  color: #8C9A8E;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.85rem;
  margin-bottom: 12px;
  font-weight: 500;
`;

const BalanceAmount = styled.div`
  font-size: 3.5rem;
  font-weight: 600;
  background: linear-gradient(to right, #E5C07B, #D4AF37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Satoshi', 'Outfit', sans-serif;
  font-variant-numeric: tabular-nums;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 2.6rem;
  }
`;

// --- CHARITY GRID ---
const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 22px;
  }
`;

const CharityCard = styled(motion.div)`
  background: linear-gradient(145deg, rgba(18, 28, 23, 0.4) 0%, rgba(10, 15, 13, 0.6) 100%);
  border: 1px solid rgba(229, 192, 123, 0.1);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;

  &:hover {
    background: linear-gradient(145deg, rgba(22, 34, 28, 0.6) 0%, rgba(10, 15, 13, 0.8) 100%);
    border-color: rgba(229, 192, 123, 0.4);
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 480px) {
    padding: 26px 22px;
    border-radius: 22px;
  }
`;

const CharityTitle = styled.h3`
  font-size: 1.3rem;
  color: #F4F4F5;
  margin: 0 0 12px 0;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const CharityDesc = styled.p`
  color: #8C9A8E;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 32px 0;
  flex-grow: 1;
  font-weight: 300;
`;

const DonateBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: transparent;
  color: #E5C07B;
  border: 1px solid rgba(229, 192, 123, 0.3);
  border-radius: 999px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Outfit', sans-serif;

  ${CharityCard}:hover & {
    background: #E5C07B;
    color: #0A0F0D;
    border-color: #E5C07B;
    box-shadow: 0 0 20px rgba(229, 192, 123, 0.2);
  }
`;

// --- MODAL STYLING ---
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 13, 0.7);
  backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalBody = styled(motion.div)`
  background: linear-gradient(145deg, rgba(20, 30, 25, 0.95) 0%, rgba(15, 20, 18, 0.98) 100%);
  border: 1px solid rgba(229, 192, 123, 0.15);
  padding: 48px 40px;
  border-radius: 32px;
  width: 100%;
  max-width: 460px;
  text-align: center;
  box-shadow: 0 50px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
`;

const QRWrapper = styled.div`
  background: #FFFFFF;
  padding: 24px;
  border-radius: 20px;
  display: inline-block;
  margin: 32px 0;
  box-shadow: 0 0 40px rgba(229, 192, 123, 0.15);
`;

const ActionBtn = styled.button`
  position: relative;
  width: 100%;
  padding: 16px;
  background: linear-gradient(180deg, #E5C07B 0%, #C99E52 100%);
  color: #0A0F0D;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  margin-bottom: 16px;
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
    transform: translateY(-2px);
  }
`;

const CancelBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: transparent;
  color: #8C9A8E;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;

  &:hover {
    color: #F4F4F5;
  }
`;

const SuccessText = styled(motion.div)`
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  background: linear-gradient(135deg, #E5C07B 0%, #D4AF37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
  font-weight: 500;
`;

// --- MOCK DATA ---
const charities = [
  { id: 'water', title: 'Build a Water Well', desc: 'Provide clean, safe drinking water to remote villages. A continuous charity (Sadaqah Jariyah).' },
  { id: 'orphans', title: 'Orphan Sponsorship', desc: 'Provide food, education, and shelter for orphaned children across the globe.' },
  { id: 'feed', title: 'Feed the Needy', desc: 'Distribute essential food parcels to families facing extreme hunger and poverty.' },
  { id: 'local', title: 'Local Zakat Fund', desc: 'Directly transfer to vetted local organizations handling wealth purification in your city.' }
];

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Purify() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [purified, setPurified] = useState(false);
  const { results, setResults } = useParser();

  const activeResults = results.filter(r => !r.excluded);
  const totalRiba = activeResults.reduce((sum, r) => sum + (r.amount || 0), 0);
  const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

  const handlePurify = () => {
    setCelebrate(true);
    setPurified(true);
    
    setTimeout(() => {
      setCelebrate(false);
      setResults([]);
      navigate('/dashboard');
    }, 5500);
  };

  return (
    <PageWrapper>
      <AmbientGlow />
      <ContentZ>
        <Header>
          <Title>Purify Your Wealth</Title>
          <Subtitle>
            Dispose of identified interest by giving it to charitable causes without the intention of seeking reward.
          </Subtitle>
        </Header>

        {totalRiba > 0 ? (
          <BalanceCard
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <BalanceLabel>Pending Purification</BalanceLabel>
            <BalanceAmount>{formatter.format(totalRiba)}</BalanceAmount>
          </BalanceCard>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', color: '#8C9A8E', marginBottom: '4rem', fontSize: '1.1rem', fontWeight: 300 }}
          >
            Your ledger is beautifully clear. No pending amounts to purify.
          </motion.div>
        )}

        <Grid variants={containerVariants} initial="hidden" animate="show">
          {charities.map((c) => (
            <CharityCard key={c.id} variants={itemVariants} onClick={() => setSelected(c)}>
              <CharityTitle>{c.title}</CharityTitle>
              <CharityDesc>{c.desc}</CharityDesc>
              <DonateBtn>Select Cause</DonateBtn>
            </CharityCard>
          ))}
        </Grid>

        <AnimatePresence>
          {selected && (
            <ModalBackdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => !purified && setSelected(null)}
            >
              <ModalBody
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {!purified ? (
                  <>
                    <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.75rem', margin: '0 0 12px 0', color: '#F4F4F5', fontWeight: 500 }}>
                      {selected.title}
                    </h3>
                    <p style={{ color: '#8C9A8E', fontSize: '1rem', margin: 0, fontWeight: 300, lineHeight: 1.5 }}>
                      Scan the code via your UPI or Banking App to securely transfer <strong style={{color: '#E5C07B', fontWeight: 500}}>{formatter.format(totalRiba)}</strong>
                    </p>
                    
                    <QRWrapper>
                      <QRCodeSVG 
                        value={`upi://pay?pa=charity@bank&pn=${encodeURIComponent(selected.title)}&am=${totalRiba}`} 
                        size={180} 
                        level="H"
                        includeMargin={false}
                      />
                    </QRWrapper>

                    <ActionBtn onClick={handlePurify}>I Have Donated This Amount</ActionBtn>
                    <CancelBtn onClick={() => setSelected(null)}>Cancel</CancelBtn>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
                    <SuccessText>Alhamdulillah</SuccessText>
                    <p style={{ color: '#8C9A8E', lineHeight: 1.7, fontSize: '1.05rem', fontWeight: 300 }}>
                      Your wealth has been purified. May your remaining balance be blessed and protected.
                    </p>
                    <div style={{ marginTop: '32px', fontSize: '0.9rem', color: '#5C6A60' }}>
                      Returning to your ledger...
                    </div>
                  </motion.div>
                )}
              </ModalBody>
            </ModalBackdrop>
          )}
        </AnimatePresence>

        {/* Themed Confetti! */}
        {celebrate && (
          <Confetti 
            recycle={false} 
            numberOfPieces={450} 
            gravity={0.12}
            colors={['#E5C07B', '#D4AF37', '#8C9A8E', '#F4F4F5']} // Gold, Sage, and White
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          />
        )}
      </ContentZ>
    </PageWrapper>
  );
}