'use client';
import { useState } from 'react';
import { toggleUserApproval, resetUserPassword, deleteUser } from '@/actions/admin';
import styles from './page.module.css';

export default function UserApprovalList({ initialUsers }: { initialUsers: any[] }) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newPass, setNewPass] = useState('');

  async function handleReset(userId: string) {
    if (!newPass) return;
    const res = await resetUserPassword(userId, newPass);
    if (!res.error) {
      alert('Password updated successfully');
      setEditingUserId(null);
      setNewPass('');
    }
  }

  return (
    <div className={styles.approvalSection}>
      <h2>User Account Management</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email / Role</th>
              <th>Status</th>
              <th>Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userBatch}>{user.startYear} - {user.gradYear}</div>
                </td>
                <td>
                  <div>{user.email}</div>
                  <div className={styles.badge}>{user.role}</div>
                </td>
                <td>
                  <span className={user.status === 'APPROVED' ? styles.statusApproved : styles.statusPending}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className={styles.btnRow}>
                    {user.status === 'PENDING' && (
                      <button onClick={() => toggleUserApproval(user.id, 'APPROVED')} className={styles.approveBtn}>
                        Approve
                      </button>
                    )}
                    <button onClick={() => setEditingUserId(user.id)} className={styles.resetBtn}>
                      Reset Pass
                    </button>
                    <button onClick={() => { if(confirm('Are you sure?')) deleteUser(user.id) }} className={styles.rejectBtn}>
                      Delete
                    </button>
                  </div>
                  
                  {editingUserId === user.id && (
                    <div className={styles.popover}>
                      <input 
                        type="text" 
                        placeholder="New specific password" 
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
