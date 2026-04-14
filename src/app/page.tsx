export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  Plus, 
  Award,
  BookOpen
} from 'lucide-react';
import SyncButton from '@/components/SyncButton';
import styles from './page.module.css';

const prisma = new PrismaClient();

export default async function Home() {
  const session = await verifySession();
  
  const [alumniCount, studentCount, recentAlumni, recentStudents, recentJobs, user] = await Promise.all([
    prisma.verifiedEmail.count(),
    prisma.user.count({ where: { role: 'STUDENT', status: 'APPROVED' } }),
    prisma.user.findMany({
      where: { role: 'ALUMNI', status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.user.findMany({
      where: { role: 'STUDENT', status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { author: true }
    }),
    session?.userId ? prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, imageUrl: true, jobRole: true, company: true, branch: true }
    }) : Promise.resolve(null)
  ]);

  return (
    <div className="institutional-container">
      <div className={styles.standardGrid}>
        
        {/* Left Column: Profile Card */}
        <aside className={styles.leftCol}>
          <div className={styles.identityCard}>
            <div className={styles.coverBg}></div>
            <div className={styles.idContent}>
              <img 
                src={user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'K')}&background=7B61FF&color=fff`} 
                className={styles.idAvatar} 
              />
              <h3>{user?.name || 'Institutional Guest'}</h3>
              <p>{user?.jobRole || 'Future Leader'} {user?.company ? `@ ${user.company}` : ''}</p>
              <div className={styles.idStats}>
                 <div className={styles.idStatRow}>
                   <span>Network Strength</span>
                   <span className={styles.statVal}>{alumniCount + studentCount}</span>
                 </div>
                 <div className={styles.idStatRow}>
                   <span>Verified Alumni</span>
                   <span className={styles.statVal}>{alumniCount}</span>
                 </div>
              </div>
              <Link href="/dashboard" className={styles.idAction}>View My Dossier</Link>
            </div>
          </div>

          <div className={styles.quickLinks}>
             <p>Institutional Resources</p>
             <Link href="/directory"><Users size={16} /> Alumni Network</Link>
             <Link href="/students"><GraduationCap size={16} /> Student Talent</Link>
             <Link href="/jobs"><Briefcase size={16} /> Job Postings</Link>
          </div>
        </aside>

        {/* Center Column: Institutional Pulse Feed */}
        <main className={styles.centerCol}>
          <section className={styles.pulseHeader}>
            <div className={styles.pulseInfo}>
              <h2>Institutional Executive Pulse</h2>
              <p>Real-time evolution of the BTKIT (KEC) ecosystem</p>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardTitle}>
              <Plus size={18} /> Recent Alumni Joins
            </div>
            <div className={styles.userList}>
              {recentAlumni.map(u => (
                <div key={u.id} className={styles.userCell}>
                  <img src={u.imageUrl || `https://ui-avatars.com/api/?name=${u.name}&background=7B61FF&color=fff`} className={styles.cellAvatar} />
                  <div className={styles.cellText}>
                    <strong>{u.name}</strong>
                    <span>Class of {u.gradYear} • {u.branch}</span>
                  </div>
                  <SyncButton userId={u.id} label="Synchronize" />
                </div>
              ))}
            </div>
            <Link href="/directory" className={styles.footerLink}>Explore Full Alumni Directory ➔</Link>
          </section>

          <section className={styles.card}>
            <div className={styles.cardTitle}>
              <Award size={18} /> Emerging Student Talent
            </div>
            <div className={styles.userList}>
              {recentStudents.map(u => (
                <div key={u.id} className={styles.userCell}>
                  <img src={u.imageUrl || `https://ui-avatars.com/api/?name=${u.name}&background=7B61FF&color=fff`} className={styles.cellAvatar} />
                  <div className={styles.cellText}>
                    <strong>{u.name}</strong>
                    <span>Starting {u.startYear} • {u.branch}</span>
                  </div>
                  <SyncButton userId={u.id} label="Sync Talents" />
                </div>
              ))}
            </div>
            <Link href="/students" className={styles.footerLink}>Meet Rising Undergraduates ➔</Link>
          </section>
        </main>

        {/* Right Column: News & Careers */}
        <aside className={styles.rightCol}>
          <section className={styles.card}>
            <div className={styles.cardTitle}><Briefcase size={18} /> Career Pathway Pulse</div>
            <div className={styles.jobList}>
              {recentJobs.map(job => (
                <div key={job.id} className={styles.jobCell}>
                  <strong>{job.title}</strong>
                  <span>{job.company}</span>
                  <Link href="/jobs" className={styles.tinyLink}>View Details</Link>
                </div>
              ))}
            </div>
            <Link href="/jobs" className={styles.footerLink}>All Opportunities ➔</Link>
          </section>

          <section className={styles.card}>
            <div className={styles.cardTitle}><BookOpen size={18} /> Institutional Seat</div>
            <div className={styles.seatInfo}>
               <img src="https://upload.wikimedia.org/wikipedia/en/e/e0/Bipin_Tripathi_Kumaon_Institute_of_Technology_logo.png" className={styles.seatLogo} />
               <p>Bipin Tripathi Kumaon Institute of Technology (BTKIT), Dwarahat was established in 1991 as an autonomous institution.</p>
               <div className={styles.statBadge}>Legacy since 1991</div>
            </div>
          </section>
        </aside>

      </div>
    </div>
  );
}
