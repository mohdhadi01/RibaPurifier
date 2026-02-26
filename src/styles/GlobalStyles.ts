import { createGlobalStyle } from 'styled-components';
import theme from './Theme';

// subtle grain/noise SVG (tiny tile)
const noiseSvg = encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
  <filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter>
  <rect width='100%' height='100%' filter='url(#n)' opacity='0.02' fill='#000'/>
</svg>
`);

const GlobalStyles = createGlobalStyle`
  /* Fonts: Outfit (UI), Playfair Display & Amiri (headings) */
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Playfair+Display:wght@400;600;700&family=Amiri&display=swap');

  :root {
    --bg: ${theme.colors.background};
    --surface: ${theme.colors.surface};
    --surface-border: ${theme.colors.surfaceBorder};
    --accent: ${theme.colors.accentPrimary};
    --accent-2: ${theme.colors.accentAlt};
    --accent-secondary: ${theme.colors.accentSecondary};
    --text: ${theme.colors.textPrimary};
    --muted: ${theme.colors.textSecondary};
  }

  *,*::before,*::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }

  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: ${theme.fonts.ui};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    overflow-x: hidden;
  }

  /* Noise layer for tactile feel */
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml;utf8,${noiseSvg}");
    background-repeat: repeat;
    opacity: ${theme.effects.noiseOpacity};
    pointer-events: none;
    z-index: 0;
    mix-blend-mode: overlay;
  }

  /* Ambient orb / spiritual glow */
  body::after {
    content: "";
    position: fixed;
    left: 8%;
    top: 6%;
    width: ${theme.effects.orbSize}px;
    height: ${theme.effects.orbSize}px;
    background: radial-gradient(circle at 30% 30%, ${theme.colors.accentPrimary}, transparent 35%);
    opacity: ${theme.effects.orbOpacity};
    filter: blur(80px);
    z-index: 0;
    pointer-events: none;
  }
  
  /* slow ambient pulse for orb */
  @keyframes orbPulse {
    0% { transform: scale(0.98); opacity: ${theme.effects.orbOpacity}; }
    50% { transform: scale(1.02); opacity: ${theme.effects.orbOpacity * 1.2}; }
    100% { transform: scale(0.98); opacity: ${theme.effects.orbOpacity}; }
  }
  body::after {
    animation: orbPulse 10s ease-in-out infinite;
    transform-origin: center;
  }

  /* Base surface / card defaults (glassmorphism dark) */
  .card, .app-container > * {
    position: relative;
    z-index: 1;
  }

  h1,h2,h3,h4 {
    font-family: ${theme.fonts.heading};
    color: var(--text);
    margin: 0;
  }

  p { color: var(--muted); line-height: 1.6; }

  /* Numeric styling for balances */
  .numeric, .amount, .big-amount {
    font-family: ${theme.fonts.ui};
    font-variant-numeric: tabular-nums;
    -webkit-font-feature-settings: "tnum" 1, "lnum" 1;
    font-feature-settings: "tnum" 1, "lnum" 1;
  }

  a { color: inherit; text-decoration: none; }

  /* Buttons */
  button, a {
    transition: all 0.28s ease;
    font-family: ${theme.fonts.ui};
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 18px;
    background: linear-gradient(180deg, var(--accent), var(--accent-2));
    color: #0A0F0D;
    border-radius: 999px;
    border: 1px solid rgba(229,192,123,0.12);
    box-shadow: 0 0 20px rgba(229,192,123,0.15);
    cursor: pointer;
  }
  .btn-primary:hover {
    transform: scale(1.02);
    filter: brightness(0.98);
  }

  /* Arch utility for hero / prominent cards */
  .arch {
    border-top-left-radius: ${theme.radii.archTop};
    border-top-right-radius: ${theme.radii.archTop};
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  /* Surface utility (dark glass) */
  .surface {
    background: rgba(18,28,23,0.6);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(229,192,123,0.10);
    border-radius: ${theme.radii.md};
    box-shadow: ${theme.effects.cardShadow};
  }

  /* Divider gradient */
  .divider {
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent, rgba(229,192,123,0.12), transparent);
    opacity: 0.8;
  }
`;

export default GlobalStyles;

