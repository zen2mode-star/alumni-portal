import Link from 'next/link';
import styles from './AlumniCard.module.css';

interface Props {
  alumni: any;
}

export default function AlumniCard({ alumni }: Props) {
  return (
    <div className={`${styles.card} card-entrance`}>
      <div className={styles.visuals}>
        <img src={alumni.imageUrl} alt={alumni.name} className={styles.avatar} />
        <div className={styles.batchPill}>{alumni.gradYear}</div>
      </div>
      
      <div className={styles.info}>
        <div className={styles.header}>
          <div className={styles.primaryInfo}>
            {alumni.designation && (
              <div className={styles.designationBadge}>{alumni.designation}</div>
            )}
            <h4 className={styles.name}>{alumni.name}</h4>
            <span className={styles.dept}>{alumni.department}</span>
          </div>
          {alumni.linkedinUrl && (
            <a href={alumni.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.linkedinIcon}>
              in
            </a>
          )}
        </div>
        
        {alumni.isStudent ? (
          <div className={styles.roleLine}>
            <span className={styles.studentBadge}>Emerging KEC Talent</span>
          </div>
        ) : (
          <div className={styles.roleLine}>
            <span className={styles.role}>{alumni.role}</span>
            <span className={styles.at}>@</span>
            <span className={styles.company}>{alumni.company}</span>
          </div>
        )}

        <p className={styles.bio}>{alumni.bio}</p>

        <div className={styles.actions}>
          <Link href={`/messages?to=${alumni.id}`} className={styles.primeBtn}>
            Message
          </Link>
          <Link href={`/profile/${alumni.id}`} className={styles.secBtn}>
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
