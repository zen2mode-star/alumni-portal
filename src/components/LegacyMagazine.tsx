'use client';
import { useState, useEffect } from 'react';
import styles from './LegacyMagazine.module.css';

interface Photo {
  id: string;
  imageUrl: string;
  caption?: string | null;
  author: { name: string };
}

export default function LegacyMagazine({ photos }: { photos: Photo[] }) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(photos.length / 2);

  useEffect(() => {
    if (photos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPage((p) => (p + 1) % totalPages);
    }, 4000);
    return () => clearInterval(interval);
  }, [photos.length, totalPages]);

  if (photos.length === 0) return null;

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));

  return (
    <div className={styles.magazineContainer}>
      <div className={styles.book}>
        {Array.from({ length: totalPages }).map((_, i) => {
          const zIndex = totalPages - i;
          const isFlipped = i < currentPage;
          const photo1 = photos[i * 2];
          const photo2 = photos[i * 2 + 1];

          return (
            <div 
              key={i} 
              className={`${styles.page} ${isFlipped ? styles.flipped : ''}`}
              style={{ zIndex: isFlipped ? i : zIndex }}
            >
              {/* Front of the page (Right side if open) */}
              <div className={styles.front}>
                {photo1 ? (
                  <div className={styles.content}>
                    <img src={photo1.imageUrl} alt="Memory" />
                    <div className={styles.caption}>
                      <p>{photo1.caption || 'Institutional Memory'}</p>
                      <span>— {photo1.author.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.empty}>End of Batch Magazine</div>
                )}
                <div className={styles.pageNumber}>{i * 2 + 1}</div>
              </div>

              {/* Back of the page (Left side if flipped) */}
              <div className={styles.back}>
                {photo2 ? (
                  <div className={styles.content}>
                    <img src={photo2.imageUrl} alt="Memory" />
                    <div className={styles.caption}>
                      <p>{photo2.caption || 'Institutional Memory'}</p>
                      <span>— {photo2.author.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.empty}>KecNetwork.in Archives</div>
                )}
                <div className={styles.pageNumber}>{i * 2 + 2}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button onClick={prevPage} disabled={currentPage === 0}>Previous Page</button>
        <span className={styles.pageLabel}>Journal Page {currentPage + 1} / {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages - 1}>Next Page</button>
      </div>
    </div>
  );
}
