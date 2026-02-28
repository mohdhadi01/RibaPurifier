import React, { useCallback, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParser } from '../context/ParserContext';
import Processing from '../components/Processing';

const shine = keyframes`
  0% { left: -100%; }
  20% { left: 100%; }
  100% { left: 100%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 20px rgba(229, 192, 123, 0.05); border-color: rgba(229, 192, 123, 0.3); }
  50% { box-shadow: 0 0 50px rgba(229, 192, 123, 0.25); border-color: #E5C07B; }
  100% { box-shadow: 0 0 20px rgba(229, 192, 123, 0.05); border-color: rgba(229, 192, 123, 0.3); }
`;

// --- STYLING (Ultra-Premium Midnight Oasis) ---
const PageWrapper = styled.div`
  min-height: calc(100vh - 80px);
  padding: 60px 1.5rem 40px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Outfit', sans-serif;
  color: #F4F4F5;
  position: relative;

  @media (max-width: 768px) {
    padding: 56px 1.25rem 32px;
  }

  @media (max-width: 480px) {
    padding: 52px 1rem 28px;
  }
`;

// Ambient glow directly behind the drop zone
const AmbientGlow = styled.div`
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(229, 192, 123, 0.06) 0%, rgba(10, 15, 13, 0) 70%);
  z-index: -1;
  pointer-events: none;

  @media (max-width: 768px) {
    width: 520px;
    height: 380px;
    top: 12%;
  }

  @media (max-width: 480px) {
    width: 420px;
    height: 320px;
    top: 10%;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3.5rem;
  z-index: 1;

  @media (max-width: 768px) {
    margin-bottom: 2.75rem;
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
    font-size: 2.4rem;
  }

  @media (max-width: 480px) {
    font-size: 2.1rem;
  }
`;

const Subtitle = styled.p`
  color: #8C9A8E;
  font-size: 1.15rem;
  max-width: 520px;
  line-height: 1.6;
  margin: 0 auto;
  font-weight: 300;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// --- DRAG AND DROP ZONE ---
const DropZone = styled(motion.div)<{ $isDragActive: boolean; $hasFile: boolean }>`
  width: 100%;
  max-width: 680px;
  min-height: 360px;
  
  /* Beveled Glassmorphism */
  background: linear-gradient(145deg, rgba(18, 28, 23, 0.5) 0%, rgba(10, 15, 13, 0.8) 100%);
  backdrop-filter: blur(24px) saturate(120%);
  -webkit-backdrop-filter: blur(24px) saturate(120%);
  border-radius: 32px;
  border: 2px dashed rgba(229, 192, 123, 0.15);
  
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.4), 
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    inset 0 -1px 0 rgba(229, 192, 123, 0.05);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${({ $isDragActive }) => ($isDragActive ? pulseGlow : 'none')} 2s infinite ease-in-out;

  &:hover {
    border-color: rgba(229, 192, 123, 0.5);
    background: linear-gradient(145deg, rgba(22, 34, 28, 0.6) 0%, rgba(10, 15, 13, 0.9) 100%);
    transform: translateY(-4px);
    box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 768px) {
    min-height: 300px;
    padding: 28px 24px;
    border-radius: 28px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    min-height: 260px;
    padding: 24px 18px;
    border-radius: 24px;
  }
`;

const IconWrapper = styled.div<{ $isDragActive: boolean }>`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: ${({ $isDragActive }) => ($isDragActive ? 'rgba(229, 192, 123, 0.15)' : 'rgba(229, 192, 123, 0.03)')};
  border: 1px solid rgba(229, 192, 123, ${({ $isDragActive }) => ($isDragActive ? '0.5' : '0.1')});
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  transition: all 0.4s ease;
  color: ${({ $isDragActive }) => ($isDragActive ? '#E5C07B' : '#8C9A8E')};
  animation: ${float} 4s ease-in-out infinite;

  svg {
    width: 36px;
    height: 36px;
  }

  @media (max-width: 480px) {
    width: 72px;
    height: 72px;

    svg {
      width: 30px;
      height: 30px;
    }
  }
`;

const DropText = styled.div`
  font-size: 1.35rem;
  font-weight: 500;
  color: #F4F4F5;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
`;

const DropSubText = styled.div`
  font-size: 1rem;
  color: #8C9A8E;
  font-weight: 300;
`;

// --- FILE VERIFIED STATE ---
const VerifiedCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const CheckIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E5C07B 0%, #C99E52 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0A0F0D;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 10px 30px rgba(229, 192, 123, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.5);
`;

const FileName = styled.div`
  font-size: 1.2rem;
  color: #E5C07B;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

// --- LUXURY BUTTONS ---
const ActionBtn = styled(motion.button)`
  position: relative;
  margin-top: 24px;
  padding: 14px 32px;
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

// --- PASSWORD MODAL ---
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 13, 0.6);
  backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalCard = styled(motion.div)`
  background: linear-gradient(145deg, rgba(20, 30, 25, 0.9) 0%, rgba(15, 20, 18, 0.95) 100%);
  border: 1px solid rgba(229, 192, 123, 0.15);
  border-radius: 28px;
  padding: 40px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
`;

const ModalTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem;
  color: #F4F4F5;
  margin: 0 0 12px 0;
  font-weight: 500;
  background: linear-gradient(135deg, #F4F4F5 0%, #E5C07B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ModalText = styled.p`
  color: #8C9A8E;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 28px;
`;

const PasswordInput = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(229, 192, 123, 0.1);
  color: #E5C07B;
  padding: 16px 20px;
  border-radius: 16px;
  font-size: 1.1rem;
  font-family: 'Outfit', sans-serif;
  letter-spacing: 2px;
  margin-bottom: 8px;
  box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(140, 154, 142, 0.5);
    letter-spacing: normal;
  }

  &:focus {
    outline: none;
    border-color: rgba(229, 192, 123, 0.5);
    background: rgba(0, 0, 0, 0.6);
  }
`;

const ErrorText = styled.div`
  color: #EF4444; 
  font-size: 0.9rem;
  margin-bottom: 20px;
  height: 20px;
  font-weight: 500;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`;

const BtnCancel = styled.button`
  background: transparent;
  color: #8C9A8E;
  border: none;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s;
  font-family: 'Outfit', sans-serif;

  &:hover {
    background: rgba(140, 154, 142, 0.1);
    color: #F4F4F5;
  }
`;

const ModalLoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(10, 15, 13, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export default function Upload() {
  const { results, parsing, passwordRequired, passwordError, rawText, parseFile, submitPassword, cancelPassword } = useParser();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isUnlockLoading, setIsUnlockLoading] = useState(false);
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  const showLoading = isScanning || parsing;

  const minLoadingMs = 1800;

  const handleUnlockWithPassword = useCallback(async () => {
    if (!pw.trim()) return;
    setIsUnlockLoading(true);
    const minDelay = new Promise((r) => setTimeout(r, minLoadingMs));
    try {
      await Promise.all([submitPassword(pw), minDelay]);
    } finally {
      setIsUnlockLoading(false);
    }
  }, [pw, submitPassword]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFileName(f.name);
    setIsScanning(true);

    // Ensure loading UI has time to paint before we start heavy work
    await new Promise((r) => setTimeout(r, 100));

    const minLoadingMs = 3800;
    const minDelay = new Promise((r) => setTimeout(r, minLoadingMs));

    try {
      await Promise.all([parseFile(f), minDelay]);
    } finally {
      setIsScanning(false);
    }
  }, [parseFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  return (
    <PageWrapper>
      <AmbientGlow />
      <Header>
        <Title>Upload Statement</Title>
        <Subtitle>Securely scan your bank statement. Processing happens entirely locally on your device.</Subtitle>
      </Header>

      <div {...getRootProps()} style={{ width: '100%', display: 'flex', justifyContent: 'center', outline: 'none' }}>
        <input {...getInputProps()} />
        <DropZone
          $isDragActive={isDragActive}
          $hasFile={!!fileName}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {!fileName ? (
              <motion.div
                key="drop-prompt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <IconWrapper $isDragActive={isDragActive}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </IconWrapper>
                <DropText>Drag & Drop your statement</DropText>
                <DropSubText>or click to browse PDF files</DropSubText>
              </motion.div>
            ) : showLoading ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Processing fileName={fileName} />
              </motion.div>
            ) : (
              <VerifiedCard
                key="verified"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <CheckIcon>✓</CheckIcon>
                <FileName>{fileName}</FileName>
                <div style={{ color: '#8C9A8E', fontSize: '1rem', fontWeight: 300, maxWidth: 420, textAlign: 'center' }}>
                  Statement analyzed securely. We detected{' '}
                  <strong style={{ color: '#F4F4F5', fontWeight: 500 }}>{results.length}</strong> potential interest/Riba transaction{results.length === 1 ? '' : 's'}.
                </div>
                {rawText && (
                  <ActionBtn
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/dashboard');
                    }}
                  >
                    View insights
                  </ActionBtn>
                )}
              </VerifiedCard>
            )}
          </AnimatePresence>
        </DropZone>
      </div>

      {/* Debug view removed for production */}

      {/* PASSWORD PROMPT MODAL (simple wrapper around pdfjs password handling) */}
      <AnimatePresence>
        {passwordRequired  && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ModalCard
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative' }}
            >
              <ModalTitle>PDF Password Required</ModalTitle>
              <ModalText>
                This statement is encrypted by your bank. Enter the password so we can read it locally.
              </ModalText>

              <PasswordInput
                type="password"
                placeholder="Enter PDF password..."
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUnlockWithPassword();
                  }
                }}
                autoFocus
              />
              <ErrorText>{passwordError || ''}</ErrorText>

              <ModalButtonGroup>
                <BtnCancel
                  onClick={() => {
                    cancelPassword();
                    setPw('');
                    setFileName(null);
                    setIsScanning(false);
                  }}
                >
                  Cancel
                </BtnCancel>
                <ActionBtn
                  as="button"
                  style={{ marginTop: 0, padding: '12px 24px' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUnlockWithPassword()}
                >
                  Unlock File
                </ActionBtn>
              </ModalButtonGroup>

              {(isUnlockLoading || (parsing && passwordRequired)) && (
                <ModalLoadingOverlay>
                  <Processing fileName={fileName} />
                  <BtnCancel
                    onClick={() => {
                      cancelPassword();
                      setPw('');
                      setFileName(null);
                      setIsUnlockLoading(false);
                    }}
                    style={{ marginTop: 16 }}
                  >
                    Cancel
                  </BtnCancel>
                </ModalLoadingOverlay>
              )}
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}