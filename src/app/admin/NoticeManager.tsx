'use client';
import { useState } from 'react';
import { addNotice, deleteNotice } from '@/actions/home';
import styles from './HomeManager.module.css';

interface NoticeManagerProps {
  initialNotices: any[];
}

export default function NoticeManager({ initialNotices }: NoticeManagerProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedDesignation, setSelectedDesignation] = useState('Director');
  const [customDesignation, setCustomDesignation] = useState('');

  async function handleAddNotice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    
    // Override designation if custom is set
    if (selectedDesignation === 'Other (Custom...)') {
      formData.set('designation', customDesignation);
    } else {
      formData.set('designation', selectedDesignation);
    }

    const res = await addNotice(formData);
    if (res.error) setStatus({ type: 'error', message: res.error });
    else {
      setStatus({ type: 'success', message: 'Notice published successfully!' });
      e.currentTarget.reset();
      setCustomDesignation('');
      window.location.reload();
    }
    setLoading(false);
  }

  const designations = [
    'Director',
    'Ex-Director',
    'Dean Academics',
    'Dean Student Welfare',
    'HOD CSE',
    'HOD ECE',
    'HOD ME',
    'HOD CE',
    'HOD EE',
    'Registrar',
    'Examination Cell',
    'Training & Placement Cell',
    'Administration',
    'Alumni Cell',
    'Other (Custom...)'
  ];

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.1rem' }}>📋 Notice Board Manager</h3>
      <p className={styles.hint}>Post official campus notices. Each notice shows the designation (who posted it) on the home page sidebar.</p>

      {status && (
        <div className={`${styles.status} ${status.type === 'success' ? styles.success : styles.error}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleAddNotice} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Notice Title</label>
          <input type="text" name="title" required placeholder="e.g. Examination Schedule Released" />
        </div>
        <div className={styles.inputGroup}>
          <label>Content</label>
          <textarea name="content" required placeholder="Brief notice content..." rows={3} style={{ resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div className={styles.inputGroup} style={{ flex: 1, minWidth: '200px' }}>
            <label>From (Designation)</label>
            <select 
              name="designation" 
              required 
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
            >
              {designations.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {selectedDesignation === 'Other (Custom...)' && (
            <div className={styles.inputGroup} style={{ flex: 1, minWidth: '200px' }}>
              <label>Specify Custom Designation</label>
              <input 
                type="text" 
                placeholder="e.g. Chief Warden" 
                value={customDesignation}
                onChange={(e) => setCustomDesignation(e.target.value)}
                required
              />
            </div>
          )}

          <div className={styles.inputGroup} style={{ flex: 1, minWidth: '200px' }}>
            <label>Priority</label>
            <select name="priority">
              <option value="NORMAL">Normal</option>
              <option value="IMPORTANT">Important</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Publishing...' : 'Publish Notice'}
        </button>
      </form>

      <div className={styles.list}>
        {initialNotices.map(n => (
          <div key={n.id} className={styles.item}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '0.85rem' }}>{n.title}</strong>
                {n.priority === 'URGENT' && (
                  <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>URGENT</span>
                )}
                {n.priority === 'IMPORTANT' && (
                  <span style={{ background: '#f59e0b', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>IMPORTANT</span>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                From: {n.designation} • {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </div>
            <button
              onClick={async () => {
                if (confirm('Delete this notice?')) {
                  setLoading(true);
                  await deleteNotice(n.id);
                  window.location.reload();
                }
              }}
              className={styles.deleteBtn}
            >×</button>
          </div>
        ))}
        {initialNotices.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1.5rem', fontSize: '0.85rem' }}>
            No notices posted yet.
          </p>
        )}
      </div>
    </div>
  );
}
