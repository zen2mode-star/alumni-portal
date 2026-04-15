'use client';
import { useState } from 'react';
import { approvePost, rejectPost } from '@/actions/posts';
import { CheckCircle, XCircle, Share2, Clock } from 'lucide-react';

interface PendingPost {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: Date;
  author: { name: string };
}

export default function UpdateApprovalPanel({ initialPosts }: { initialPosts: PendingPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState<string | null>(null);

  const handle = async (postId: string, action: 'approve' | 'reject') => {
    setLoading(postId);
    const res = action === 'approve' ? await approvePost(postId) : await rejectPost(postId);
    if (res.success) setPosts(prev => prev.filter(p => p.id !== postId));
    setLoading(null);
  };

  if (posts.length === 0) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <CheckCircle size={28} style={{ margin: '0 auto 0.5rem', display: 'block', opacity: 0.4 }} />
        No pending campus updates.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {posts.map(post => (
        <div key={post.id} style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--card-border)',
          borderRadius: '12px', padding: '1.25rem',
          borderLeft: '3px solid #7B61FF'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Share2 size={14} style={{ color: '#7B61FF' }} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Social Update</span>
                <span style={{
                  fontSize: '0.65rem', background: 'rgba(123,97,255,0.15)', color: '#7B61FF',
                  padding: '0.15rem 0.5rem', borderRadius: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}>
                  <Clock size={9} /> Pending Review
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Posted by <strong>{post.author.name}</strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}
              </p>
              {post.imageUrl && (
                <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', width: '100px', height: '60px' }}>
                  <img src={post.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Attachment" />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button
                onClick={() => handle(post.id, 'approve')}
                disabled={loading === post.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none',
                  background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  opacity: loading === post.id ? 0.5 : 1
                }}
              >
                <CheckCircle size={14} /> Approve
              </button>
              <button
                onClick={() => handle(post.id, 'reject')}
                disabled={loading === post.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.5rem 0.9rem', borderRadius: '8px', border: 'none',
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  opacity: loading === post.id ? 0.5 : 1
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
