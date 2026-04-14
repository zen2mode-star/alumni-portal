'use client';
import Link from 'next/link';
import styles from './CyberLanding.module.css';

export default function CyberLanding() {
  return (
    <section className={styles.hero}>
      {/* Ambient glow effects */}
      <div className={styles.glowOrb1}></div>
      <div className={styles.glowOrb2}></div>
      
      <div className={styles.content}>
        {/* Logo */}
        <img 
          src="/btkit-logo.png" 
          alt="BTKIT Logo" 
          className={styles.institutionLogo}
        />

        {/* Live Tag */}
        <div className={styles.liveTag}>
          <span className={styles.liveDot}></span>
          BTKIT Alumni Network — Now Live
        </div>

        {/* Hero Typography */}
        <h1 className={styles.headline}>
          Connect with Alumni{'\n'}
          Who've <span className={styles.gradientWord}>Been There.</span>
        </h1>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          Bridge the gap between students and graduates. Find mentors,
          <br />
          explore careers, and build connections that actually matter.
        </p>

        {/* CTA Buttons */}
        <div className={styles.cta}>
          <Link href="/directory" className={styles.primaryBtn}>
            Browse Alumni →
          </Link>
          <Link href="/register" className={styles.outlineBtn}>
            Register as Alumni
          </Link>
        </div>

        {/* Stats Row */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>1991</span>
            <span className={styles.statLabel}>Est. Year</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNum}>BTKIT</span>
            <span className={styles.statLabel}>Dwarahat</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statNum}>∞</span>
            <span className={styles.statLabel}>Connections</span>
          </div>
        </div>
      </div>
    </section>
  );
}
