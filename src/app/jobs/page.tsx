export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import Link from 'next/link';
import ApplyButton from './ApplyButton';
import styles from './page.module.css';

const prisma = new PrismaClient();

export default async function JobsPage() {
  const session = await verifySession();
  const jobs = await prisma.job.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Opportunities Board</h1>
        {session && session.role !== 'STUDENT' && (
          <Link href="/jobs/new" className={styles.primaryButton}>Post a Job</Link>
        )}
      </div>
      <div className={styles.grid}>
        {jobs.length === 0 ? (
          <div className={styles.emptyState}>No opportunities posted yet.</div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className={styles.jobCard}>
              <h2>{job.title}</h2>
              <p className={styles.company}>{job.company}</p>
              <p className={styles.desc}>{job.description}</p>
              <div className={styles.footer}>
                <span>Posted by {job.author.name}</span>
                <ApplyButton jobId={job.id} authorId={job.authorId} jobTitle={job.title} />
              </div>
            </div>
          ))
        )}
        
        {/* Placeholder Demo Job */}
        {jobs.length === 0 && (
           <div className={styles.jobCard}>
             <h2>Software Engineer Intern</h2>
             <p className={styles.company}>Microsoft, Hyderabad</p>
             <p className={styles.desc}>Looking for a passionate 3rd-year CS student to join our summer internship program. BTKIT students encouraged to apply!</p>
             <div className={styles.footer}>
               <span>Posted by Pankaj Sharma</span>
               <button className={styles.applyBtn} disabled>Demo Only</button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
