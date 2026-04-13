"use client";
import { useState, useMemo } from 'react';
import AlumniCard from '@/components/AlumniCard';
import styles from './page.module.css';

interface AlumniProps {
  initialData: any[];
}

export default function DirectoryClient({ initialData }: AlumniProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  const industries = Array.from(new Set(initialData.map(a => a.department).filter(Boolean)));

  const filteredAlumni = useMemo(() => {
    return initialData.filter((alumni) => {
      const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            alumni.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            alumni.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = selectedIndustry ? alumni.department === selectedIndustry : true;
      return matchesSearch && matchesIndustry;
    });
  }, [initialData, searchTerm, selectedIndustry]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleBox}>
          <h1>Alumni Directory</h1>
          <p>{filteredAlumni.length} members found in the network</p>
        </div>
        
        <div className={styles.searchBar}>
          <input 
            type="text" 
            className={styles.input} 
            placeholder="🔍 Search members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className={styles.select}
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="">All Departments</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </header>

      <main className={styles.grid}>
        {filteredAlumni.map(alumni => (
          <AlumniCard key={alumni.id} alumni={alumni} />
        ))}
        {filteredAlumni.length === 0 && (
          <div className={styles.emptyState}>
            <p>No members found matching your search. Try broadening your criteria!</p>
          </div>
        )}
      </main>
    </div>
  );
}
