'use client';
import { useState, useEffect } from 'react';
import styles from './SidebarSlideshow.module.css';

interface Props {
  banners: { id: string; imageUrl: string; title?: string | null }[];
}

export default function SidebarSlideshow({ banners }: Props) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  if (banners.length === 0) return null;

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.headerLabel}>
        <span className={styles.liveIndicator} />
        Campus Gallery
      </div>
      <div className={styles.viewport}>
        {banners.map((b, i) => (
          <div
            key={b.id}
            className={`${styles.slide} ${i === current ? styles.active : ''}`}
          >
            <img src={b.imageUrl} alt={b.title || 'Campus'} />
          </div>
        ))}
      </div>
      {banners[current]?.title && (
        <div className={styles.caption}>{banners[current].title}</div>
      )}
      {banners.length > 1 && (
        <div className={styles.dots}>
          {banners.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.activeDot : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
      <div className={styles.counter}>
        {current + 1} / {banners.length}
      </div>
    </div>
  );
}
