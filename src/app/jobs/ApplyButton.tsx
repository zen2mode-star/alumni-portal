'use client';
import { useState } from 'react';
import { applyForJob } from '@/actions/jobs';
import styles from './page.module.css';

export default function ApplyButton({ jobId, authorId, jobTitle }: { jobId: string, authorId: string, jobTitle: string }) {
  const [status, setStatus] = useState<string | null>(null);

  const handleApply = async () => {
    setStatus('Applying...');
    const result = await applyForJob(jobId, authorId, jobTitle);
    if (result.error) {
      alert(result.error);
      setStatus(null);
    } else {
      setStatus('Applied ✓');
      alert(result.message);
    }
  };

  return (
    <button 
      onClick={handleApply} 
      className={styles.applyBtn} 
      disabled={status === 'Applied ✓' || status === 'Applying...'}
    >
      {status || 'Apply Now'}
    </button>
  );
}
