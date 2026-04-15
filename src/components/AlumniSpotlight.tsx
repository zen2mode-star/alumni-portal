'use client';
import Link from 'next/link';
import { Award, Quote, ChevronRight, MessageSquare } from 'lucide-react';
import styles from './AlumniSpotlight.module.css';

interface SpotlightProps {
  member: any;
}

export default function AlumniSpotlight({ member }: SpotlightProps) {
  if (!member) return null;

  return (
    <div className={styles.spotlightContainer}>
      <div className={styles.badge}>
        <Award size={14} />
        ALUMNUS SPOTLIGHT
      </div>
      
      <div className={styles.mainLayout}>
        <div className={styles.visuals}>
          <img 
            src={member.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=7B61FF&color=fff`} 
            alt={member.name} 
            className={styles.avatar} 
          />
          <div className={styles.yearTag}>Batch of {member.gradYear}</div>
        </div>

        <div className={styles.content}>
          <h2 className={styles.name}>{member.name}</h2>
          <p className={styles.role}>{member.jobRole} @ {member.company}</p>
          
          <div className={styles.narrative}>
            <Quote className={styles.quoteIcon} size={20} />
            <p>{member.spotlightBio || member.bio || "Leading excellence through the KEC legacy."}</p>
          </div>

          <div className={styles.actions}>
            <Link href={`/profile/${member.id}`} className={styles.primeBtn}>
              View Journey <ChevronRight size={16} />
            </Link>
            <Link href={`/messages?to=${member.id}`} className={styles.secBtn}>
              <MessageSquare size={16} /> Reach Out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
