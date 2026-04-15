'use client';
import { useState } from 'react';
import { toggleOpenRegistration, handleLegacyPhoto } from '@/actions/admin';
import { Shield, Camera, Check, X, UserPlus, Lock, Unlock } from 'lucide-react';
import styles from './SiteSettings.module.css';

interface Props {
  initialOpenStatus: boolean;
  pendingPhotos: any[];
}

export default function SiteSettings({ initialOpenStatus, pendingPhotos }: Props) {
  const [isOpen, setIsOpen] = useState(initialOpenStatus);
  const [photos, setPhotos] = useState(pendingPhotos);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleToggle() {
    setLoading(true);
    const res = await toggleOpenRegistration(!isOpen);
    setLoading(false);
    if (res.error) setMessage({ type: 'error', text: res.error });
    else {
      setIsOpen(!isOpen);
      setMessage({ type: 'success', text: res.message || 'Updated!' });
    }
  }

  async function handlePhoto(id: string, action: 'APPROVE' | 'REJECT') {
    const res = await handleLegacyPhoto(id, action);
    if (res.success) {
      setPhotos(prev => prev.filter(p => p.id !== id));
    }
  }

  return (
    <div className={styles.settingsGrid}>
      {/* Registration Section */}
      <section className={styles.glassCard}>
        <div className={styles.sectionHeader}>
          <UserPlus size={20} />
          <h2>Registration Control</h2>
        </div>
        <p className={styles.description}>
          Allow users to register even if their email is not in the official CSV list. 
          New users will always be placed in <strong>PENDING</strong> status.
        </p>

        <div className={styles.toggleRow}>
          <div className={styles.statusInfo}>
            <div className={styles.statusLabel}>Mode: {isOpen ? 'OPEN' : 'CLOSED (SECURE)'}</div>
            <div className={styles.statusIcon}>
              {isOpen ? <Unlock size={24} color="#f59e0b" /> : <Lock size={24} color="#22c55e" />}
            </div>
          </div>
          <button 
            onClick={handleToggle} 
            disabled={loading}
            className={`${styles.toggleBtn} ${isOpen ? styles.btnOpen : styles.btnClosed}`}
          >
            {isOpen ? 'Switch to Secure Mode' : 'Switch to Open Mode'}
          </button>
        </div>
        {message && (
          <div className={`${styles.feedback} ${styles[message.type]}`}>{message.text}</div>
        )}
      </section>

      {/* Legacy Approval Section */}
      <section className={styles.glassCard}>
        <div className={styles.sectionHeader}>
          <Camera size={20} />
          <h2>Legacy Wall Moderation</h2>
        </div>
        
        {photos.length === 0 ? (
          <p className={styles.empty}>No pending legacy photos.</p>
        ) : (
          <div className={styles.photoQueue}>
            {photos.map(p => (
              <div key={p.id} className={styles.photoItem}>
                <img src={p.imageUrl} alt="Legacy" className={styles.preview} />
                <div className={styles.photoInfo}>
                  <strong>Class of {p.year}</strong>
                  <p>{p.caption || 'No caption'}</p>
                  <span>Uploaded by {p.author.name}</span>
                </div>
                <div className={styles.photoActions}>
                  <button onClick={() => handlePhoto(p.id, 'APPROVE')} className={styles.approve}>
                    <Check size={16} />
                  </button>
                  <button onClick={() => handlePhoto(p.id, 'REJECT')} className={styles.reject}>
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
