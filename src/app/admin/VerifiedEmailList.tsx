'use client';
import { useState } from 'react';
import { addVerifiedEmail } from '@/actions/admin';
import styles from './page.module.css';

export default function VerifiedEmailList({ initialEmails }: { initialEmails: any[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      authCode: formData.get('authCode') as string,
      role: formData.get('role') as string,
      startYear: parseInt(formData.get('startYear') as string) || 0,
      gradYear: parseInt(formData.get('gradYear') as string) || 0
    };
    await addVerifiedEmail(data);
    setLoading(false);
    setShowAdd(false);
  }

  return (
    <div className={styles.verifiedEmails}>
      <header className={styles.sectionHeader}>
        <h2>Official Member Whitelist</h2>
        <button onClick={() => setShowAdd(!showAdd)} className={styles.addBtn}>
          {showAdd ? 'Cancel' : '➕ Add Individual Member'}
        </button>
      </header>

      {showAdd && (
        <form onSubmit={handleAdd} className={styles.addForm}>
          <input name="name" placeholder="Full Name" required />
          <input name="email" type="email" placeholder="Official Email" required />
          <input name="authCode" placeholder="Institutional Auth Code" />
          <select name="role" required defaultValue="ALUMNI">
            <option value="ALUMNI">Alumni Member</option>
            <option value="STAFF">KEC Staff</option>
          </select>
          <input name="startYear" type="number" placeholder="Start Year" />
          <input name="gradYear" type="number" placeholder="Graduation Year" />
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Whitelist Member'}</button>
        </form>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Auth Code</th>
              <th>Role</th>
              <th>Batch</th>
              <th>Verified Date</th>
            </tr>
          </thead>
          <tbody>
            {initialEmails.map(rec => (
              <tr key={rec.id}>
                <td>{rec.name}</td>
                <td>{rec.email}</td>
                <td><code className={styles.codeSnippet}>{rec.authCode || 'None'}</code></td>
                <td><span className={styles.roleBadge}>{rec.role}</span></td>
                <td>{rec.startYear ? `${rec.startYear} - ${rec.gradYear}` : 'N/A'}</td>
                <td>{new Date(rec.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
