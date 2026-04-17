'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  GraduationCap, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
  History
} from 'lucide-react';
import { logout } from '@/actions/auth';
import ThemeToggle from './ThemeToggle';
import styles from './TopNavbar.module.css';

interface Props {
  user: any;
  unreadCount: number;
  latestUnread: any;
  isAdmin: boolean;
  latestPostTime?: string | null;
  logoUrl?: string | null;
}

export default function TopNavbar({ user, unreadCount, isAdmin, latestPostTime, logoUrl }: Props) {
  const [isMeOpen, setIsMeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNewPosts, setHasNewPosts] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (latestPostTime) {
      const lastSeen = localStorage.getItem('lastSeenKecPostTime');
      if (!lastSeen || new Date(latestPostTime) > new Date(lastSeen)) {
        setHasNewPosts(true);
      }
    }
  }, [latestPostTime]);

  useEffect(() => {
    if (pathname === '/feed') {
      localStorage.setItem('lastSeenKecPostTime', new Date().toISOString());
      setHasNewPosts(false);
    }
  }, [pathname]);

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Alumni Network', icon: Users, href: '/directory' },
    { label: 'KEC Staff', icon: UserCheck, href: '/staff' },
    { label: 'Undergrad Network', icon: GraduationCap, href: '/students' },
    { label: 'Legacy Wall', icon: History, href: '/legacy' },
    { label: 'Faculty', icon: UserCheck, href: '/faculty' },
    { label: 'Careers', icon: Briefcase, href: '/jobs' },
    { label: 'Messages', icon: MessageSquare, href: '/messages', badge: unreadCount },
    { label: 'Kec Feed', icon: Bell, href: '/feed' },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Left: Brand & Search */}
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <img src={logoUrl || "/btkit-logo.png"} alt="BTKIT" className={styles.kecLogo} />
            <span className={styles.brandName}>KecAlumni<span className={styles.brandDot}>.in</span></span>
          </Link>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input type="text" placeholder="Search Kec Feed..." className={styles.searchInput} />
          </div>
        </div>

        {/* Center/Right: Nav Links */}
        <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label} 
                href={item.href} 
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge && item.badge > 0 && <span className={styles.badge}>{item.badge}</span>}
                  {item.label === 'Kec Feed' && hasNewPosts && !isActive && <span className={styles.notificationDot}></span>}
                </div>
                <span className={styles.label}>{item.label}</span>
              </Link>
            );
          })}

          <div className={styles.divider}></div>

          {/* Profile 'Me' Dropdown */}
          {user ? (
            <div className={styles.meDropdown}>
              <button 
                className={styles.meTrigger} 
                onClick={() => setIsMeOpen(!isMeOpen)}
              >
                <img 
                  src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7B61FF&color=fff`} 
                  alt="Me" 
                  className={styles.meAvatar} 
                />
                <span className={styles.meLabel}>Me ▼</span>
              </button>
              
              {isMeOpen && (
                <div className={styles.dropdownMenu} onMouseLeave={() => setIsMeOpen(false)}>
                   <div className={styles.userHead}>
                     <strong>{user.name}</strong>
                     <Link href="/dashboard" onClick={() => setIsMeOpen(false)}>View Profile</Link>
                   </div>
                   <div className={styles.menuLinks}>
                     {isAdmin && (
                       <Link href="/admin" onClick={() => setIsMeOpen(false)}>
                         <Settings size={16} /> Admin Dashboard
                       </Link>
                     )}
                     <div className={styles.themeRow}>
                        <span>Appearance</span>
                        <ThemeToggle />
                     </div>
                     <form action={logout}>
                       <button type="submit" className={styles.logoutBtn}>
                         <LogOut size={16} /> Log Out
                       </button>
                     </form>
                   </div>
                </div>
              )}
            </div>
          ) : (
             <Link href="/login" className={styles.authLink}>Login / Register</Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className={styles.mobileToggle} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
}
