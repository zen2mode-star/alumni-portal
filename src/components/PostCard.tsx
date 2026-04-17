'use client';
import Link from 'next/link';
import { deletePost } from '@/actions/posts';
import { adminEditPost, submitAppeal } from '@/actions/admin';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { normalizeBranch } from '@/lib/normalize';
import { Edit3, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './PostCard.module.css';

interface PostProps {
  post: any;
  currentUserId?: string;
  isAdmin: boolean;
}

export default function PostCard({ post, currentUserId, isAdmin }: PostProps) {
  const isAuthor = post.authorId === currentUserId;
  const canDelete = isAuthor || isAdmin;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleDelete() {
    if (confirm('Permanently remove this update?')) {
      const res = await deletePost(post.id);
      if (res?.error) {
        alert(res.error);
      } else {
      }
    }
  }

  async function handleAdminEdit() {
    setLoading(true);
    const res = await adminEditPost(post.id, editContent);
    if (!res.error) {
      setIsEditing(false);
      router.refresh();
    } else alert(res.error);
    setLoading(false);
  }

  async function handleAppeal() {
    const reason = prompt('Reason for appealing this institutional refinement?');
    if (!reason) return;
    const res = await submitAppeal(post.id, reason);
    alert(res.message || res.error);
  }

  const timeAgo = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.authorSection}>
          <img 
            src={post.author.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=0A1128&color=fff`} 
            alt={post.author.name} 
            className={styles.avatar} 
          />
          <div className={styles.authorInfo}>
            <div className={styles.nameRow}>
               <span className={styles.name}>{post.author.name}</span>
               <span className={styles.roleBadge}>{post.roleSnap}</span>
               {post.adminEdited && <span className={styles.editedBadge} title="Refined by Administration"><CheckCircle size={10} /> Admin Refined</span>}
            </div>
            <span className={styles.meta}>{normalizeBranch(post.author.branch)} • {timeAgo}</span>
          </div>
        </div>
        <div className={styles.actionRow}>
          {isAdmin && !isEditing && (
            <button onClick={() => setIsEditing(true)} className={styles.editBtn} title="Refine Content"><Edit3 size={14} /></button>
          )}
          {canDelete && (
            <button onClick={handleDelete} className={styles.deleteBtn} title="Remove Update">×</button>
          )}
        </div>
      </header>

      <div className={styles.content}>
        {isEditing ? (
          <div className={styles.editWrapper}>
            <textarea 
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className={styles.editArea}
            />
            <div className={styles.editActions}>
              <button onClick={handleAdminEdit} disabled={loading} className={styles.saveBtn}>Apply Refinement</button>
              <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        ) : (
          <p>{post.content}</p>
        )}
        
        {post.imageUrl && (
          <div className={styles.mediaContainer}>
            <img src={post.imageUrl} alt="Post media" className={styles.postMedia} />
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <div className={styles.institutionalSeal}>
           KEC Verified 🏛
        </div>
        {!isAuthor && (
          <Link href={`/messages?to=${post.authorId}`} className={styles.messageLink}>
            💬 Message Author
          </Link>
        )}
        {isAuthor && post.adminEdited && (
          <button onClick={handleAppeal} className={styles.appealBtn}>
            <AlertCircle size={12} /> Appeal Refinement
          </button>
        )}
      </footer>
    </article>
  );
}
