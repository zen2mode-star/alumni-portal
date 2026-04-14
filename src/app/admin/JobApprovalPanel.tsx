'use client';
import { useState } from 'react';
import { approveJob, rejectJob } from '@/actions/jobs';
import { CheckCircle, XCircle, Briefcase, Clock } from 'lucide-react';

interface PendingJob {
  id: string;
  title: string;
  company: string;
  description: string;
  link?: string | null;
  createdAt: Date;
  author: { name: string };
}

export default function JobApprovalPanel({ initialJobs }: { initialJobs: PendingJob[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [loading, setLoading] = useState<string | null>(null);

  const handle = async (jobId: string, action: 'approve' | 'reject') => {
    setLoading(jobId);
    const res = action === 'approve' ? await approveJob(jobId) : await rejectJob(jobId);
    if (res.success) setJobs(prev => prev.filter(j => j.id !== jobId));
    setLoading(null);
  };

  if (jobs.length === 0) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <CheckCircle size={28} style={{ margin: '0 auto 0.5rem', display: 'block', opacity: 0.4 }} />
        No pending job approvals.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {jobs.map(job => (
        <div key={job.id} style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--card-border)',
          borderRadius: '12px', padding: '1.25rem',
          borderLeft: '3px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Briefcase size={14} style={{ color: '#f59e0b' }} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{job.title}</span>
                <span style={{
                  fontSize: '0.65rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
                  padding: '0.15rem 0.5rem', borderRadius: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}>
                  <Clock size={9} /> Pending
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {job.company} · Posted by <strong>{job.author.name}</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {job.description.length > 120 ? job.description.substring(0, 120) + '...' : job.description}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button
                onClick={() => handle(job.id, 'approve')}
                disabled={loading === job.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none',
                  background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  opacity: loading === job.id ? 0.5 : 1
                }}
              >
                <CheckCircle size={14} /> Approve
              </button>
              <button
                onClick={() => handle(job.id, 'reject')}
                disabled={loading === job.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none',
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  opacity: loading === job.id ? 0.5 : 1
                }}
              >
                <XCircle size={14} /> Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
