export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import CSVUploader from './CSVUploader';
import VerifiedEmailList from './VerifiedEmailList';
import UserApprovalList from './UserApprovalList';
import styles from './page.module.css';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const session = await verifySession();
  
  if (session?.role !== 'ADMIN') {
    redirect('/');
  }

  const [users, verifiedEmails] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.verifiedEmail.findMany({
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <div className={styles.container}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerTitle}>
          <h1>Admin Control Center</h1>
          <p>KecAlumini.in • Institutional Oversight</p>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statVal}>{users.length}</span>
            <span className={styles.statLabel}>Total Members</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statVal}>{users.filter(u => u.status === 'PENDING').length}</span>
            <span className={styles.statLabel}>Pending Approvals</span>
          </div>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.leftCol}>
          <section className={styles.section}>
            <h2>Manage Access Whitelist</h2>
            <CSVUploader />
            <VerifiedEmailList initialEmails={verifiedEmails} />
          </section>
        </div>

        <div className={styles.rightCol}>
          <section className={styles.section}>
            <UserApprovalList initialUsers={users} />
          </section>
        </div>
      </div>
    </div>
  );
}
