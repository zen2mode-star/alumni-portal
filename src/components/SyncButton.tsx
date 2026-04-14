'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import LittleTiger from './LittleTiger';
import styles from './SyncButton.module.css';

interface SyncButtonProps {
  userId: string;
  label?: string;
}

export default function SyncButton({ userId, label = 'Synchronize' }: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSync = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSyncing || isPending) return;
    
    setIsSyncing(true);
    
    // Simulate the Handshake before the transition starts
    setTimeout(() => {
      startTransition(() => {
        router.push(`/profile/${userId}`);
      });
    }, 800); 
  };

  const showLoading = isSyncing || isPending;

  return (
    <button 
      className={`${styles.syncBtn} ${showLoading ? styles.syncing : ''}`} 
      onClick={handleSync}
      disabled={showLoading}
      type="button"
    >
      <div className={styles.btnContent}>
        {!showLoading && <span className={styles.label}>{label}</span>}
        {showLoading && (
          <div className={styles.tigerOverlay}>
            <LittleTiger size={28} loading={true} />
            <span className={styles.syncingText}>Verifying...</span>
          </div>
        )}
      </div>
      <div className={styles.glowEffect}></div>
    </button>
  );
}
