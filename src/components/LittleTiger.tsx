'use client';
import styles from './LittleTiger.module.css';

export default function LittleTiger({ size = 100, loading = false }: { size?: number, loading?: boolean }) {
  return (
    <div className={styles.tigerContainer} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className={`${styles.tigerSvg} ${loading ? styles.animating : ''}`}>
        {/* Heraldic Minimalist Tiger - Geometric Style */}
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B69131" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B69131" />
          </linearGradient>
        </defs>

        {/* Head Shell */}
        <path 
          d="M50 15 L25 35 L25 55 L50 85 L75 55 L75 35 Z" 
          fill="url(#goldGrad)" 
          className={styles.headOutline}
        />
        
        {/* Facial Geometric Accents */}
        <path d="M50 15 L35 30 L65 30 Z" fill="rgba(0,0,0,0.1)" />
        <path d="M25 35 L50 50 L75 35" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        
        {/* Eyes - Sharp/Futuristic */}
        <path d="M38 42 L45 42 L42 46 Z" fill="#0A1128" className={styles.eye} />
        <path d="M62 42 L55 42 L58 46 Z" fill="#0A1128" className={styles.eye} />

        {/* Stripes - Stylized Minimalist */}
        <path d="M25 45 H35 M65 45 H75 M50 20 V28" stroke="#0A1128" strokeWidth="2" strokeLinecap="round" />
        
        {/* Crown Accent */}
        <path d="M45 12 L50 8 L55 12" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
      </svg>
      {loading && <div className={styles.executivePulse}></div>}
    </div>
  );
}
