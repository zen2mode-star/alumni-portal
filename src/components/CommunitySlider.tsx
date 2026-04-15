'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import styles from './CommunitySlider.module.css';

interface Post {
  id: string;
  content: string;
  createdAt: Date;
  imageUrl?: string | null;
  author: {
    name: string;
    role: string;
    imageUrl?: string | null;
    company?: string | null;
  };
}

export default function CommunitySlider({ posts }: { posts: Post[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) handleNext();
    if (touchStart - touchEnd < -75) handlePrev();
  };

  if (!posts || posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  return (
    <div className={styles.sliderContainer}>
      <div 
        className={styles.sliderTrack}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.slide}>
          <div className={styles.postBody}>
            <Quote className={styles.quoteIcon} />
            <div className={styles.postContent}>{currentPost.content}</div>
            {currentPost.imageUrl && (
              <div className={styles.postMedia}>
                <img src={currentPost.imageUrl} alt="Post image" />
              </div>
            )}
          </div>
          
          <div className={styles.postFooter}>
            <div className={styles.authorSection}>
              <img 
                src={currentPost.author.imageUrl || `https://ui-avatars.com/api/?name=${currentPost.author.name}&background=7B61FF&color=fff`} 
                className={styles.authorAvatar} 
              />
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>
                  {currentPost.author.name}
                  <span className={styles.roleBadge}>{currentPost.author.role}</span>
                </div>
                <div className={styles.authorSub}>
                  {currentPost.author.company || 'Legacy Member'} • {new Date(currentPost.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className={styles.navControls}>
              <button onClick={handlePrev} className={styles.navBtn} aria-label="Previous post">
                <ChevronLeft size={20} />
              </button>
              <div className={styles.counter}>
                {currentIndex + 1} / {posts.length}
              </div>
              <button onClick={handleNext} className={styles.navBtn} aria-label="Next post">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
