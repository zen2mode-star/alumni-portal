'use client';
import { useState } from 'react';
import { register } from '@/actions/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../login/page.module.css'; // Reusing login styles

export default function RegisterPage() {
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
        <p>Join the KecAlumini.in network.</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="name" required placeholder="John Doe" />
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input type="email" name="email" required placeholder="you@btkit.ac.in" />
          </div>

          <div className={styles.formGroup}>
            <label>Institutional Verification Code</label>
            <input type="text" name="authCode" required placeholder="e.g. A9B2X (5-digits)" maxLength={5} />
          </div>
          
          <div className={styles.formGroup}>
            <label>Password</label>
            <input type="password" name="password" required />
          </div>

          <div className={styles.formGroup}>
            <label>I am a...</label>
            <select name="role" required className={styles.select}>
              <option value="STUDENT">Current Student</option>
              <option value="ALUMNI">Alumni</option>
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
