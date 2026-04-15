'use client';
import { useState } from 'react';
import { adminCreateJob } from '@/actions/jobs';
import styles from './AdminJobPost.module.css';

export default function AdminJobPost() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 's' | 'e', text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const res = await adminCreateJob(formData);
    setLoading(false);
    if (res.error) setMsg({ type: 'e', text: res.error });
    else {
      setMsg({ type: 's', text: 'Job posted successfully and went live immediately.' });
      form.reset();
    }
  }

  return (
    <div className={styles.container}>
      <h3>Post New Job Vacancy</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <input name="title" placeholder="Job Title" required />
          <input name="company" placeholder="Company Name" required />
        </div>
        <textarea name="description" placeholder="Job Description & Requirements" required />
        <input name="link" placeholder="External Application Link (Optional)" />
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            Unlimited Job Photos (Slideshow)
          </label>
          <input type="file" name="images" multiple accept="image/*" style={{ fontSize: '0.8rem' }} />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Posting...' : 'Post Job Directly'}
        </button>
      </form>
      {msg && <p className={msg.type === 's' ? styles.success : styles.error}>{msg.text}</p>}
    </div>
  );
}
