'use client';
import { useState } from 'react';
import { updateProfile } from '@/actions/profile';
import { changePassword, logout } from '@/actions/auth';
import Link from 'next/link';
import LittleTiger from '@/components/LittleTiger';
import styles from './page.module.css';

interface DashboardProps {
  user: any;
  pendingMessages: number;
}

export default function DashboardClient({ user, pendingMessages }: DashboardProps) {
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user.imageUrl || '');

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoading(false);
    if (res?.error) setStatus({ type: 'error', message: res.error });
    else if (res?.success) setStatus({ type: 'success', message: res.message });
  }

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const res = await changePassword(formData);
    setLoading(false);
    if (res?.error) setStatus({ type: 'error', message: res.error });
    else if (res?.success) {
      setStatus({ type: 'success', message: res.message });
      e.currentTarget.reset();
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles.premiumContainer}>
      {loading && (
        <div className={styles.executiveLoader}>
          <LittleTiger loading={true} size={150} />
          <p className={styles.loaderText}>Processing secure update...</p>
        </div>
      )}

      <header className={styles.identityHeader}>
        <div className={styles.auraBg}></div>
        <div className={styles.identityVisual}>
          <img
            src={photoPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0A1128&color=fff`}
            alt={user.name}
            className={styles.avatar}
          />
          <div className={styles.batchBadge}>Class of {user.gradYear}</div>
        </div>
        <div className={styles.identityInfo}>
          <h1>{user.name} <span className={styles.roleTag}>{user.role}</span></h1>
          <p className={styles.currentPosition}>{user.jobRole || 'Institutional Fellow'} {user.company ? `@ ${user.company}` : ''}</p>
          <div className={styles.contactBar}>
            {user.linkedinUrl && (
              <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.badgeLink}>
                 Official LinkedIn Profile ↗
              </a>
            )}
            <span className={styles.statusLabel}>{user.status} ACCOUNT</span>
          </div>
        </div>
      </header>

      {status && (
        <div className={`${styles.announcement} ${status.type === 'success' ? styles.success : styles.error}`}>
          {status.message}
        </div>
      )}

      <div className={styles.dashboardGrid}>
        <section className={styles.glassCard}>
          <div className={styles.cardHeader}>
            <h3>Professional Biography</h3>
            <span>Public Identity</span>
          </div>
          <form onSubmit={handleProfileUpdate} className={styles.modernForm}>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Institutional Company</label>
                <input type="text" name="company" defaultValue={user.company || ''} placeholder="e.g. Google" />
              </div>
              <div className={styles.inputGroup}>
                <label>Designation</label>
                <input type="text" name="jobRole" defaultValue={user.jobRole || ''} placeholder="e.g. Lead Engineer" />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>LinkedIn Professional URL</label>
              <input type="url" name="linkedinUrl" defaultValue={user.linkedinUrl || ''} placeholder="https://linkedin.com/in/..." />
            </div>

            <div className={styles.inputGroup}>
              <label>Identity Image (JPEG/PNG)</label>
              <div className={styles.fileCustom}>
                <input type="file" name="profileImage" accept="image/jpeg,image/png" onChange={handleFileChange} id="file-upload" />
                <label htmlFor="file-upload">Choose New Perspective</label>
              </div>
              <input type="hidden" name="existingImageUrl" value={user.imageUrl || ''} />
            </div>

            <div className={styles.inputGroup}>
              <label>Professional Narrative</label>
              <textarea name="bio" defaultValue={user.bio || ''} placeholder="Condense your journey..." />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>Commit Profile Updates</button>
          </form>
        </section>

        <aside className={styles.controlPanel}>
          <div className={styles.glassCard}>
            <h3>Secure Credentials</h3>
            <form onSubmit={handlePasswordChange} className={styles.modernForm}>
              <div className={styles.inputGroup}>
                <label>Current Ledger Key</label>
                <input type="password" name="prevPassword" required placeholder="••••••••" />
              </div>
              <div className={styles.inputGroup}>
                <label>New Authorized Key</label>
                <input type="password" name="newPassword" required placeholder="••••••••" />
              </div>
              <button type="submit" className="btn btn-glass" style={{width:'100%'}}>Authorize Update</button>
            </form>
          </div>

          <div className={styles.actionGrid}>
             <Link href="/messages" className={styles.actionTile}>
               <span className={styles.tileIcon}>✉️</span>
               <span className={styles.tileText}>Secure Inbox</span>
               {pendingMessages > 0 && <span className={styles.tileBadge}>{pendingMessages}</span>}
             </Link>
             <form action={logout}>
               <button type="submit" className={styles.logoutTile}>
                 <span className={styles.tileIcon}>⏻</span>
                 <span className={styles.tileText}>Terminate Session</span>
               </button>
             </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
