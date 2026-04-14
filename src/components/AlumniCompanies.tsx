'use client';
import styles from './AlumniCompanies.module.css';

interface Company {
  id: string;
  name: string;
  logoUrl?: string | null;
}

interface Props {
  companies: Company[];
}

export default function AlumniCompanies({ companies }: Props) {
  if (companies.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Our Alumni Work At</h3>
      <div className={styles.logoRow}>
        <div className={styles.scrollTrack}>
          {/* Double the list for infinite scroll effect */}
          {[...companies, ...companies].map((company, index) => (
            <div key={`${company.id}-${index}`} className={styles.companyBadge}>
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className={styles.logo} />
              ) : (
                <span className={styles.companyName}>{company.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
