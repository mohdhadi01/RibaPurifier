const theme = {
  colors: {
    background: '#0A0F0D', // Midnight Pine
    surface: '#121C17', // Obsidian Emerald
    surfaceBorder: '#1E2D24', // very faint border
    accentPrimary: '#E5C07B', // Soft Sand Gold (primary)
    accentAlt: '#D4AF37',
    accentSecondary: '#8C9A8E', // Muted Sage
    textPrimary: '#F4F4F5', // Off-white
    textSecondary: '#A1A1AA' // muted silver
  },
  spacing: {
    xs: '6px',
    sm: '12px',
    md: '20px',
    lg: '32px'
  },
  radii: {
    sm: '12px',
    md: '24px',
    lg: '32px',
    archTop: '120px'
  },
  fonts: {
    ui: "'Outfit', 'Satoshi', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    heading: "'Playfair Display', 'Cinzel', serif",
    arabicHeading: "'Amiri', serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace"
  },
  effects: {
    orbOpacity: 0.035,
    orbSize: 520,
    noiseOpacity: 0.03,
    cardShadow: '0 20px 40px rgba(0,0,0,0.25)'
  }
} as const;

export type Theme = typeof theme;
export default theme;

