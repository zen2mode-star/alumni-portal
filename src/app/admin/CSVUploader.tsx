'use client';
import { useState } from 'react';
import { uploadVerifiedEmails } from '@/actions/admin';
import LittleTiger from '@/components/LittleTiger';
import styles from './page.module.css';

export default function CSVUploader() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const res = await uploadVerifiedEmails(formData);

    setLoading(false);
    if (res?.error) {
      setStatus('❌ ' + res.error);
    } else {
      setStatus(`✅ Successfully processed ${res.count} records!`);
    }
  }

  return (
    <div className={styles.uploaderBox}>
      {loading ? (
        <div className={styles.loadingArea}>
          <LittleTiger size={120} loading={true} />
          <p>Analyzing and verifying alumni records...</p>
        </div>
      ) : (
        <form onSubmit={handleUpload} className={styles.uploadForm}>
          <div className={styles.fileInputWrapper}>
            <input 
              type="file" 
              name="csvFile" 
              accept=".csv" 
              id="csv-file"
              required 
              className={styles.fileInput} 
            />
            <label htmlFor="csv-file" className={styles.fileLabel}>
              📂 Click to select CSV (Name,Email,StartYear,GradYear,AuthCode)
            </label>
          </div>
          <button type="submit" className={styles.uploadBtn}>Upload & Whitelist Members</button>
        </form>
      )}
      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
