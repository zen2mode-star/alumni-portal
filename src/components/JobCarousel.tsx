'use client';
import { useState, useEffect } from 'react';
import styles from './JobCarousel.module.css';

interface Props {
  imageUrls: string[];
}

export default function JobCarousel({ imageUrls }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [imageUrls.length]);

  if (imageUrls.length === 0) return null;

  return (
    <div className={styles.container}>
      {imageUrls.map((url, index) => (
        <div
          key={url}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
        >
          <img src={url} alt={`Job detail ${index + 1}`} className={styles.image} />
        </div>
      ))}
      
      {imageUrls.length > 1 && (
        <div className={styles.indicators}>
          {imageUrls.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
