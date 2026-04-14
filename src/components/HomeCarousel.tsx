'use client';
import { useState, useEffect } from 'react';
import styles from './HomeCarousel.module.css';

interface Banner {
  id: string;
  imageUrl: string;
  title?: string | null;
  link?: string | null;
}

interface Props {
  banners: Banner[];
}

export default function HomeCarousel({ banners }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className={styles.carouselContainer}>
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
          style={{ backgroundImage: `url(${banner.imageUrl})` }}
        >
          {banner.title && (
            <div className={styles.caption}>
              <h2>{banner.title}</h2>
              {banner.link && (
                <a href={banner.link} className="btn btn-primary">Learn More</a>
              )}
            </div>
          )}
        </div>
      ))}
      <div className={styles.indicators}>
        {banners.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
