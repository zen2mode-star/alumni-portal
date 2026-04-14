'use client';
import { useState } from 'react';
import { addBanner, deleteBanner, addHomeCompany, deleteHomeCompany, updateSiteAsset } from '@/actions/home';
import styles from './HomeManager.module.css';

interface HomeManagerProps {
  initialBanners: any[];
  initialCompanies: any[];
}

export default function HomeManager({ initialBanners, initialCompanies }: HomeManagerProps) {
  const [activeTab, setActiveTab] = useState<'banners' | 'companies' | 'assets'>('banners');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  async function handleAddBanner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const res = await addBanner(formData);
    if (res.error) setStatus({ type: 'error', message: res.error });
    else {
      setStatus({ type: 'success', message: 'Banner added successfully!' });
      e.currentTarget.reset();
      window.location.reload();
    }
    setLoading(false);
  }

  async function handleAddCompany(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const res = await addHomeCompany(formData);
    if (res.error) setStatus({ type: 'error', message: res.error });
    else {
      setStatus({ type: 'success', message: 'Company logo added!' });
      e.currentTarget.reset();
      window.location.reload();
    }
    setLoading(false);
  }

  async function handleUpdateAsset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateSiteAsset(formData);
    if (res.error) setStatus({ type: 'error', message: res.error });
    else {
      setStatus({ type: 'success', message: res.message || 'Asset updated!' });
      e.currentTarget.reset();
      window.location.reload();
    }
    setLoading(false);
  }

  return (
    <div className={styles.managerWrapper}>
      <div className={styles.tabs}>
        <button className={activeTab === 'banners' ? styles.active : ''} onClick={() => setActiveTab('banners')}>Carousel Banners</button>
        <button className={activeTab === 'companies' ? styles.active : ''} onClick={() => setActiveTab('companies')}>Alumni Companies</button>
        <button className={activeTab === 'assets' ? styles.active : ''} onClick={() => setActiveTab('assets')}>Global Assets (Sides)</button>
      </div>

      {status && (
        <div className={`${styles.status} ${status.type === 'success' ? styles.success : styles.error}`}>
          {status.message}
        </div>
      )}

      {activeTab === 'banners' && (
        <section className={styles.section}>
          <h3>Add Carousel Slide</h3>
          <form onSubmit={handleAddBanner} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Select Banner Image</label>
              <input type="file" name="bannerImage" accept="image/*" required />
            </div>
            <div className={styles.inputGroup}>
              <label>Headline (Optional)</label>
              <input type="text" name="title" placeholder="e.g. Welcome to KEC" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Uploading...' : 'Add Slide'}
            </button>
          </form>
          <div className={styles.list}>
            {initialBanners.map(b => (
              <div key={b.id} className={styles.item}>
                <img src={b.imageUrl} className={styles.preview} alt="" />
                <span>{b.title || 'Untitled'}</span>
                <button onClick={async () => {
                   if(confirm('Remove?')) {
                     setLoading(true);
                     await deleteBanner(b.id);
                     window.location.reload();
                   }
                }} className={styles.deleteBtn}>×</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'companies' && (
        <section className={styles.section}>
          <h3>Add Alumni Company</h3>
          <form onSubmit={handleAddCompany} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Select Logo Image</label>
              <input type="file" name="logoImage" accept="image/*" />
            </div>
            <div className={styles.inputGroup}>
              <label>Company Name</label>
              <input type="text" name="name" required placeholder="e.g. Google" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Uploading...' : 'Add Company'}
            </button>
          </form>
          <div className={styles.list}>
            {initialCompanies.map(c => (
              <div key={c.id} className={styles.item}>
                <div className={styles.companyInfo}>
                  {c.logoUrl && <img src={c.logoUrl} className={styles.miniLogo} alt="" />}
                  <span>{c.name}</span>
                </div>
                <button onClick={async () => {
                   if(confirm('Remove?')) {
                     setLoading(true);
                     await deleteHomeCompany(c.id);
                     window.location.reload();
                   }
                }} className={styles.deleteBtn}>×</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'assets' && (
        <section className={styles.section}>
          <h3>Update Global Site Assets</h3>
          <p className={styles.hint}>Upload images to replace specific site-wide elements.</p>
          
          <div className={styles.assetGrid}>
            {[
              { key: 'CAMPUS_LOGO', label: 'Main KEC Logo' },
              { key: 'SIDEBAR_CAMPUS_IMAGE', label: 'Sidebar About Image' },
              { key: 'DEFAULT_COVER', label: 'Default Profile Cover' },
            ].map(asset => (
              <form key={asset.key} onSubmit={handleUpdateAsset} className={styles.assetForm}>
                <input type="hidden" name="key" value={asset.key} />
                <label className={styles.assetLabel}>{asset.label}</label>
                <div className={styles.assetActions}>
                   <input type="file" name="assetImage" accept="image/*" required />
                   <button type="submit" disabled={loading} className="btn btn-glass">Update</button>
                </div>
              </form>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
