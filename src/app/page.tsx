export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { Award, BookOpen, Briefcase, GraduationCap, Plus, Users, Image as ImageIcon, Sparkles, TrendingUp, Calendar, Megaphone, Building2, UserCheck } from 'lucide-react';
import CommunitySlider from '@/components/CommunitySlider';
import SyncButton from '@/components/SyncButton';
import SidebarSlideshow from '@/components/SidebarSlideshow';
import AlumniCompanies from '@/components/AlumniCompanies';
import CampusPulse from '@/components/CampusPulse';
import AlumniSpotlight from '@/components/AlumniSpotlight';
import CareerInfographic from '@/components/CareerInfographic';
import { normalizeBranch } from '@/lib/normalize';
import styles from './page.module.css';

const prisma = new PrismaClient();

export default async function Home() {
  const session = await verifySession();

  const [alumniCount, staffCount, studentCount, recentAlumni, recentStudents, campusJobs, user, recentBanners, recentCompanies, recentPosts, recentEvents, assets, notices, spotlight, companyStats] = await Promise.all([
    prisma.user.count({ where: { role: 'ALUMNI', status: 'APPROVED' } }),
    prisma.user.count({ where: { role: 'STAFF', status: 'APPROVED' } }),
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
    // Only fetch admin-posted campus jobs (not regular alumni/student job posts)
    prisma.job.findMany({
      where: { status: 'APPROVED', author: { role: 'ADMIN' } },
      include: { author: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 6
    }),
    session?.userId ? prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, imageUrl: true, jobRole: true, company: true, branch: true }
    }) : Promise.resolve(null),
    prisma.homeBanner.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    prisma.homeCompany.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    prisma.post.findMany({
      where: { status: 'APPROVED' },
      include: { author: { select: { name: true, role: true, imageUrl: true, company: true } } },
      orderBy: { createdAt: 'desc' },
      take: 4
    }).catch(() => []),
    prisma.event.findMany({
      where: { status: 'APPROVED' },
      include: { author: { select: { name: true } } },
      orderBy: { date: 'asc' },
      take: 3
    }).catch(() => []),
    prisma.siteAsset.findMany().catch(() => []),
    prisma.notice.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }).catch(() => []),
    prisma.user.findFirst({ where: { isSpotlight: true } }).catch(() => null),
    prisma.user.groupBy({
      by: ['company'],
      _count: { company: true },
      where: { role: 'ALUMNI', company: { not: null } },
      orderBy: { _count: { company: 'desc' } },
      take: 5
    })
  ]);

  const formattedStats = companyStats
    .filter(s => s.company)
    .map(s => ({ name: s.company as string, count: s._count.company }));

  const assetMap = Object.fromEntries(assets.map(a => [a.key, a.url]));

  // Use all banners for the sidebar slideshow (no limit)
  const displayBanners = recentBanners.length > 0 ? recentBanners : [
    { id: '1', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070', title: 'Welcome to KEC Alumni Portal', link: '/directory' },
    { id: '2', imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070', title: 'Connecting Generations of Excellence', link: '/feed' }
  ];

  const displayCompanies = recentCompanies.length > 0 ? recentCompanies : [
    { id: 'c1', name: 'Google' }, { id: 'c2', name: 'Microsoft' }, { id: 'c3', name: 'Amazon' },
    { id: 'c4', name: 'Adobe' }, { id: 'c5', name: 'Meta' }, { id: 'c6', name: 'Infosys' }
  ];

  return (
    <div className="kec-container">
      {/* Compact hero strip instead of a full-width broad carousel */}
      <div className={styles.heroStrip}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            KEC Network
          </div>
          <h1 className={styles.heroTitle}>
            Welcome back, <span>{user?.name || 'Explorer'}</span>
          </h1>
          <p className={styles.heroSub}>
            Live community pulse: {alumniCount + staffCount + studentCount} members across the KEC Network
          </p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>{alumniCount}</span>
            <span className={styles.heroStatLabel}>Alumni</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>{staffCount}</span>
            <span className={styles.heroStatLabel}>KEC Staff</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>{studentCount}</span>
            <span className={styles.heroStatLabel}>Students</span>
          </div>
        </div>
      </div>

      <div className={styles.standardGrid}>

        {/* Left Column: Profile Card */}
        <aside className={styles.leftCol}>
          <div className={styles.identityCard}>
            <div
              className={styles.coverBg}
              style={assetMap.DEFAULT_COVER ? { backgroundImage: `url(${assetMap.DEFAULT_COVER})` } : {}}
            ></div>
            <div className={styles.idContent}>
              <img
                src={user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'K')}&background=7B61FF&color=fff`}
                className={styles.idAvatar}
              />
              <h3>{user?.name || 'Campus Guest'}</h3>
              <p>{user?.jobRole || 'Member'} {user?.company ? `@ ${user.company}` : ''}</p>
              <div className={styles.idStats}>
                <div className={styles.idStatRow}>
                  <span>Network Sync</span>
                  <span className={styles.statVal}>{alumniCount + staffCount + studentCount}</span>
                </div>
                <div className={styles.idStatRow}>
                  <span>Your Branch</span>
                  <span className={styles.statVal}>{normalizeBranch(user?.branch)}</span>
                </div>
              </div>
              <Link href="/dashboard" className={styles.idAction}>View My Profile</Link>
            </div>
          </div>

          <div className={styles.quickLinks}>
            <p>Campus Resources</p>
            <Link href="/directory"><Users size={16} /> Member Network</Link>
            <Link href="/directory?role=STUDENT"><GraduationCap size={16} /> Student Talent</Link>
            <Link href="/directory?role=STAFF"><UserCheck size={16} /> Staff & Faculty</Link>
            <Link href="/jobs"><Briefcase size={16} /> Job Postings</Link>
          </div>

          <CareerInfographic companies={formattedStats} totalAlumni={alumniCount} />
        </aside>

        {/* Center Column: Social Community Feed */}
        <main className={styles.centerCol}>
          <section className={styles.pulseHeader}>
            <div className={styles.pulseInfo}>
              <h2>KEC Community Pulse</h2>
              <p>Real-time ecosystem highlights from BTKIT (KEC) heritage</p>
            </div>
          </section>

          {spotlight && <AlumniSpotlight member={spotlight} />}

          <CommunitySlider posts={recentPosts} />

          <div className={styles.sectionHeader} style={{ marginTop: '2.5rem' }}>
            <Plus size={18} /> New Members
          </div>

          <section className={styles.card}>
            <div className={styles.userList}>
              {recentAlumni.map(u => (
                <div key={u.id} className={styles.userCell}>
                  <img src={u.imageUrl || `https://ui-avatars.com/api/?name=${u.name}&background=7B61FF&color=fff`} className={styles.cellAvatar} />
                  <div className={styles.cellText}>
                    <strong>{u.name}</strong>
                    <span>Class of {u.gradYear} • {normalizeBranch(u.branch)}</span>
                  </div>
                  <SyncButton userId={u.id} label="Synchronize" />
                </div>
              ))}
            </div>
            <Link href="/directory" className={styles.footerLink}>Explore Full Alumni Directory ➔</Link>
          </section>
        </main>

        {/* Right Column: Gallery + Campus Vacancies + Notice Board */}
        <aside className={styles.rightCol}>
          <CampusPulse />

          {/* Sidebar Slideshow — uses all uploaded banners */}
          <SidebarSlideshow banners={displayBanners} />

          {/* Upcoming Events */}
          {recentEvents.length > 0 && (
            <section className={styles.card}>
              <div className={styles.cardTitle}><Calendar size={18} /> Upcoming Events</div>
              <div className={styles.eventList}>
                {recentEvents.map(ev => (
                  <div key={ev.id} className={styles.eventCell}>
                    <div className={styles.eventDate}>
                      <span className={styles.eventDay}>{new Date(ev.date).getDate()}</span>
                      <span className={styles.eventMonth}>{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className={styles.eventInfo}>
                      <strong>{ev.title}</strong>
                      <span>by {ev.author.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Campus Vacancies — only admin-posted college jobs */}
          <section className={styles.card}>
            <div className={styles.cardTitle}><Building2 size={18} /> Campus Vacancies</div>
            <div className={styles.jobList}>
              {campusJobs.map(job => (
                <div key={job.id} className={styles.jobSidebarCell}>
                  <div className={styles.jobSidebarHeader}>
                    <strong>{job.title}</strong>
                    <span className={styles.campusTag}>CAMPUS</span>
                  </div>
                  <div className={styles.jobSidebarSub}>
                    {job.company}
                  </div>
                  <Link href="/jobs" className={styles.tinyActionLink}>View Details ➔</Link>
                </div>
              ))}
              {campusJobs.length === 0 && <p className={styles.emptyHint}>No campus vacancies at the moment.</p>}
            </div>
            <Link href="/jobs" className={styles.footerLink}>View All Vacancies</Link>
          </section>

          {/* Notice Board — admin-published notices */}
          <section className={styles.card}>
            <div className={styles.cardTitle}><Megaphone size={18} /> Notice Board</div>
            <div className={styles.noticeList}>
              {notices.map((n: any) => (
                <div key={n.id} className={styles.noticeCell}>
                  <div className={styles.noticeHeader}>
                    <strong>{n.title}</strong>
                    {n.priority === 'URGENT' && <span className={styles.urgentTag}>URGENT</span>}
                    {n.priority === 'IMPORTANT' && <span className={styles.importantTag}>IMPORTANT</span>}
                  </div>
                  <p className={styles.noticeContent}>{n.content}</p>
                  <div className={styles.noticeMeta}>
                    <span className={styles.noticeDesignation}>— {n.designation}</span>
                    <span className={styles.noticeDate}>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {notices.length === 0 && <p className={styles.emptyHint}>No notices posted yet.</p>}
            </div>
          </section>
        </aside>

      </div>
      <AlumniCompanies companies={displayCompanies} />
    </div>
  );
}
