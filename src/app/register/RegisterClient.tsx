'use client';
import { useState } from 'react';
import { register } from '@/actions/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../login/page.module.css';

interface Props {
  isOpen: boolean;
}

export default function RegisterClient({ isOpen }: Props) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await register(formData);
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      router.push(res.url);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Sign Up</h1>
        <p>Join the KecAlumni.in network.</p>
        
        {isOpen && (
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600, textAlign: 'center' }}>
            🎉 Public Registration is currently OPEN!
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="name" required placeholder="John Doe" />
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input type="email" name="email" required placeholder="your.email@example.com" />
          </div>

          <div className={styles.formGroup}>
            <label>KEC Verification Code {isOpen ? '(Optional if not on list)' : ''}</label>
            <input type="text" name="authCode" required={!isOpen} placeholder="e.g. A9B2X" maxLength={5} />
            {isOpen && <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Leave blank if you are not in the official alumni CSV database.</small>}
          </div>
          
          <div className={styles.formGroup}>
            <label>Password</label>
            <input type="password" name="password" required />
          </div>

          <div className={styles.formGroup}>
            <label>I am a...</label>
            <select name="role" required className={styles.select}>
              <option value="ALUMNI">Alumni</option>
              <option value="STAFF">KEC Staff/Faculty</option>
              <option value="STUDENT">Current Student</option>
            </select>
          </div>
          
          <button type="submit" className={styles.submitBtn}>Create Account</button>
        </form>
        
        <div className={styles.footer}>
          Already have an account? <Link href="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
