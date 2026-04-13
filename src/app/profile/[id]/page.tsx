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
  
  const alumniRecord = await prisma.user.findUnique({
    where: { id: resolvedParams.id }
  });
  
  if (!alumniRecord || alumniRecord.status !== 'APPROVED') {
    notFound();
  }

  const alumni = {
    id: alumniRecord.id,
    name: alumniRecord.name,
    role: alumniRecord.jobRole || 'Professional',
    company: alumniRecord.company || '',
    gradYear: alumniRecord.gradYear || 2020,
    department: alumniRecord.branch || 'BTKIT',
    imageUrl: alumniRecord.imageUrl || `https://ui-avatars.com/api/?name=${alumniRecord.name}`,
    bio: alumniRecord.bio || 'Happy to connect!',
    skills: alumniRecord.skills ? alumniRecord.skills.split(',') : [],
  };

  return (
    <div className={styles.container}>
      <div className={styles.backLink}>
        <Link href="/directory">&larr; Back to Directory</Link>
      </div>
      
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <img src={alumni.imageUrl} alt={alumni.name} className={styles.avatar} />
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>{alumni.name}</h1>
            <p className={styles.headline}>{alumni.role} {alumni.company ? `at ${alumni.company}` : ''}</p>
            <p className={styles.gradInfo}>Class of {alumni.gradYear} • {alumni.department}</p>
          </div>
        </div>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h2>About</h2>
            <p className={styles.bio}>{alumni.bio}</p>
          </section>
          
          <section className={styles.section}>
            <h2>Skills & Expertise</h2>
            <div className={styles.skills}>
              {alumni.skills.map(skill => (
                <span key={skill} className={styles.skillTag}>{skill}</span>
              ))}
            </div>
          </section>
        </div>
        
        <div className={styles.actions}>
          <Link href={`/messages?to=${alumni.id}`} className={styles.primaryButton} style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'}}>
            Message Alumni
          </Link>
        </div>
      </div>
    </div>
  );
}
