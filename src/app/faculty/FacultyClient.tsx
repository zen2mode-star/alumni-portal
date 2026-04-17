"use client";
import { useState, useMemo } from 'react';
import { Search, GraduationCap, Mail, Phone, ExternalLink, BookOpen, Award, Users, CheckCircle } from 'lucide-react';
import { departmentColors, getTotalFacultyCount } from '@/data/faculty';
import styles from './page.module.css';

interface FacultyMemberExtended {
  name: string;
  position: string;
  phone?: string;
  email?: string;
  department: string;
  departmentShort: string;
  qualification?: string;
  areaOfInterest?: string;
  profileUrl: string;
  imageUrl?: string;
  bio?: string;
  isRegistered?: boolean;
}

interface FacultyClientProps {
  initialDepartments: {
    name: string;
    shortName: string;
    members: FacultyMemberExtended[];
  }[];
}

function getImageUrl(profileUrl: string, name: string, dbImageUrl?: string): string {
  if (dbImageUrl) return dbImageUrl;
  
  // Extract slug from profile URL for potential image mapping (though we removed the hardcoded list)
  // We can still use a simplified fallback or use the database image
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7B61FF&color=fff&size=300`;
}

function getPositionBadge(position: string): { label: string; className: string } {
  const posLower = position.toLowerCase();
  if (posLower.includes('professor') && !posLower.includes('assistant') && !posLower.includes('associate')) {
    return { label: 'Professor', className: styles.positionProfessor };
  }
  if (posLower.includes('associate')) {
    return { label: 'Associate', className: styles.positionAssociate };
  }
  if (posLower.includes('assistant')) {
    return { label: 'Asst. Prof.', className: styles.positionAssistant };
  }
  return { label: position.split('(')[0].trim(), className: styles.positionOther };
}

export default function FacultyClient({ initialDepartments }: FacultyClientProps) {
  const [activeDept, setActiveDept] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const totalCount = initialDepartments.reduce((sum, d) => sum + d.members.length, 0);

  const filteredDepartments = useMemo(() => {
    return initialDepartments
      .filter(dept => activeDept === 'ALL' || dept.shortName === activeDept)
      .map(dept => ({
        ...dept,
        members: dept.members.filter(m => {
          if (!searchTerm) return true;
          const q = searchTerm.toLowerCase();
          return (
            m.name.toLowerCase().includes(q) ||
            m.position.toLowerCase().includes(q) ||
            m.department.toLowerCase().includes(q) ||
            (m.areaOfInterest?.toLowerCase().includes(q)) ||
            (m.qualification?.toLowerCase().includes(q))
          );
        })
      }))
      .filter(dept => dept.members.length > 0);
  }, [activeDept, searchTerm, initialDepartments]);

  const filteredCount = filteredDepartments.reduce((sum, d) => sum + d.members.length, 0);

  return (
    <div className={styles.pageWrapper}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <GraduationCap size={14} />
            Official Faculty Directory
          </div>
          <h1 className={styles.heroTitle}>BTKIT Faculty & Staff</h1>
          <p className={styles.heroSubtitle}>
            Meet the distinguished educators shaping the future at Bipin Tripathi Kumaon Institute of Technology
          </p>
          <div className={styles.heroStatsRow}>
            <div className={styles.heroStatBox}>
              <span className={styles.heroStatNum}>{totalCount}</span>
              <span className={styles.heroStatLabel}>Faculty Members</span>
            </div>
            <div className={styles.heroStatBox}>
              <span className={styles.heroStatNum}>{initialDepartments.length}</span>
              <span className={styles.heroStatLabel}>Departments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search faculty by name, department, or area of interest..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Department Filter Tabs */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterTab} ${activeDept === 'ALL' ? styles.filterTabActive : ''}`}
          onClick={() => setActiveDept('ALL')}
        >
          All Departments ({totalCount})
        </button>
        {initialDepartments.map(dept => (
          <button
            key={dept.shortName}
            className={`${styles.filterTab} ${activeDept === dept.shortName ? styles.filterTabActive : ''}`}
            onClick={() => setActiveDept(dept.shortName)}
          >
            {dept.shortName} ({dept.members.length})
          </button>
        ))}
      </div>

      {/* Department Sections */}
      {filteredDepartments.map(dept => (
        <section key={dept.shortName} className={styles.deptSection}>
          <div className={styles.deptHeader}>
            <div
              className={styles.deptIcon}
              style={{ background: departmentColors[dept.shortName] || '#7B61FF' }}
            >
              {dept.shortName}
            </div>
            <div className={styles.deptInfo}>
              <h2>{dept.name}</h2>
              <span>{dept.members.length} member{dept.members.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className={styles.facultyGrid}>
            {dept.members.map((member, idx) => {
              const badge = getPositionBadge(member.position);
              return (
                <div
                  key={`${member.name}-${idx}`}
                  className={styles.card}
                  style={{ '--accent': departmentColors[dept.shortName] || '#7B61FF' } as React.CSSProperties}
                >
                  {member.isRegistered && (
                    <div className={styles.verifiedBadge} title="Registered Campus Member">
                      <CheckCircle size={14} /> Claimed
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: departmentColors[dept.shortName] || '#7B61FF',
                    borderRadius: '16px 16px 0 0', opacity: 0.6
                  }} />
                  <div className={styles.avatarWrap}>
                    <img
                      src={getImageUrl(member.profileUrl, member.name, member.imageUrl)}
                      alt={member.name}
                      className={styles.avatar}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=7B61FF&color=fff&size=300`;
                      }}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardName}>
                      {member.name}
                    </h3>
                    <span className={`${styles.positionBadge} ${badge.className}`}>
                      {member.position}
                    </span>

                    {member.qualification && (
                      <p className={styles.qualification}>
                        <Award size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        {member.qualification}
                      </p>
                    )}

                    {member.areaOfInterest && (
                      <p className={styles.areaOfInterest}>
                        <span className={styles.areaLabel}>Research: </span>
                        {member.areaOfInterest}
                      </p>
                    )}

                    <div className={styles.contactRow}>
                      {member.email && (
                        <a href={`mailto:${member.email}`} className={styles.contactChip} title={member.email}>
                          <Mail size={11} /> Email
                        </a>
                      )}
                      {member.phone && (
                        <a href={`tel:${member.phone}`} className={styles.contactChip} title={member.phone}>
                          <Phone size={11} /> Call
                        </a>
                      )}
                      <a href={member.profileUrl} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
                        <ExternalLink size={11} /> KEC Profile
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {filteredDepartments.length === 0 && (
        <div className={styles.emptyState}>
          <Users size={48} className={styles.emptyIcon} />
          <p>No faculty members match your search criteria.</p>
        </div>
      )}

      {/* Source Attribution */}
      <div className={styles.sourceNote}>
        Faculty data sourced from{' '}
        <a href="https://kecua.ac.in/index.php/faculty-2/" target="_blank" rel="noopener noreferrer">
          kecua.ac.in
        </a>
        {' '}• Last synced: April 2026 • {filteredCount} of {totalCount} faculty shown
      </div>
    </div>
  );
}
