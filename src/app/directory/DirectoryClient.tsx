"use client";
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AlumniCard from '@/components/AlumniCard';
import { Search, Filter, Users, GraduationCap } from 'lucide-react';
import styles from './page.module.css';

interface DirectoryClientProps {
  initialData: any[];
  title?: string;
  subtitle?: string;
  iconType?: 'alumni' | 'student';
}

export default function DirectoryClient({ 
  initialData, 
  title = "Verified Alumni Network", 
  subtitle = "Official roster of all approved graduates",
  iconType = 'alumni'
}: DirectoryClientProps) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  useEffect(() => {
    const company = searchParams.get('company');
    if (company) {
      setSearchTerm(company);
    }
  }, [searchParams]);

  const IconHeader = iconType === 'student' ? GraduationCap : Users;

  const branches = Array.from(new Set(initialData.map(a => a.department).filter(Boolean))).sort();

  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBranch = selectedBranch ? item.department === selectedBranch : true;
      return matchesSearch && matchesBranch;
    });
  }, [initialData, searchTerm, selectedBranch]);

  return (
    <div className={styles.standardGrid}>
      {/* Sidebar: Filters & Stats */}
      <aside className={styles.sidebar}>
        <div className={styles.filterCard}>
          <h3><Filter size={18} /> Discovery Filters</h3>
          <div className={styles.filterGroup}>
            <label>Academic Branch</label>
            <select 
              className={styles.select}
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">All Branches</option>
              {branches.map(br => (
                <option key={br} value={br}>{br}</option>
              ))}
            </select>
          </div>
          <div className={styles.statsMini}>
             <IconHeader size={16} />
             <span>{filteredData.length} Verified Records</span>
          </div>
        </div>

        <div className={styles.adCard}>
            <p>Connecting the BTKIT legacy generations through a unified digital directory.</p>
        </div>
      </aside>

      {/* Main Content: Search & Results */}
      <main className={styles.mainContent}>
        <header className={styles.searchHeader}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Search by Name, Organization, or Skills..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>

        <section className={styles.networkGrid}>
          {filteredData.map(item => (
            <AlumniCard key={item.id} alumni={item} />
          ))}
          {filteredData.length === 0 && (
            <div className={styles.emptyState}>
              <IconHeader size={48} className={styles.emptyIcon} />
              <p>No verified campus records matching your query were found.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
