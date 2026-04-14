'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleUserApproval, resetUserPassword, deleteUser } from '@/actions/admin';
import styles from './page.module.css';

export default function UserApprovalList({ initialUsers }: { initialUsers: any[] }) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function handleToggle(userId: string, status: string) {
    setLoading(userId);
    const res = await toggleUserApproval(userId, status);
    if (!res.error) router.refresh();
    setLoading(null);
  }

  async function handleDelete(userId: string) {
    if (!confirm('Nuclear Option: This will permanently delete the user and all their records. Proceed?')) return;
    setLoading(userId);
    const res = await deleteUser(userId);
    if (!res.error) router.refresh();
    setLoading(null);
  }

  async function handleReset(userId: string) {
    if (!newPass) return;
    setLoading(userId);
    const res = await resetUserPassword(userId, newPass);
    if (!res.error) {
      alert('Institutional credential reset successfully');
      setEditingUserId(null);
      setNewPass('');
    } else {
      alert(res.error);
    }
    setLoading(null);
  }

  return (
    <div className={styles.approvalSection}>
      <h2>Global Identity Ledger</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Verified Member</th>
              <th>Presence & Credential</th>
              <th>Clearance</th>
              <th>Executive Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialUsers.map(user => (
              <tr key={user.id} className={loading === user.id ? styles.rowLoading : ''}>
                <td>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userBatch}>{user.branch} • {user.startYear}-{user.gradYear}</div>
                </td>
                <td>
                  <div className={styles.userEmail}>{user.email}</div>
                  <div className={styles.roleBadge}>{user.role}</div>
                </td>
                <td>
                  <span className={user.status === 'APPROVED' ? styles.statusApproved : styles.statusPending}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className={styles.btnRow}>
                    {user.status === 'PENDING' && (
                      <button 
                        onClick={() => handleToggle(user.id, 'APPROVED')} 
                        disabled={loading === user.id}
                        className={styles.approveBtn}
                      >
                        Authorize
                      </button>
                    )}
                    <button 
                      onClick={() => setEditingUserId(user.id)} 
                      disabled={loading === user.id}
                      className={styles.resetBtn}
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)} 
                      disabled={loading === user.id}
                      className={styles.rejectBtn}
                    >
                      Purge
                    </button>
                  </div>
                  
                  {editingUserId === user.id && (
                    <div className={styles.popover}>
                      <input 
                        type="text" 
                        placeholder="New credential..." 
                        value={newPass} 
                        onChange={e => setNewPass(e.target.value)} 
                        className={styles.smallInput}
                      />
                      <button onClick={() => handleReset(user.id)} className={styles.saveBtn}>Save</button>
                      <button onClick={() => setEditingUserId(null)} className={styles.cancelBtn}>×</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
