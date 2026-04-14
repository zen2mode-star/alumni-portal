'use client';

import styles from './page.module.css';

interface OutreachProps {
  unregisteredVerified: { email: string, gradYear: number | null }[];
}

export default function OutreachCenter({ unregisteredVerified }: OutreachProps) {
  // Assume current year is 2026, so gradYear <= 2026 means Alumni.
  const alumniEmails = unregisteredVerified
    .filter(u => u.gradYear !== null && u.gradYear <= 2026)
    .map(u => u.email)
    .join(',');

  const studentEmails = unregisteredVerified
    .filter(u => u.gradYear === null || u.gradYear > 2026)
    .map(u => u.email)
    .join(',');

  const defaultSubject = encodeURIComponent("Welcome to KecAlumni.in - Official Invitation");
  const defaultBody = encodeURIComponent("Hello,\n\nWe are excited to invite you to join the KecAlumni.in community. Please sign up to connect with fellow alumni and students, and stay updated with campus news.\n\nBest regards,\nThe Alumni Team");

  return (
    <div className={styles.outreachBox} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.25rem', marginTop: '1.5rem' }}>
      <h3 style={{ fontSize: '0.9rem', color: 'var(--primary-color)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Campus Outreach</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
        Send bulk invitation emails to users from the CSV who have not yet registered on the portal.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <a 
          href={`mailto:?bcc=${alumniEmails}&subject=${defaultSubject}&body=${defaultBody}`}
          className={styles.uploadBtn}
          style={{ textDecoration: 'none', textAlign: 'center', display: 'block', background: 'linear-gradient(135deg, #111115 0%, #1a1a2e 100%)', border: '1px solid var(--primary-color)', color: 'white' }}
        >
          📧 Invite Alumni ({unregisteredVerified.filter(u => u.gradYear !== null && u.gradYear <= 2026).length})
        </a>

        <a 
          href={`mailto:?bcc=${studentEmails}&subject=${defaultSubject}&body=${defaultBody}`}
          className={styles.uploadBtn}
          style={{ textDecoration: 'none', textAlign: 'center', display: 'block' }}
        >
          📧 Invite Students ({unregisteredVerified.filter(u => u.gradYear === null || u.gradYear > 2026).length})
        </a>
      </div>
    </div>
  );
}
