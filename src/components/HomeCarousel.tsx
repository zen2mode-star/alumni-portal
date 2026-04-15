'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './HomeCarousel.module.css';

interface Props {
  banners: any[];
  events?: any[];
}

export default function HomeCarousel({ banners, events = [] }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine banners and events into a single slide array
  const allSlides = [
    ...banners.map(b => ({ ...b, type: 'banner' })),
    ...events.map(e => ({ 
      id: e.id, 
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070', // Thematic default for events
      title: e.title,
      date: new Date(e.date).toLocaleDateString(),
      link: '/events',
      type: 'event'
    }))
  ];

  useEffect(() => {
    if (allSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allSlides.length]);

  if (allSlides.length === 0) return null;

  return (
    <div className={styles.container}>
      {allSlides.map((slide, index) => (
        <div
          key={slide.id + index}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
        >
          <img src={slide.imageUrl} alt={slide.title || ''} className={styles.image} />
          <div className={styles.overlay}>
            <div className={styles.content}>
              {slide.type === 'event' && <span className={styles.eventBadge}>Upcoming Event • {slide.date}</span>}
              <h1 className={styles.title}>{slide.title}</h1>
              {slide.link && (
                <Link href={slide.link} className={styles.actionBtn}>
                  {slide.type === 'event' ? 'Join Community' : 'Learn More'}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {allSlides.length > 1 && (
        <div className={styles.indicators}>
          {allSlides.map((_, index) => (
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
