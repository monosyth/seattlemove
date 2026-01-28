import { createTheme } from '@mui/material/styles';

// Seattle Move color palette - Vibrant Ocean Blues Theme
const colors = {
  // Primary ocean blues
  pacificBlue: '#1e5a8e',      // Deep Pacific Ocean blue
  pugetSound: '#2968a3',        // Puget Sound mid-blue
  skyBlue: '#4a90e2',           // Seattle sky blue
  seafoam: '#6ba8c9',           // Light seafoam blue

  // Deep water tones
  deepOcean: '#154163',         // Deep navy ocean
  midnight: '#0d2d44',          // Midnight water
  abyss: '#0a1f33',             // Deep sea abyss

  // Vibrant teals & turquoise
  teal: '#2b9298',              // Pacific teal
  turquoise: '#1abc9c',         // Tropical turquoise
  aqua: '#52b5bf',              // Bright aqua
  cyan: '#00d4ff',              // Electric cyan
  aquamarine: '#7fffd4',        // Bright aquamarine

  // Tropical & reef colors
  coral: '#ff8c69',             // Coral accent
  coralPink: '#ff6b9d',         // Pink coral
  starfish: '#ff7f50',          // Starfish orange
  sunrise: '#ffa366',           // Sunset over water
  golden: '#ffd700',            // Golden hour

  // Bioluminescent & glow effects
  bioluminescent: '#00ffff',    // Glowing cyan
  neonBlue: '#1e90ff',          // Electric blue
  glowGreen: '#39ff14',         // Bioluminescent green

  // Greens & kelp
  seaweed: '#2ecc71',           // Kelp green
  emerald: '#27ae60',           // Emerald water
  complete: '#2da771',          // Ocean green for complete
  jade: '#00a86b',              // Jade green

  // Neutrals - sand and stone
  charcoal: '#2c3e50',          // Dark charcoal
  slate: '#5f6c7b',             // Slate gray
  driftwood: '#8b9ba8',         // Light driftwood gray
  sand: '#e8eff5',              // Sandy beach
  cloud: '#f0f4f8',             // Cloud white
  fog: '#f8fafb',               // Morning fog
  mist: '#e5edf3',              // Ocean mist
  pearl: '#f5f5f5',             // Pearl white

  // Legacy names for compatibility
  evergreen: '#1e5a8e',         // Map to pacificBlue
  forest: '#154163',            // Map to deepOcean
  sage: '#6ba8c9',              // Map to seafoam
  moss: '#52b5bf',              // Map to aqua
  salmon: '#ff8c69',            // Map to coral
  terracotta: '#ffa366',        // Map to sunrise
  mountain: '#2c3e50',          // Map to charcoal
  deepBlue: '#0d2d44',          // Map to midnight
  skyBlue: '#4a90e2',           // Keep skyBlue
  goldenHour: '#ffd89b',        // Sunset reflection
  paleBlue: '#d4e6f5',          // Pale water
  duskBlue: '#1a4d6f',          // Dusk over water
  white: '#ffffff',             // Pure white
  rain: '#94c5d9',              // Rain over water
  bark: '#8b9ba8',              // → driftwood
  cedar: '#b8c5d1',             // Cedar tone
  wheat: '#e8d4b8',             // Wheat/sand
  honey: '#d4aa6a',             // Honey
  cream: '#faf7f2'              // Cream
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.pacificBlue,
      dark: colors.deepOcean,
      light: colors.seafoam,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.teal,
      dark: colors.pugetSound,
      light: colors.aqua,
      contrastText: '#ffffff',
    },
    success: {
      main: colors.complete,
    },
    error: {
      main: colors.coral,
    },
    warning: {
      main: colors.sunrise,
    },
    info: {
      main: colors.skyBlue,
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
