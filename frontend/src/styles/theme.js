export const theme = {
  layout: {
    maxWidth: '1200px',
    contentWidth: '1000px',
    sidebarWidth: '280px'
  },
  colors: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    accent: '#e94560',
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    background: {
      primary: '#0f0f1a',
      secondary: '#1a1a2e',
      glass: 'rgba(255, 255, 255, 0.1)',
      dark: '#0a0a14'
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.1)',
      glow: 'rgba(233, 69, 96, 0.5)'
    },
    warning: {
      text: '#ffd700',
      background: 'rgba(255, 215, 0, 0.1)'
    },
    success: {
      text: '#00ff95',
      background: 'rgba(0, 255, 149, 0.1)'
    },
    gradient: {
      rainbow: 'linear-gradient(90deg, #ff6b6b, #feca57, #1dd1a1, #00d2d3, #54a0ff)',
      glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    },
  },
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Space Grotesk', sans-serif",
  },
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '4rem',
  },
  transitions: {
    default: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
    fast: '0.15s ease-in-out',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
  },
  shadows: {
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    card: '0 4px 16px rgba(0, 0, 0, 0.2)',
    hover: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
};
