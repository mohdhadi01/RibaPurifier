import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 2rem;
`;

const CircleWrap = styled.div`
  width: 120px;
  height: 120px;
  display: grid;
  place-items: center;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  transform-origin: 50% 50%;
  animation: ${rotate} 3s linear infinite;
`;

const Glow = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  filter: blur(20px);
  opacity: 0.08;
  background: radial-gradient(circle at 30% 30%, ${({ theme }) => theme.colors.accentPrimary}, transparent 30%),
              radial-gradient(circle at 70% 70%, ${({ theme }) => theme.colors.accentSuccess}, transparent 30%);
  border-radius: 9999px;
`;

const Label = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const Sub = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const Processing: React.FC<{ message?: string }> = ({ message = 'Analyzing Transactions...' }) => {
  const theme: any = useTheme();
  return (
    <Wrapper>
      <div style={{ position: 'relative' }}>
        <Glow />
        <CircleWrap>
          <Svg viewBox="0 0 100 100" role="img" aria-label="Processing">
            <defs>
              <linearGradient id="g" x1="0%" x2="100%">
                <stop offset="0%" stopColor={theme.colors.accentSuccess} />
                <stop offset="100%" stopColor={theme.colors.accentPrimary} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="url(#g)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="169"
              strokeDashoffset="56"
            />
            <circle cx="50" cy="50" r="6" fill="#fff" stroke="url(#g)" strokeWidth="2" />
          </Svg>
        </CircleWrap>
      </div>
      <Label>{message}</Label>
      <Sub>Please wait while we scan your statement for interest charges.</Sub>
    </Wrapper>
  );
};

export default Processing;

