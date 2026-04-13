export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import LittleTiger from '@/components/LittleTiger';
import styles from './page.module.css';

const prisma = new PrismaClient();

export default async function Home() {
  const alumniCount = await prisma.user.count({ where: { role: 'ALUMNI', status: 'APPROVED' } });

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.badge}>Institutional Pride • Alumni Network</div>
          <h1 className="animate-pop">Generations of Excellence <span className={styles.goldText}>United.</span></h1>
          <p className={styles.heroDesc}>
            Step into the official professional ecosystem of KecAlumini.in. 
            Forge strategic connections, access elite career pathways, 
            and elevate our shared heritage.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/directory" className="btn btn-primary">Enter Directory</Link>
            <Link href="/register" className="btn btn-glass">Join the Legacy ➔</Link>
          </div>
        </div>
        <div className={styles.heroMascot}>
          <div className={styles.mascotAura}>
            <LittleTiger size={220} />
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featCard}>
          <div className={styles.featIcon}>🏛️</div>
          <h3>The Vault</h3>
          <p>Strict institutional verification ensures you only engage with certified members of our global network.</p>
        </div>
        <div className={styles.featCard}>
          <div className={styles.featIcon}>⚔️</div>
          <h3>Career Arsenal</h3>
          <p>Exclusive executive-level job boards and direct mentorship lanes from Microsoft to McKinsey.</p>
        </div>
        <div className={styles.featCard}>
          <div className={styles.featIcon}>🎗️</div>
          <h3>Heritage Access</h3>
          <p>Unlock private networking events and university forums designed for lifelong strategic growth.</p>
        </div>
      </section>

      <div className={styles.statsStrip}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{alumniCount}</span>
          <span className={styles.statLabel}>Verified Alumni</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>100%</span>
          <span className={styles.statLabel}>Institutional Integrity</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>24/7</span>
          <span className={styles.statLabel}>Global Connectivity</span>
        </div>
      </div>
    </main>
  );
}
