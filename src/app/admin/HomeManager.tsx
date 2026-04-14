'use client';
import { useState } from 'react';
import { addBanner, deleteBanner, addHomeCompany, deleteHomeCompany } from '@/actions/home';
import styles from './HomeManager.module.css';

interface HomeManagerProps {
  initialBanners: any[];
  initialCompanies: any[];
}

export default function HomeManager({ initialBanners, initialCompanies }: HomeManagerProps) {
  const [banners, setBanners] = useState(initialBanners);
  const [companies, setCompanies] = useState(initialCompanies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddBanner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const res = await addBanner(formData);
    if (res.error) {
      setError(res.error);
    } else {
      // Optimistic update or just wait for revalidation?
      // Since it's admin, we can just refresh or update state.
      window.location.reload(); 
    }
    setLoading(false);
  }

  async function handleDeleteBanner(id: string) {
    if (!confirm('Delete this banner?')) return;
    setLoading(true);
    const res = await deleteBanner(id);
    if (res.error) setError(res.error);
    else window.location.reload();
    setLoading(false);
  }

  async function handleAddCompany(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const res = await addHomeCompany(formData);
    if (res.error) {
      setError(res.error);
    } else {
      window.location.reload();
    }
    setLoading(false);
  }

  async function handleDeleteCompany(id: string) {
    if (!confirm('Delete this company?')) return;
    setLoading(true);
    const res = await deleteHomeCompany(id);
    if (res.error) setError(res.error);
    else window.location.reload();
    setLoading(false);
  }

  return (
    <div className={styles.managerGrid}>
      <section className={styles.section}>
        <h3>Manage Home Banners</h3>
        <form onSubmit={handleAddBanner} className={styles.form}>
          <input name="imageUrl" placeholder="Banner Image URL" required />
          <input name="title" placeholder="Banner Title (Optional)" />
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Adding...' : 'Add Banner'}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.list}>
          {banners.map(b => (
            <div key={b.id} className={styles.item}>
              <img src={b.imageUrl} className={styles.preview} alt={b.title || 'Banner'} />
              <span className={styles.itemTitle}>{b.title || 'Untitled'}</span>
              <button onClick={() => handleDeleteBanner(b.id)} className={styles.deleteBtn}>×</button>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3>Alumni Companies</h3>
        <form onSubmit={handleAddCompany} className={styles.form}>
          <input name="name" placeholder="Company Name" required />
          <input name="logoUrl" placeholder="Logo URL (Optional)" />
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Adding...' : 'Add Company'}
          </button>
        </form>
        <div className={styles.list}>
          {companies.map(c => (
            <div key={c.id} className={styles.item}>
               <div className={styles.companyInfo}>
                 {c.logoUrl && <img src={c.logoUrl} className={styles.miniLogo} alt={c.name} />}
                 <span>{c.name}</span>
               </div>
               <button onClick={() => handleDeleteCompany(c.id)} className={styles.deleteBtn}>×</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
