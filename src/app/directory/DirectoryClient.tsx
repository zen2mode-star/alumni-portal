"use client";
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AlumniCard from '@/components/AlumniCard';
import { Search, Filter, Users, GraduationCap } from 'lucide-react';
import { normalizeBranch } from '@/lib/normalize';
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
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    const company = searchParams.get('company');
    if (company) {
      setSearchTerm(company);
    }
    const role = searchParams.get('role');
    if (role && ['ALUMNI', 'STAFF', 'STUDENT', 'CAMPUS'].includes(role.toUpperCase())) {
      setRoleFilter(role.toUpperCase());
    }
  }, [searchParams]);

  const IconHeader = iconType === 'student' ? GraduationCap : Users;

  const dynamicOptions = useMemo(() => {
    if (roleFilter === 'STUDENT') {
      const vals = Array.from(new Set(initialData.filter(i => i.role === 'STUDENT').map(a => normalizeBranch(a.department)).filter(Boolean))).sort();
      return { label: 'Academic Branch', values: vals };
    }
    if (roleFilter === 'ALUMNI') {
      const vals = Array.from(new Set(initialData.filter(i => i.role === 'ALUMNI').map(a => a.company).filter(Boolean))).sort();
      return { label: 'Member Company', values: vals };
    }
    if (roleFilter === 'STAFF' || roleFilter === 'LEADERSHIP' || roleFilter === 'CAMPUS') {
      const staffVals = initialData.filter(i => i.role === 'STAFF').map(a => normalizeBranch(a.department)).filter(Boolean);
      const studentVals = initialData.filter(i => i.role === 'STUDENT').map(a => normalizeBranch(a.department)).filter(Boolean);
      const vals = Array.from(new Set([...staffVals, ...studentVals])).sort();
      return { label: roleFilter === 'CAMPUS' ? 'Campus Area' : 'Staff Department', values: vals };
    }
    const universal = Array.from(new Set(initialData.map(a => normalizeBranch(a.department)).filter(Boolean))).sort();
    return { label: 'Universal Branch', values: universal };
  }, [initialData, roleFilter]);

  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (item.jobTitle && item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesDynamic = true;
      if (selectedBranch) {
        if (roleFilter === 'ALUMNI') matchesDynamic = item.company === selectedBranch;
        else matchesDynamic = normalizeBranch(item.department) === selectedBranch;
      }
      
      let matchesRole = false;
      if (roleFilter === 'ALL') matchesRole = true;
      else if (roleFilter === 'CAMPUS') {
        matchesRole = item.role === 'STAFF' || item.role === 'STUDENT';
      } else if (roleFilter === 'LEADERSHIP') {
        matchesRole = !!item.designation && (item.designation.includes('Director') || item.designation.includes('Principal') || item.designation.includes('Head'));
      } else {
        matchesRole = item.role === roleFilter;
      }
      
      return matchesSearch && matchesDynamic && matchesRole;
    });
  }, [initialData, searchTerm, selectedBranch, roleFilter]);

  return (
    <div className={styles.standardGrid}>
      {/* Sidebar: Filters & Stats */}
      <aside className={styles.sidebar}>
        <div className={styles.filterCard}>
          <h3><Filter size={18} /> KecNetwork.in Filters</h3>
          <div className={styles.filterGroup}>
            <label>Community Segment</label>
            <div className={styles.roleFilters}>
              {['ALL', 'ALUMNI', 'CAMPUS', 'STAFF', 'STUDENT', 'LEADERSHIP'].map(role => (
                <button 
                  key={role}
                  className={`${styles.roleTab} ${roleFilter === role ? styles.roleTabActive : ''}`}
                  onClick={() => { setRoleFilter(role); setSelectedBranch(''); }}
                >
                  {role === 'ALL' ? 'Total' : 
                   role === 'LEADERSHIP' ? 'Leadership' :
                   role === 'CAMPUS' ? 'Campus Core' :
                   role === 'STAFF' ? 'Staff' : 
                   role === 'STUDENT' ? 'Talent' : 
                   role.charAt(0) + role.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>{dynamicOptions.label}</label>
            <select 
              className={styles.select}
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">{`All ${dynamicOptions.label}s`}</option>
              {dynamicOptions.values.map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div className={styles.statsMini}>
             <IconHeader size={16} />
             <span>{filteredData.length} Live Sync Records</span>
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
