'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/actions/posts';
import PostCard from '@/components/PostCard';
import styles from './page.module.css';

interface FeedProps {
  alumniPosts: any[];
  studentPosts: any[];
  user: any;
  isAdmin: boolean;
}

export default function FeedClient({ alumniPosts, studentPosts, user, isAdmin }: FeedProps) {
  const [activeTab, setActiveTab] = useState<'alumni' | 'student'>('alumni');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handlePostSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await createPost(formData);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      form.reset();
      setImagePreview(null);
      // Force refresh to show the newest post immediately
      router.refresh();
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const currentPosts = activeTab === 'alumni' ? alumniPosts : studentPosts;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerIcon}>📢</div>
        <div className={styles.headerText}>
           <h1>Kec Community Feed</h1>
           <p>Conversations across the KEC network</p>
        </div>
      </header>

      {user && user.status === 'APPROVED' && (
        <section className={styles.composerCard}>
          <div className={styles.composerHeader}>
             <img src={user.imageUrl || `https://ui-avatars.com/api/?name=${user.name}&background=0A1128&color=fff`} className={styles.composerAvatar} />
             <span>Share a campus update, {user.name.split(' ')[0]}...</span>
          </div>
          <form onSubmit={handlePostSubmit} className={styles.composerForm}>
            <textarea 
              name="content" 
              placeholder="What's happening in your professional or academic world?" 
              className={styles.textarea}
              required
            />
            
            {imagePreview && (
              <div className={styles.previewContainer}>
                <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                <button type="button" onClick={() => setImagePreview(null)} className={styles.removeBtn}>×</button>
              </div>
            )}

            <div className={styles.composerFooter}>
              <div className={styles.composerActions}>
                <button 
                  type="button" 
                  className="btn btn-glass" 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  📸 Add Media
                </button>
                <input 
                  type="file" 
                  name="postImage" 
                  accept="image/*" 
                  hidden 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                />
              </div>
              
              <div className={styles.submitSection}>
                {error && <span className={styles.errorText}>{error}</span>}
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Publishing...' : 'Post to Feed'}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      <div className={styles.tabNav}>
        <button 
          onClick={() => setActiveTab('alumni')} 
          className={`${styles.tabBtn} ${activeTab === 'alumni' ? styles.activeTab : ''}`}
        >
          Alumni Feed ({alumniPosts.length})
        </button>
        <button 
          onClick={() => setActiveTab('student')} 
          className={`${styles.tabBtn} ${activeTab === 'student' ? styles.activeTab : ''}`}
        >
          Student Posts ({studentPosts.length})
        </button>
      </div>

      <div className={styles.feedScroll}>
        {currentPosts.map(post => (
          <PostCard key={post.id} post={post} currentUserId={user?.id} isAdmin={isAdmin} />
        ))}
        {currentPosts.length === 0 && (
          <div className={styles.emptyFeed}>
            <p>No verified feed posts found in this channel yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
