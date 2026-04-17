'use client';
import { ShieldCheck, Calendar, MapPin, Building } from 'lucide-react';
import styles from './DigitalID.module.css';

interface IDProps {
  user: any;
}

export default function DigitalID({ user }: IDProps) {
  const avatarUrl = user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7B61FF&color=fff&bold=true`;
  
  return (
    <div className={styles.idCard}>
      <div className={styles.aura}></div>
      <div className={styles.header}>
        <div className={styles.logoRow}>
          <img src="/btkit-logo.png" className={styles.kecLogo} alt="KEC" />
          <div className={styles.brandTitle}>
            <span>KEC</span>
            <strong>NETWORK</strong>
          </div>
        </div>
        <div className={styles.verifiedBadge}>
          <ShieldCheck size={14} />
          OFFICIAL MEMBER
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.avatarContainer}>
          <img src={avatarUrl} className={styles.avatar} alt="Profile Photo" />
          <div className={styles.statusDot}></div>
        </div>
        
        <div className={styles.details}>
          <h2 className={styles.name}>{user.name}</h2>
          <div className={styles.infoRow}>
            <Calendar size={12} />
            <span>Batch of {user.gradYear || 'LEGACY'}</span>
          </div>
          <div className={styles.infoRow}>
            <Building size={12} />
            <span>{user.branch || 'KEC Heritage'}</span>
          </div>
          <div className={styles.infoRow} style={{ marginTop: '0.4rem' }}>
            <MapPin size={12} />
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary-color)' }}>
              KEC DWARAHAT PROFILE
            </span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.dossierNum}>
          UID: {user.rollNumber || 'KEC-ADM-' + user.id.slice(-6).toUpperCase()}
        </div>
        <div className={styles.seal}>
           EST. 1991
        </div>
      </div>
      
      <div className={styles.glassEffect}></div>
    </div>
  );
}
