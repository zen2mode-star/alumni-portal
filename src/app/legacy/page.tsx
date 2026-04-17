import { PrismaClient } from '@prisma/client';
import { History, Award, Users, Search } from 'lucide-react';
import styles from './page.module.css';
import AlumniCard from '@/components/AlumniCard';
import MemoryUpload from '@/components/MemoryUpload';
import LegacyMagazine from '@/components/LegacyMagazine';
import { getLegacyPhotos } from '@/actions/legacy';

const prisma = new PrismaClient();

export default async function LegacyWall({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const resolvedParams = await searchParams;
  const selectedYear = resolvedParams.year ? parseInt(resolvedParams.year) : null;

  const years = Array.from({ length: 2024 - 1992 + 1 }, (_, i) => ({ gradYear: 2024 - i }));

  const [alumni, photos] = await Promise.all([
    prisma.user.findMany({
      where: { 
        role: 'ALUMNI', 
        status: 'APPROVED',
        ...(selectedYear ? { gradYear: selectedYear } : {})
      },
      orderBy: [{ gradYear: 'desc' }, { name: 'asc' }],
    }),
    getLegacyPhotos(selectedYear || undefined)
  ]);

  const formattedAlumni = alumni.map(a => ({
    ...a,
    department: a.branch || 'KEC Heritage',
    role: a.jobRole || 'Professional',
    company: a.company || 'KEC Network',
    isStudent: false
  }));

  return (
    <div className="kec-container">
      <header className={styles.legacyHeader}>
        <div className={styles.titleInfo}>
          <div className={styles.heritageIcon}>🏛️</div>
          <h1>Interactive Legacy Wall</h1>
          <p>Exploring the historic batches of BTKIT Dwarahat since 1991</p>
        </div>
        <div className={styles.stats}>
          <MemoryUpload />
          <div className={styles.statBox}>
            <Users size={20} />
            <span>{alumni.length} Total Alumni</span>
          </div>
        </div>
      </header>
      
      {photos.length > 0 && (
        <section className={styles.magazineSection}>
          <div className={styles.sectionTitle}>
             <Award size={24} color="var(--primary-color)" />
             <h2>Institutional Journal: Class of {selectedYear || 'All Batches'}</h2>
          </div>
          <LegacyMagazine photos={photos} />
        </section>
      )}

      <div className={styles.legacyGrid}>
        {/* Left: Timeline Navigation */}
        <aside className={styles.timelineSidebar}>
          <h3><History size={18} /> Batch Timeline</h3>
          <div className={styles.yearList}>
            {years.map(y => (
              <a 
                key={y.gradYear} 
                href={`/legacy?year=${y.gradYear}`}
                className={`${styles.yearLink} ${selectedYear === y.gradYear ? styles.activeYear : ''}`}
              >
                Class of {y.gradYear}
              </a>
            ))}
            {years.length === 0 && <p className={styles.empty}>No batches recorded yet.</p>}
          </div>
        </aside>

        {/* Right: Alumni Display */}
        <main className={styles.alumniView}>

          <div className={styles.networkGrid}>
            {formattedAlumni.map(person => (
              <AlumniCard key={person.id} alumni={person} />
            ))}
            {formattedAlumni.length === 0 && (
              <div className={styles.emptyState}>
                <Award size={48} />
                <p>No verified alumni journeys recorded for this batch yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
