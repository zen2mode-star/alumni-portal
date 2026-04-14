'use client';
import { useState } from 'react';
import { toggleJobInterest, deleteJob } from '@/actions/jobs';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Props {
  jobId: string;
  isInterested: boolean;
  interestCount: number;
  interestedUsers?: { name: string }[];
  isAuthor: boolean;
  isAdmin: boolean;
}

export default function InterestTracker({ jobId, isInterested, interestCount, interestedUsers, isAuthor, isAdmin }: Props) {
  const [interested, setInterested] = useState(isInterested);
  const [count, setCount] = useState(interestCount);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const res = await toggleJobInterest(jobId);
    setLoading(false);
    if (res?.success) {
      setInterested(!interested);
      setCount(prev => interested ? prev - 1 : prev + 1);
    }
  }

  const router = useRouter();

  async function handleDelete() {
    if (confirm('Permanently remove this opportunity from the KEC network?')) {
      const res = await deleteJob(jobId);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    }
  }

  return (
    <div className={styles.interestSection}>
      <div className={styles.interestActions}>
        <button 
          onClick={handleToggle} 
          className={interested ? styles.interestedBtn : styles.notInterestedBtn}
          disabled={loading}
        >
          {interested ? '★ Expressed Interest' : '☆ Show Interest'}
        </button>
        
        <span className={styles.interestCount}>
          {count} professional {count === 1 ? 'interest' : 'interests'}
        </span>

        {(isAuthor || isAdmin) && (
          <button onClick={handleDelete} className={styles.deleteJobBtn}>
            Remove Opportunity
          </button>
        )}
      </div>

      {isAuthor && interestedUsers && interestedUsers.length > 0 && (
        <div className={styles.posterInsights}>
          <h4>Interested Institutional Talent:</h4>
          <ul className={styles.talentList}>
            {interestedUsers.map((u, i) => (
              <li key={i}>{u.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
