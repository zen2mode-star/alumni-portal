'use client';
import { useState } from 'react';
import { login } from '@/actions/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      router.push(res.url);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Sign In</h1>
        <p>Welcome back to the KecAlumini.in network.</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input type="email" name="email" required placeholder="you@example.com" />
          </div>
          
          <div className={styles.formGroup}>
            <label>Password</label>
            <input type="password" name="password" required />
          </div>
          
          <button type="submit" className={styles.submitBtn}>Sign In</button>
        </form>
        
        <div className={styles.footer}>
          Don't have an account? <Link href="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
