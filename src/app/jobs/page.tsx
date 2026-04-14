export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import Link from 'next/link';
import { Briefcase, Plus, TrendingUp, Info } from 'lucide-react';
import InterestTracker from './InterestTracker';
import styles from './page.module.css';

const prisma = new PrismaClient();

export default async function JobsPage() {
  const session = await verifySession();
  
  const [jobs, pendingCount] = await Promise.all([
    prisma.job.findMany({
      where: { status: 'APPROVED' },
      include: { 
        author: { select: { name: true } },
        interests: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    session?.role === 'ADMIN' ? prisma.job.count({ where: { status: 'PENDING' } }) : Promise.resolve(0)
  ]);

  return (
    <div className="institutional-container">
      <div className={styles.standardGrid}>
        
        {/* Left Sidebar: Actions & Context */}
        <aside className={styles.sidebar}>
          {session && session.role !== 'STUDENT' && (
            <div className={styles.actionCard}>
              <h3><Plus size={18} /> Opportunity Portal</h3>
              <p>Broadcast a professional opening to the validated KEC talent pool.</p>
              <Link href="/jobs/new" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Publish Opening
              </Link>
            </div>
          )}

          <div className={styles.statsCard}>
            <div className={styles.statHeader}>
              <TrendingUp size={18} />
              <span>Network Pulse</span>
            </div>
            <div className={styles.statRow}>
               <span>Active Openings</span>
               <span className={styles.statVal}>{jobs.length}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
             <Info size={16} />
             <p>All opportunities are verified by institutional alumni.</p>
          </div>
        </aside>

        {/* Main Content: The Job Board */}
        <main className={styles.mainContent}>
          <header className={styles.pageHeader}>
            <div className={styles.headerTitle}>
               <Briefcase size={32} className={styles.headerIcon} />
               <div>
                  <h1>KEC Career Pathways</h1>
                  <p>Verified professional opportunities from the institutional heritage</p>
               </div>
            </div>
          </header>

          <section className={styles.jobFeed}>
            {jobs.length === 0 ? (
              <div className={styles.emptyState}>
                <Briefcase size={48} className={styles.emptyIcon} />
                <h2>No active campaigns found</h2>
                <p>Wait for alumni to broadcast new openings or contribute your own to the network.</p>
              </div>
            ) : (
              jobs.map(job => {
                const isAuthor = session?.userId === job.authorId;
                const isAdmin = session?.role === 'ADMIN';
                const isInterested = job.interests.some(i => i.userId === session?.userId);
                const interestedUsers = job.interests.map(i => ({ name: i.user.name }));

                return (
                  <div key={job.id} className={styles.jobCard}>
                    <div className={styles.cardIndicator}>INSTITUTIONAL OPPORTUNITY</div>
                    <div className={styles.cardMain}>
                      <div className={styles.jobInfo}>
                        <h2 className={styles.jobTitle}>{job.title}</h2>
                        <h3 className={styles.companyName}>{job.company}</h3>
                        <p className={styles.jobDesc}>{job.description}</p>
                        
                        {job.link && (
                          <a href={job.link} target="_blank" rel="noopener noreferrer" className={styles.portalLink}>
                            Apply via Official Portal ↗
                          </a>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.posterMeta}>
                         <div className={styles.posterAvatar}>
                            {job.author.name[0]}
                         </div>
                         <div className={styles.posterInfo}>
                            <span>Broadcaster</span>
                            <strong>{job.author.name}</strong>
                         </div>
                      </div>
                      <InterestTracker 
                        jobId={job.id} 
                        isInterested={isInterested} 
                        interestCount={job.interests.length}
                        interestedUsers={interestedUsers}
                        isAuthor={isAuthor}
                        isAdmin={isAdmin}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
