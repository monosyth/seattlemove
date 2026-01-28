import { createTheme } from '@mui/material/styles';

// Seattle Move color palette
const colors = {
  // Primary greens
  evergreen: '#2d5a4a',
  forest: '#1e3d32',
  sage: '#7fa896',
  moss: '#5c8a72',

  // Secondary colors
  skyBlue: '#4a90e2',
  deepBlue: '#2563a8',
  salmon: '#e17b63',
  terracotta: '#c96a4f',

  // Neutrals
  charcoal: '#2c3e50',
  slate: '#5f6c7b',
  mountain: '#34495e',
  cloud: '#ecf0f1',
  fog: '#f8f9fa',
  mist: '#e0e7e9',

  // Status
  complete: '#27ae60'
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.evergreen,
      dark: colors.forest,
      light: colors.sage,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.skyBlue,
      dark: colors.deepBlue,
      contrastText: '#ffffff',
    },
    success: {
      main: colors.complete,
    },
    error: {
      main: colors.salmon,
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: colors.charcoal,
      secondary: colors.slate,
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.2rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.8rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: '0.9rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
