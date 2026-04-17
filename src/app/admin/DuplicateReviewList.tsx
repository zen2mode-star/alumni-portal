'use client';
import { useState } from 'react';
import { resolveDuplicate } from '@/actions/admin';
import styles from './page.module.css';
import { Trash2, UserCheck, AlertTriangle } from 'lucide-react';

export default function DuplicateReviewList({ duplicates }: { duplicates: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handlePurge(userId: string) {
    if (!confirm('Are you sure you want to purge this specific profile from KecNetwork.in?')) return;
    setLoading(userId);
    const res = await resolveDuplicate(userId);
    if (res.success) {
      alert(res.message);
      window.location.reload();
    } else {
      alert(res.error);
    }
    setLoading(null);
  }

  if (duplicates.length === 0) return (
    <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
      🎉 Database Integrity Check: No obvious duplicate names found in KecNetwork.in.
    </div>
  );

  return (
    <div className={styles.duplicateSection}>
      <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <AlertTriangle size={20} color="#f59e0b" />
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Found {duplicates.length} groups of users with identical names. Review and purge redundant accounts.
        </p>
      </header>
      
      <div className={styles.duplicateGrid}>
        {duplicates.map((group, idx) => (
          <div key={idx} className={styles.duplicateGroup}>
            <div className={styles.groupHeader}>Potential Match: <strong>{group.name}</strong></div>
            <div className={styles.userList}>
              {group.users.map((u: any) => (
                <div key={u.id} className={styles.duplicateUserRow}>
                  <div className={styles.userInfo}>
                    <div className={styles.userEmail}>{u.email}</div>
                    <div className={styles.userMeta}>
                      <span>{u.role}</span> • <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePurge(u.id)} 
                    disabled={!!loading}
                    className={styles.purgeBtn}
                    title="Purge Duplicate"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
