export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import CSVUploader from './CSVUploader';
import VerifiedEmailList from './VerifiedEmailList';
import UserApprovalList from './UserApprovalList';
import DuplicateReviewList from './DuplicateReviewList';
import OutreachCenter from './OutreachCenter';
import JobApprovalPanel from './JobApprovalPanel';
import UpdateApprovalPanel from './UpdateApprovalPanel';
import HomeManager from './HomeManager';
import NoticeManager from './NoticeManager';
import AdminJobPost from './AdminJobPost';
import CollapsibleList from './CollapsibleList';
import SiteSettings from '@/components/SiteSettings';
import { getAlumniCompanies, getOpenRegistrationStatus, getPendingLegacyPhotos, getPotentialDuplicates } from '@/actions/admin';
import styles from './page.module.css';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const session = await verifySession();
  
  if (session?.role !== 'ADMIN') redirect('/');

  const [users, verifiedEmails, verifiedCount, pendingJobs, pendingPosts, banners, companies, notices, alumniCompanies, openStatus, pendingPhotos, duplicates] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.verifiedEmail.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.verifiedEmail.count(),
    prisma.job.findMany({
      where: { status: 'PENDING' },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.post.findMany({
      where: { status: 'PENDING' },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.homeBanner.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    prisma.homeCompany.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    prisma.notice.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []),
    getAlumniCompanies(),
    getOpenRegistrationStatus(),
    getPendingLegacyPhotos(),
    getPotentialDuplicates()
  ]);

  const registeredEmails = new Set(users.map(u => u.email));
  const unregisteredVerified = verifiedEmails.filter(v => !registeredEmails.has(v.email));

  return (
    <div className={styles.container}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerTitle}>
          <h1>Admin Control Center</h1>
          <p>KecNetwork.in • Campus Oversight</p>
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
          <div className={styles.statCard}>
            <span className={styles.statVal} style={{ color: pendingPosts.length > 0 ? '#f59e0b' : 'inherit' }}>
              {pendingPosts.length}
            </span>
            <span className={styles.statLabel}>Updates Awaiting Review</span>
          </div>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.leftCol}>
          <section className={styles.section}>
            <h2>Site Governance & Toggle</h2>
            <SiteSettings initialOpenStatus={openStatus} pendingPhotos={pendingPhotos} />
          </section>

          <section className={styles.section} style={{ marginTop: '1.5rem' }}>
            <h2>Whitelist Management</h2>
            <CSVUploader />
            <div style={{ marginTop: '1.5rem' }}>
              <CollapsibleList title="CSV Whitelist Database" count={verifiedEmails.length}>
                <VerifiedEmailList initialEmails={verifiedEmails} />
              </CollapsibleList>
              <OutreachCenter unregisteredVerified={unregisteredVerified} />
            </div>
          </section>

          <section className={styles.section} style={{ marginTop: '1.5rem' }}>
            <h2>Home Page Content</h2>
            <HomeManager initialBanners={banners} initialCompanies={companies} profileCompanies={alumniCompanies} />
            <NoticeManager initialNotices={notices} />
          </section>
        </div>

        <div className={styles.rightCol}>
          <section className={styles.section}>
            <CollapsibleList title="Registered Member Directory" count={users.length}>
              <UserApprovalList initialUsers={users} />
            </CollapsibleList>
          </section>

          <section className={styles.section} style={{ marginTop: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Duplicate Account Audit
              {duplicates.length > 0 && (
                <span style={{
                  background: '#f59e0b', color: 'white', borderRadius: '20px',
                  fontSize: '0.7rem', padding: '0.15rem 0.6rem', fontWeight: 700
                }}>
                  {duplicates.length} clusters
                </span>
              )}
            </h2>
            <DuplicateReviewList duplicates={duplicates} />
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
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Update Approvals
              {pendingPosts.length > 0 && (
                <span style={{
                  background: '#7B61FF', color: 'white', borderRadius: '20px',
                  fontSize: '0.7rem', padding: '0.15rem 0.6rem', fontWeight: 700
                }}>
                  {pendingPosts.length} pending
                </span>
              )}
            </h2>
            <UpdateApprovalPanel initialPosts={pendingPosts} />
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
