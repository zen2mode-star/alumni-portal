'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleUserApproval, resetUserPassword, deleteUser } from '@/actions/admin';
import styles from './page.module.css';

export default function UserApprovalList({ initialUsers }: { initialUsers: any[] }) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const router = useRouter();

  const filteredUsers = initialUsers.filter(user => {
    if (roleFilter === 'ALL') return true;
    return user.role === roleFilter;
  });

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
    setLoading(userId);
  }

  function exportCSV() {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Batch', 'Branch'];
    const rows = filteredUsers.map(user => [
      user.name,
      user.email,
      user.role,
      user.status,
      `${user.startYear}-${user.gradYear}`,
      user.branch
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `kec_members_${roleFilter.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const roleTypes = [
    { id: 'ALL', label: 'All Identities' },
    { id: 'ALUMNI', label: 'Alumni' },
    { id: 'STAFF', label: 'KEC Staff' },
    { id: 'STUDENT', label: 'Students' },
    { id: 'ADMIN', label: 'Admins' },
  ];

  return (
    <div className={styles.approvalSection}>
      <header className={styles.filterRow}>
        <div className={styles.filterGroup}>
          {roleTypes.map(type => (
            <button 
              key={type.id}
              className={`${styles.filterBtn} ${roleFilter === type.id ? styles.filterBtnActive : ''}`}
              onClick={() => setRoleFilter(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
        <button onClick={exportCSV} className={styles.exportBtn}>
          📥 Export List to CSV
        </button>
      </header>

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
            {filteredUsers.map(user => (
              <tr key={user.id} className={loading === user.id ? styles.rowLoading : ''}>
                <td>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userBatch}>{user.branch || 'General'} • {user.startYear || '?'}-{user.gradYear || '?'}</div>
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
        {filteredUsers.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No members found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
