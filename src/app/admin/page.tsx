export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import CSVUploader from './CSVUploader';
import VerifiedEmailList from './VerifiedEmailList';
import UserApprovalList from './UserApprovalList';
import OutreachCenter from './OutreachCenter';
import JobApprovalPanel from './JobApprovalPanel';
import HomeManager from './HomeManager';
import AdminJobPost from './AdminJobPost';
import styles from './page.module.css';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const session = await verifySession();
  
  if (session?.role !== 'ADMIN') redirect('/');

  const [users, verifiedEmails, verifiedCount, pendingJobs, banners, companies] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.verifiedEmail.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.verifiedEmail.count(),
    prisma.job.findMany({
      where: { status: 'PENDING' },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.homeBanner.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    prisma.homeCompany.findMany({ orderBy: { order: 'asc' } }).catch(() => [])
  ]);

  const registeredEmails = new Set(users.map(u => u.email));
  const unregisteredVerified = verifiedEmails.filter(v => !registeredEmails.has(v.email));

  return (
    <div className={styles.container}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerTitle}>
          <h1>Admin Control Center</h1>
          <p>KecAlumni.in • Campus Oversight</p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statVal}>{verifiedCount}</span>
            <span className={styles.statLabel}>Verified Alumni</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statVal}>{users.filter(u => u.status === 'PENDING').length}</span>
            <span className={styles.statLabel}>Pending Users</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statVal} style={{ color: pendingJobs.length > 0 ? '#f59e0b' : 'inherit' }}>
              {pendingJobs.length}
            </span>
            <span className={styles.statLabel}>Jobs Awaiting Review</span>
          </div>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.leftCol}>
          <section className={styles.section}>
            <h2>Manage Access Whitelist</h2>
            <CSVUploader />
            <OutreachCenter unregisteredVerified={unregisteredVerified} />
            <br />
            <VerifiedEmailList initialEmails={verifiedEmails} />
          </section>

          <section className={styles.section} style={{ marginTop: '1.5rem' }}>
            <h2>Home Page Content</h2>
            <HomeManager initialBanners={banners} initialCompanies={companies} />
          </section>
        </div>

        <div className={styles.rightCol}>
          <section className={styles.section}>
            <UserApprovalList initialUsers={users} />
          </section>

          {/* Job Approval Section */}
          <section className={styles.section} style={{ marginTop: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Job Posting Approvals
              {pendingJobs.length > 0 && (
                <span style={{
                  background: '#f59e0b', color: 'white', borderRadius: '20px',
                  fontSize: '0.7rem', padding: '0.15rem 0.6rem', fontWeight: 700
                }}>
                  {pendingJobs.length} pending
                </span>
              )}
            </h2>
            <JobApprovalPanel initialJobs={pendingJobs} />
          </section>

          <section className={styles.section} style={{ marginTop: '1.5rem' }}>
             <h2>Post Campus Job</h2>
             <AdminJobPost />
          </section>
        </div>
      </div>
    </div>
  );
}
