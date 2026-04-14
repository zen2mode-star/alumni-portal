'use client';
import Link from 'next/link';
import { deletePost } from '@/actions/posts';
import { useRouter } from 'next/navigation';
import styles from './PostCard.module.css';

interface PostProps {
  post: any;
  currentUserId?: string;
  isAdmin: boolean;
}

export default function PostCard({ post, currentUserId, isAdmin }: PostProps) {
  const isAuthor = post.authorId === currentUserId;
  const canDelete = isAuthor || isAdmin;

  const router = useRouter();

  async function handleDelete() {
    if (confirm('Permanently remove this update?')) {
      const res = await deletePost(post.id);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    }
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
               <span className={styles.studentBadge}>Emerging KEC Talent</span>
               <span className={styles.roleBadge}>{post.roleSnap}</span>
            </div>
            <span className={styles.meta}>{post.author.branch} • {timeAgo}</span>
          </div>
        </div>
        {canDelete && (
          <button onClick={handleDelete} className={styles.deleteBtn} title="Remove Update">×</button>
        )}
      </header>

      <div className={styles.content}>
        <p>{post.content}</p>
        
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
      </footer>
    </article>
  );
}
