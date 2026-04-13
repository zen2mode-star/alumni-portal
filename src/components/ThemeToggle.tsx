'use client';
import { useTheme } from './ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle Theme"
      style={{
        background: 'transparent',
        border: '1px solid var(--card-border)',
        padding: '0.4rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1.2rem'
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
