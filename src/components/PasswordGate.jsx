import { useState } from 'react';
import { colors } from '../App.styles';
import seattleSkyline from '../assets/IMG_2953.jpeg';
import mtRainierView from '../assets/IMG_2981.jpeg';

export default function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'manifest2026') {
      sessionStorage.setItem('seattlemove_authenticated', 'true');
      onUnlock();
    } else {
      setError('Incorrect password');
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setError('');
      }, 820);
      setPassword('');
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Image */}
      <div style={styles.backgroundOverlay}>
        <img
          src={mtRainierView}
          alt="Seattle Background"
          style={styles.backgroundImage}
        />
      </div>

      {/* Login Card */}
      <div style={{...styles.loginCard, ...(isShaking ? styles.shake : {})}}>
        {/* Prominent Photo */}
        <div style={styles.photoContainer}>
          <img
            src={seattleSkyline}
            alt="Seattle Move"
            style={styles.photo}
          />
        </div>

        {/* Title */}
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>🏠</span>
          Seattle Move
        </h1>
        <p style={styles.subtitle}>Enter password to continue</p>

        {/* Password Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
            autoFocus
          />

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <button
            type="submit"
            style={styles.button}
            disabled={!password}
          >
            Unlock
          </button>
        </form>

        <div style={styles.footer}>
          <div style={styles.wave}>🌊</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${colors.deepOcean} 0%, ${colors.pacificBlue} 50%, ${colors.teal} 100%)`,
    padding: '20px',
    overflow: 'hidden'
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
    overflow: 'hidden'
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'blur(8px)',
    transform: 'scale(1.1)'
  },
  loginCard: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: `0 20px 60px rgba(0, 0, 0, 0.3),
                 0 0 100px rgba(${parseInt(colors.turquoise.slice(1, 3), 16)}, ${parseInt(colors.turquoise.slice(3, 5), 16)}, ${parseInt(colors.turquoise.slice(5, 7), 16)}, 0.2)`,
    backdropFilter: 'blur(10px)',
    border: `2px solid rgba(${parseInt(colors.turquoise.slice(1, 3), 16)}, ${parseInt(colors.turquoise.slice(3, 5), 16)}, ${parseInt(colors.turquoise.slice(5, 7), 16)}, 0.3)`,
    animation: 'fadeInUp 0.6s ease-out'
  },
  shake: {
    animation: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
  },
  photoContainer: {
    width: '100%',
    height: '200px',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '32px',
    boxShadow: `0 8px 24px rgba(30, 90, 142, 0.25)`,
    border: `3px solid ${colors.turquoise}`
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: colors.pacificBlue,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
  },
  titleIcon: {
    fontSize: '2.5rem',
    filter: 'drop-shadow(0 2px 4px rgba(30, 90, 142, 0.3))'
  },
  subtitle: {
    margin: '0 0 32px 0',
    fontSize: '1.1rem',
    color: colors.slate,
    textAlign: 'center',
    fontWeight: '500'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    padding: '16px 20px',
    fontSize: '1.1rem',
    border: `2px solid ${colors.mist}`,
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: 'white',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
    '::placeholder': {
      color: colors.driftwood
    },
    ':focus': {
      borderColor: colors.turquoise,
      boxShadow: `0 0 0 3px rgba(${parseInt(colors.turquoise.slice(1, 3), 16)}, ${parseInt(colors.turquoise.slice(3, 5), 16)}, ${parseInt(colors.turquoise.slice(5, 7), 16)}, 0.1)`
    }
  },
  error: {
    padding: '12px 16px',
    background: `${colors.coral}15`,
    color: colors.coral,
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    textAlign: 'center',
    border: `1px solid ${colors.coral}30`
  },
  button: {
    padding: '16px 32px',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'white',
    background: `linear-gradient(135deg, ${colors.pacificBlue} 0%, ${colors.teal} 100%)`,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 16px rgba(30, 90, 142, 0.3)`,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px rgba(30, 90, 142, 0.4)`
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none'
    }
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    paddingTop: '24px',
    borderTop: `1px solid ${colors.mist}`
  },
  wave: {
    fontSize: '2rem',
    animation: 'wave 2s ease-in-out infinite'
  }
};

// Add keyframes for animations
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }
    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }

  @keyframes wave {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(20deg);
    }
    75% {
      transform: rotate(-20deg);
    }
  }
`;

try {
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  // Animations will still work via inline styles
}
