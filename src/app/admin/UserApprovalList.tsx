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
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();

  const filteredUsers = initialUsers
    .filter(user => {
      // Role Filter
      if (roleFilter !== 'ALL' && user.role !== roleFilter) return false;
      
      // Date Range Filter
      if (startDate || endDate) {
        const userDate = new Date(user.createdAt).getTime();
        const start = startDate ? new Date(startDate).getTime() : 0;
        const end = endDate ? new Date(endDate).getTime() : Infinity;
        if (userDate < start || userDate > end) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortField as keyof typeof a];
      const valB = b[sortField as keyof typeof b];
      
      if (sortField === 'createdAt') {
        return sortOrder === 'asc' 
          ? new Date(valA as string).getTime() - new Date(valB as string).getTime()
          : new Date(valB as string).getTime() - new Date(valA as string).getTime();
      }
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return 0;
    });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

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
      <header className={styles.filterRow} style={{ flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
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
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center', 
          background: 'rgba(255,255,255,0.03)', 
          padding: '0.75rem 1.25rem', 
          borderRadius: '12px',
          width: '100%'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>📅 Registration Window:</span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>From</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>To</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); }}
              style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Reset Calendar
            </button>
          )}
        </div>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
                Verified Member {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => toggleSort('role')} style={{ cursor: 'pointer' }}>
                Presence & Role {sortField === 'role' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => toggleSort('createdAt')} style={{ cursor: 'pointer' }}>
                Joined On {sortField === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
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
                  <div className={styles.userDate}>{new Date(user.createdAt).toLocaleDateString()}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>{new Date(user.createdAt).toLocaleTimeString()}</div>
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
