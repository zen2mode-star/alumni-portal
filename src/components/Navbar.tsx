import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { logout } from '@/actions/auth';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

const prisma = new PrismaClient();

export default async function Navbar() {
  const session = await verifySession();
  
  let unreadCount = 0;
  let user = null;

  if (session?.userId) {
    [unreadCount, user] = await Promise.all([
      prisma.message.count({
        where: {
          receiverId: session.userId,
          read: false
        }
      }),
      prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true, imageUrl: true }
      })
    ]);
  }

  return (
    <nav className={styles.sidebar}>
      <header className={styles.brand}>
        <div className={styles.logoSquare}>K</div>
        <div className={styles.brandInfo}>
          <Link href="/" className={styles.siteTitle}>KecAlumini</Link>
          <span className={styles.siteSubtitle}>Institutional Portal</span>
        </div>
      </header>

      <div className={styles.navSection}>
        <span className={styles.sectionLabel}>Network</span>
        <ul className={styles.navList}>
          <li><Link href="/" className={styles.navItem}>🏛 Overview</Link></li>
          <li><Link href="/directory" className={styles.navItem}>🎓 Directory</Link></li>
        </ul>

        <span className={styles.sectionLabel}>Opportunities</span>
        <ul className={styles.navList}>
          <li><Link href="/jobs" className={styles.navItem}>💼 Careers</Link></li>
          <li><Link href="/events" className={styles.navItem}>📅 Calendars</Link></li>
        </ul>

        {session && (
          <>
            <span className={styles.sectionLabel}>Communication</span>
            <ul className={styles.navList}>
              <li>
                <Link href="/messages" className={styles.navItem}>
                  ✉️ Inbox
                  {unreadCount > 0 && <span className={styles.unreadPill}>{unreadCount}</span>}
                </Link>
              </li>
            </ul>
          </>
        )}

        {session?.role === 'ADMIN' && (
          <>
            <span className={styles.sectionLabel}>Administration</span>
            <ul className={styles.navList}>
              <li><Link href="/admin" className={styles.navItem}>⚙️ Command Center</Link></li>
            </ul>
          </>
        )}
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.appearance}>
           <span>Theme</span>
           <ThemeToggle />
        </div>

        {session ? (
          <div className={styles.userProfile}>
            <Link href="/dashboard" className={styles.userTrigger}>
              <img 
                src={user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=0A1128&color=fff`} 
                alt="Me" 
                className={styles.userAvatar} 
              />
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user?.name}</span>
                <span className={styles.viewProfile}>Dashboard ➔</span>
              </div>
            </Link>
            <form action={logout}>
              <button type="submit" className={styles.logoutBtn}>Sign Out</button>
            </form>
          </div>
        ) : (
          <div className={styles.authStack}>
            <Link href="/login" className={styles.loginBtn}>Portal Login</Link>
            <Link href="/register" className={styles.registerBtn}>Join Network</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
