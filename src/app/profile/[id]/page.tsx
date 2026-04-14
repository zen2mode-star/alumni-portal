import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import styles from './page.module.css';

const prisma = new PrismaClient();

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const resolvedParams = await params;
  
  const alumni = await prisma.user.findUnique({
    where: { id: resolvedParams.id }
  });
  
  if (!alumni || alumni.status !== 'APPROVED') {
    notFound();
  }

  return (
    <div className={styles.container}>
      <header className={styles.identityHeader}>
        <div className={styles.auraBg}></div>
        <div className={styles.headerContent}>
          <img 
            src={alumni.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(alumni.name)}&background=0A1128&color=fff`} 
            alt={alumni.name} 
            className={styles.avatar} 
          />
          <div className={styles.headerInfo}>
            <div className={styles.badgeRow}>
              <span className={styles.roleBadge}>{alumni.role}</span>
              {alumni.hostel && <span className={styles.institutionalBadge}>{alumni.hostel} KEC Alum</span>}
            </div>
            <h1 className={styles.name}>{alumni.name}</h1>
            <p className={styles.headline}>
              {alumni.jobRole || 'KEC Fellow'} {alumni.company ? `@ ${alumni.company}` : ''}
            </p>
            <div className={styles.metaRow}>
              <span>📍 {alumni.location || 'Dwarahat'}</span>
              <span>🎓 Class of {alumni.gradYear}</span>
              <span>📂 {alumni.branch}</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <Link href={`/messages?to=${alumni.id}`} className="btn btn-primary">Send Message</Link>
          </div>
        </div>
      </header>
      
      <div className={styles.profileGrid}>
        <div className={styles.mainCol}>
          <section className={styles.card}>
            <h3>Career Journey</h3>
            <p className={styles.bio}>{alumni.bio || 'This member has not yet updated their career story.'}</p>
          </section>

          {(alumni.achievements || alumni.higherStudies) && (
            <section className={styles.card}>
              <h3>Professional Milestones</h3>
              {alumni.higherStudies && (
                <div className={styles.milestone}>
                  <strong>Higher Education</strong>
                  <p>{alumni.higherStudies}</p>
                </div>
              )}
              {alumni.achievements && (
                <div className={styles.milestone}>
                  <strong>Awards & Honors</strong>
                  <p>{alumni.achievements}</p>
                </div>
              )}
            </section>
          )}

          <section className={styles.card}>
            <h3>Strategic Expertise</h3>
            <div className={styles.skillGrid}>
              {alumni.skills ? alumni.skills.split(',').map(skill => (
                <span key={skill} className={styles.skillTag}>{skill.trim()}</span>
              )) : <p>No expertise markers identified.</p>}
            </div>
          </section>
        </div>

        <aside className={styles.sideCol}>
          <section className={styles.card}>
            <h3>Academic Roots</h3>
            <div className={styles.rootItem}>
              <label>Roll Number</label>
              <span>{alumni.rollNumber || 'Not Stated'}</span>
            </div>
            <div className={styles.rootItem}>
              <label>Hostel Residency</label>
              <span>{alumni.hostel || 'Not Stated'}</span>
            </div>
            <div className={styles.rootItem}>
              <label>Academic Branch</label>
              <span>{alumni.branch}</span>
            </div>
          </section>

          <section className={styles.card}>
            <h3>Digital Connectivity</h3>
            <div className={styles.socialLinks}>
              {alumni.linkedinUrl && <a href={alumni.linkedinUrl} target="_blank" className={styles.socialLink}>LinkedIn Profile ↗</a>}
              {alumni.githubUrl && <a href={alumni.githubUrl} target="_blank" className={styles.socialLink}>GitHub Portfolio ↗</a>}
              {alumni.twitterUrl && <a href={alumni.twitterUrl} target="_blank" className={styles.socialLink}>Twitter / X ↗</a>}
              {alumni.website && <a href={alumni.website} target="_blank" className={styles.socialLink}>Personal Website ↗</a>}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
