'use client';
import { useState } from 'react';
import { addBanner, deleteBanner, addHomeCompany, deleteHomeCompany, updateSiteAsset } from '@/actions/home';
import styles from './HomeManager.module.css';

interface HomeManagerProps {
  initialBanners: any[];
  initialCompanies: any[];
  profileCompanies: string[];
}

export default function HomeManager({ initialBanners, initialCompanies, profileCompanies }: HomeManagerProps) {
  const [activeTab, setActiveTab] = useState<'banners' | 'companies' | 'assets'>('banners');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [companyName, setCompanyName] = useState('');

  async function handleAddBanner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await addBanner(formData);
      if (res.error) setStatus({ type: 'error', message: res.error });
      else {
        setStatus({ type: 'success', message: 'Banner added successfully!' });
        e.currentTarget.reset();
        window.location.reload();
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'A network error occurred.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCompany(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await addHomeCompany(formData);
      if (res.error) setStatus({ type: 'error', message: res.error });
      else {
        setStatus({ type: 'success', message: 'Company logo updated/added!' });
        setCompanyName('');
        e.currentTarget.reset();
        window.location.reload();
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'A network error occurred.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateAsset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const key = formData.get('key') as string;
    
    // Find friendly label
    const labels: Record<string, string> = {
      'CAMPUS_LOGO': 'Main KEC Logo',
      'SIDEBAR_CAMPUS_IMAGE': 'Sidebar About Image',
      'DEFAULT_COVER': 'Default Profile Cover'
    };
    const friendlyName = labels[key] || key;

    const res = await updateSiteAsset(formData);
    if (res.error) setStatus({ type: 'error', message: res.error });
    else {
      setStatus({ type: 'success', message: `Successfully updated "${friendlyName}"!` });
      e.currentTarget.reset();
      // Optional: don't reload immediately to let user see the message
      setTimeout(() => window.location.reload(), 1500);
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
          <div className={styles.infoBox}>
            <strong>📸 Sidebar Gallery Slideshow</strong>
            <p>These images appear as an auto-rotating slideshow in the <strong>right sidebar</strong> of the Home page. You can upload up to <strong>10 images</strong>. Currently: <strong>{initialBanners.length} / 10</strong> slides.</p>
          </div>
          <h3>Add Gallery Slide</h3>
          {initialBanners.length >= 10 ? (
            <div className={styles.infoBox} style={{ borderColor: '#ef4444' }}>
              <strong style={{ color: '#ef4444' }}>Maximum Reached</strong>
              <p>You have reached the 10-slide limit. Delete an existing slide to add a new one.</p>
            </div>
          ) : (
            <form onSubmit={handleAddBanner} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Select Image</label>
                <input type="file" name="bannerImage" accept="image/*" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Caption (Optional)</label>
                <input type="text" name="title" placeholder="e.g. Annual Day 2025" />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Uploading...' : 'Add Slide'}
              </button>
            </form>
          )}
          <div className={styles.list}>
            {initialBanners.map((b, i) => (
              <div key={b.id} className={styles.item}>
                <img src={b.imageUrl} className={styles.preview} alt="" />
                <span>#{i + 1} — {b.title || 'Untitled'}</span>
                <button onClick={async () => {
                   if(confirm('Remove this slide?')) {
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
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="e.g. Google" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            
            {profileCompanies.length > 0 && (
              <div className={styles.pickerSection}>
                <label className={styles.pickerLabel}>Found in Alumni Profiles (Quick Add):</label>
                <div className={styles.pickerTags}>
                  {profileCompanies.map(name => (
                    <button 
                      key={name} 
                      type="button" 
                      className={styles.pickerTag}
                      onClick={() => setCompanyName(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => {
                      setCompanyName(c.name);
                      document.querySelector('input[name="name"]')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={styles.editBtn}
                    title="Edit/Update logo"
                  >
                    ✎
                  </button>
                  <button onClick={async () => {
                     if(confirm('Remove?')) {
                       setLoading(true);
                       await deleteHomeCompany(c.id);
                       window.location.reload();
                     }
                  }} className={styles.deleteBtn}>×</button>
                </div>
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
