import { Global, css } from '@emotion/react';
import { theme } from './theme';

export const GlobalStyles = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html,
      body {
        font-family: ${theme.fonts.primary};
        background-color: ${theme.colors.background.primary};
        color: ${theme.colors.text.primary};
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      button {
        background: none;
        border: none;
        cursor: pointer;
        font-family: inherit;
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: ${theme.fonts.heading};
        font-weight: 600;
      }

      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }

      ::-webkit-scrollbar-track {
        background: ${theme.colors.background.secondary};
      }

      ::-webkit-scrollbar-thumb {
        background: ${theme.colors.background.glass};
        border-radius: ${theme.borderRadius.full};
      }

      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
      }

      /* Remove blue highlight on mobile tap */
      * {
        -webkit-tap-highlight-color: transparent;
      }
    `}
  />
);
