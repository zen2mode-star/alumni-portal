"use client";
import { useState, useMemo } from 'react';
import { Search, GraduationCap, Mail, Phone, ExternalLink, BookOpen, Award, Users } from 'lucide-react';
import { departments, departmentColors, getTotalFacultyCount } from '@/data/faculty';
import type { FacultyMember } from '@/data/faculty';
import styles from './page.module.css';

// Map from faculty profile URL slug to image URL
const facultyImages: Record<string, string> = {
  "dr-kunwar-singh-vaisla": "https://kecua.ac.in/wp-content/uploads/2024/06/KSV-photo-300x300.jpg",
  "dr-ajit-singh": "https://kecua.ac.in/wp-content/uploads/2024/06/ajit-300x300.jpg",
  "dr-rajendra-kumar-bharti": "https://kecua.ac.in/wp-content/uploads/2024/06/Dr-Rajendra-Kumar-Bharti-300x300.jpg",
  "dr-archana-verma": "https://kecua.ac.in/wp-content/uploads/2024/06/archana-300x300.jpg",
  "mrs-swati-verma": "https://kecua.ac.in/wp-content/uploads/2024/06/swati-300x300.png",
  "mr-ramesh-belwal": "https://kecua.ac.in/wp-content/uploads/2024/06/rameshsir-300x300.png",
  "dr-sachin-gaur": "https://kecua.ac.in/wp-content/uploads/2024/06/sachin-gaur-300x300.jpg",
  "mrs-anindita-saha-2": "https://kecua.ac.in/wp-content/uploads/2024/06/anindita-300x300.png",
  "mrs-anindita-saha": "https://kecua.ac.in/wp-content/uploads/2024/06/bhawna-300x300.png",
  "dr-vishal-kumar": "https://kecua.ac.in/wp-content/uploads/2024/06/vishal-300x300.jpg",
  "dr-kapil-chaudhary": "https://kecua.ac.in/wp-content/uploads/2024/06/kapil-300x300.jpg",
  "mr-deepak-harbola": "https://kecua.ac.in/wp-content/uploads/2024/06/deapak-harbola-300x300.png",
  "mr-rajeev-chanyal": "https://kecua.ac.in/wp-content/uploads/2024/06/rajeev-300x300.png",
  "mrs-poonam-chimwal": "https://kecua.ac.in/wp-content/uploads/2024/06/poonam-300x300.png",
  "mr-kuber-singh": "https://kecua.ac.in/wp-content/uploads/2024/06/kuber-300x300.png",
  "mrs-jyoti-harbola": "https://kecua.ac.in/wp-content/uploads/2024/06/jyoti-300x300.png",
  "dr-anirudh-gupta": "https://kecua.ac.in/wp-content/uploads/2024/06/Dr-Anirudh-Gupta-300x300.jpg",
  "dr-satyendra-singh": "https://kecua.ac.in/wp-content/uploads/2024/06/Dr-Satyendra-Singh-300x300.jpg",
  "dr-ravi-kumar": "https://kecua.ac.in/wp-content/uploads/2024/06/Dr.Ravi-kumar-300x300.jpg",
  "mr-vinod-kumar": "https://kecua.ac.in/wp-content/uploads/2024/06/vinod-300x300.jpg",
  "ms-kavita-puri": "https://kecua.ac.in/wp-content/uploads/2024/06/kavita-puri-300x300.jpg",
  "mr-saumy-agarwal": "https://kecua.ac.in/wp-content/uploads/2024/06/saumy-300x300.png",
  "mr-manish-upreti": "https://kecua.ac.in/wp-content/uploads/2024/06/manish-300x300.png",
  "mr-rajesh-mehta": "https://kecua.ac.in/wp-content/uploads/2024/06/rajesh-mehta-300x300.png",
  "dr-birendra-singh-karki": "https://kecua.ac.in/wp-content/uploads/2024/06/birendra-300x300.png",
  "mr-himanshu-sah": "https://kecua.ac.in/wp-content/uploads/2025/12/himanshusah.jpeg",
  "mr-siddhartha-kumar": "https://kecua.ac.in/wp-content/uploads/2025/12/sidharthkumar.jpeg",
  "mr-kapil-mohan": "https://kecua.ac.in/wp-content/uploads/2025/12/kapilmohan.jpeg",
  "mr-pankaj-rawat": "https://kecua.ac.in/wp-content/uploads/2025/12/pankajrawat.jpeg",
  "dr-rakesh-kumar-singh": "https://kecua.ac.in/wp-content/uploads/2024/06/Dr-Rakesh-Kumar-Singh-300x300.jpg",
  "mr-lalit-garia": "https://kecua.ac.in/wp-content/uploads/2024/06/lalit-garia-300x300.png",
  "mrs-rachna-arya": "https://kecua.ac.in/wp-content/uploads/2024/06/rachna-arya-300x300.png",
  "mr-ravindra-pratap-singh": "https://kecua.ac.in/wp-content/uploads/2024/06/ravindra-300x300.png",
  "ms-parul-kansal": "https://kecua.ac.in/wp-content/uploads/2024/06/parul-kansal-300x300.png",
  "mrs-vijya-bhandari": "https://kecua.ac.in/wp-content/uploads/2024/06/vijya-bhandari-300x300.png",
  "mr-varun-kakar": "https://kecua.ac.in/wp-content/uploads/2024/06/varun-300x300.png",
  "mr-r-p-joshi": "https://kecua.ac.in/wp-content/uploads/2024/06/rp-joshi-300x300.png",
  "mr-jaspreet-singh": "https://kecua.ac.in/wp-content/uploads/2024/06/jaspreet-300x300.png",
  "mr-sanjay-singh": "https://kecua.ac.in/wp-content/uploads/2025/12/sanjayece.jpeg",
  "mrs-mamta-arya": "https://kecua.ac.in/wp-content/uploads/2024/06/mamta-arya-300x300.png",
  "mr-pramod-kumar-pandey": "https://kecua.ac.in/wp-content/uploads/2024/06/pramod-300x300.png",
  "kanchan-matiyali": "https://kecua.ac.in/wp-content/uploads/2024/06/kanchan-300x300.png",
  "mr-kamal-pandey": "https://kecua.ac.in/wp-content/uploads/2024/06/kamal-pandey-300x300.png",
  "mrs-renu-sinha": "https://kecua.ac.in/wp-content/uploads/2024/06/renu-sinha-300x300.png",
  "mr-neeraj-kumar": "https://kecua.ac.in/wp-content/uploads/2024/06/neeraj-kumar-300x300.png",
  "mr-mintoo-kumar-gautam": "https://kecua.ac.in/wp-content/uploads/2024/06/mintoo-300x300.png",
  "mr-ashish-kumar": "https://kecua.ac.in/wp-content/uploads/2025/12/ashishkumar.jpeg",
  "ms-priyanka-bora": "https://kecua.ac.in/wp-content/uploads/2025/12/priyankabora.jpeg",
  "mr-bhanu-pratap-singh-negi": "https://kecua.ac.in/wp-content/uploads/2025/12/bhanupratap.jpeg",
  "tabassum-faruki": "https://kecua.ac.in/wp-content/uploads/2025/12/tabassumfaruki.jpeg",
  "mr-amit-mohan": "https://kecua.ac.in/wp-content/uploads/2024/06/amit-mohan-300x300.png",
  "mr-pankaj-sanwal": "https://kecua.ac.in/wp-content/uploads/2024/06/pankaj-sanwal-300x300.png",
  "mr-mayank": "https://kecua.ac.in/wp-content/uploads/2024/06/mayank-300x300.png",
  "mrs-shakti-katiyar": "https://kecua.ac.in/wp-content/uploads/2024/06/shakti-300x300.png",
  "mrs-shweta-rawat": "https://kecua.ac.in/wp-content/uploads/2024/06/shweta-rawat-300x300.png",
  "dr-vandana-singh": "https://kecua.ac.in/wp-content/uploads/2024/06/vandana-300x300.png",
  "mr-anshuman-mishra": "https://kecua.ac.in/wp-content/uploads/2024/06/anshuman-300x300.png",
  "mr-vaibhav-rai": "https://kecua.ac.in/wp-content/uploads/2024/06/vaibhav-300x300.png",
  "dr-himanshu-tiwari": "https://kecua.ac.in/wp-content/uploads/2024/06/himanshu-tiwari-300x300.png",
  "mr-ravi-saini": "https://kecua.ac.in/wp-content/uploads/2024/06/ravi-saini-300x300.png",
  "ms-gulnaz-saifi": "https://kecua.ac.in/wp-content/uploads/2025/12/gulnazsaifi.jpeg",
  "dr-lata-bisht": "https://kecua.ac.in/wp-content/uploads/2024/06/lata-bisht-300x300.png",
  "dr-kuldeep-kholiya": "https://kecua.ac.in/wp-content/uploads/2024/06/kuldeep-kholiya-300x300.png",
  "dr-rajesh-kumar-pandey": "https://kecua.ac.in/wp-content/uploads/2024/06/rajesh-pandey-300x300.png",
  "dr-jyoti-pandey-tripathi": "https://kecua.ac.in/wp-content/uploads/2024/06/jyoti-tripathi-300x300.png",
  "dr-bhawana-sanwal": "https://kecua.ac.in/wp-content/uploads/2024/06/bhawana-sanwal-300x300.png",
  "dr-ruby-rani": "https://kecua.ac.in/wp-content/uploads/2024/06/ruby-rani-300x300.png",
  "ms-renu-bisht": "https://kecua.ac.in/wp-content/uploads/2024/06/renu-bisht-300x300.png",
  "neeraj-pant": "https://kecua.ac.in/wp-content/uploads/2024/06/neeraj-pant-300x300.png",
  "ms-neetu-rawat": "https://kecua.ac.in/wp-content/uploads/2024/06/neetu-rawat-300x300.png",
  "vivek-mainali": "https://kecua.ac.in/wp-content/uploads/2025/12/vivekmainali.jpeg",
  "dr-narendra-biswas": "https://kecua.ac.in/wp-content/uploads/2025/12/narendrabiswas.jpeg",
};

function getImageUrl(profileUrl: string, name: string): string {
  // Extract slug from profile URL
  const match = profileUrl.match(/\/member\/([^/]+)\/?$/);
  const slug = match?.[1] || '';
  
  if (facultyImages[slug]) {
    return facultyImages[slug];
  }
  
  // Fallback to ui-avatars
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

export default function FacultyClient() {
  const [activeDept, setActiveDept] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const totalCount = getTotalFacultyCount();

  const filteredDepartments = useMemo(() => {
    return departments
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
  }, [activeDept, searchTerm]);

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
              <span className={styles.heroStatNum}>{departments.length}</span>
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
        {departments.map(dept => (
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
                  <div
                    className={styles.card}
                    style={{ all: 'unset' }}
                  >
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                      background: departmentColors[dept.shortName] || '#7B61FF',
                      borderRadius: '16px 16px 0 0', opacity: 0.6
                    }} />
                  </div>
                  <div className={styles.avatarWrap}>
                    <img
                      src={getImageUrl(member.profileUrl, member.name)}
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
