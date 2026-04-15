'use client';
import { TrendingUp, Building2, Globe, BarChart3 } from 'lucide-react';
import styles from './CareerInfographic.module.css';

interface StatProps {
  companies: { name: string, count: number }[];
  totalAlumni: number;
}

export default function CareerInfographic({ companies, totalAlumni }: StatProps) {
  return (
    <div className={styles.infographicBox}>
      <div className={styles.header}>
        <TrendingUp size={20} className={styles.trendIcon} />
        <div>
          <h3>KEC Career Ecosystem</h3>
          <p>Where our {totalAlumni} verified alumni are making an impact</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statLine}>
          <div className={styles.label}>
             <Building2 size={14} /> <span>Top Destinations</span>
          </div>
          <div className={styles.companyBar}>
            {companies.slice(0, 4).map((c, i) => (
              <div key={i} className={styles.companyChip} style={{ opacity: 1 - (i * 0.15) }}>
                {c.name}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.summaryBar}>
          <div className={styles.segment} style={{ width: '45%', background: 'var(--primary-color)' }}>
             Product Based (45%)
          </div>
          <div className={styles.segment} style={{ width: '35%', background: '#6D54E2' }}>
             Service (35%)
          </div>
          <div className={styles.segment} style={{ width: '20%', background: '#4B36B2' }}>
             Govt/Others (20%)
          </div>
        </div>
      </div>

      <div className={styles.footerRow}>
        <div className={styles.footerStat}>
          <Globe size={14} />
          <span>Global Presence: 12+ Countries</span>
        </div>
        <div className={styles.footerStat}>
          <BarChart3 size={14} />
          <span>Avg. Experience: 8.5 Years</span>
        </div>
      </div>
    </div>
  );
}
