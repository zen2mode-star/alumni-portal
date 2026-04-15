'use client';
import { useState } from 'react';
import { updateProfile } from '@/actions/profile';
import { changePassword, logout } from '@/actions/auth';
import Link from 'next/link';
import LittleTiger from '@/components/LittleTiger';
import DigitalID from '@/components/DigitalID';
import styles from './page.module.css';

interface DashboardProps {
  user: any;
  pendingMessages: number;
}

export default function DashboardClient({ user, pendingMessages }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'core' | 'roots' | 'presence'>('core');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user.imageUrl || '');

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoading(false);
    if (res?.error) setStatus({ type: 'error', message: res.error });
    else if (res?.success) setStatus({ type: 'success', message: res.message });
  }

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await changePassword(formData);
    setLoading(false);
    if (res?.error) setStatus({ type: 'error', message: res.error });
    else if (res?.success) {
      setStatus({ type: 'success', message: res.message });
      form.reset();
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  return (
    <div className={styles.premiumContainer}>
      {loading && (
        <div className={styles.executiveLoader}>
          <LittleTiger loading={true} size={150} />
          <p className={styles.loaderText}>Synchronizing Profile Data...</p>
        </div>
      )}

      <header className={styles.identityHeader}>
        <div className={styles.auraBg}></div>
        <img
          src={photoPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0A1128&color=fff`}
          alt={user.name}
          className={styles.avatar}
        />
        <div className={styles.identityInfo}>
          <h1>{user.name} <span className={styles.roleTag}>{user.role}</span></h1>
          <p className={styles.currentPosition}>
            {user.jobRole || 'Campus Fellow'} {user.company ? `@ ${user.company}` : ''}
            {user.location ? ` | ${user.location}` : ''}
          </p>
        </div>
      </header>

      {status && (
        <div className={`${styles.announcement} ${status.type === 'success' ? styles.success : styles.error}`}>
          {status.message}
        </div>
      )}

      <div className={styles.dashboardGrid}>
        <section className={styles.glassCard}>
          <div className={styles.tabHeader}>
            <button onClick={() => setActiveTab('core')} className={activeTab === 'core' ? styles.activeTab : ''}>Core Identity</button>
            <button onClick={() => setActiveTab('roots')} className={activeTab === 'roots' ? styles.activeTab : ''}>Campus Roots</button>
            <button onClick={() => setActiveTab('presence')} className={activeTab === 'presence' ? styles.activeTab : ''}>Digital Presence</button>
          </div>

          <form onSubmit={handleProfileUpdate} className={styles.modernForm}>
            {activeTab === 'core' && (
              <div className="animate-pop">
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Public Name</label>
                    <input type="text" name="name" defaultValue={user.name} disabled />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Current Location</label>
                    <input type="text" name="location" defaultValue={user.location || ''} placeholder="e.g. Noida, India" />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Contact Phone</label>
                    <input type="tel" name="phone" defaultValue={user.phone || ''} placeholder="+91 ..." />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Personal Website</label>
                    <input type="url" name="website" defaultValue={user.website || ''} placeholder="https://..." />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Identity Image</label>
                  <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} />
                  <input type="hidden" name="existingImageUrl" value={user.imageUrl || ''} />
                </div>
                <div className={styles.inputGroup}>
                   <label>Identity Narrative</label>
                   <textarea name="bio" defaultValue={user.bio || ''} placeholder="Condense your institutional journey..." />
                </div>
              </div>
            )}

            {activeTab === 'roots' && (
              <div className="animate-pop">
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Branch / Department</label>
                    <input type="text" name="branch" defaultValue={user.branch || ''} placeholder="e.g. Computer Science" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Roll Number</label>
                    <input type="text" name="rollNumber" defaultValue={user.rollNumber || ''} placeholder="KEC-..." />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Hostel Name</label>
                    <input type="text" name="hostel" defaultValue={user.hostel || ''} placeholder="e.g. Aravali" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Graduation Year</label>
                    <input type="number" name="gradYear" defaultValue={user.gradYear || 2024} />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label>Higher Studies (Optional)</label>
                  <input type="text" name="higherStudies" defaultValue={user.higherStudies || ''} placeholder="e.g. M.Tech at IIT Kanpur" />
                </div>
              </div>
            )}

            {activeTab === 'presence' && (
              <div className="animate-pop">
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Current Company</label>
                    <input type="text" name="company" defaultValue={user.company || ''} placeholder="Current Employer" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Designation</label>
                    <input type="text" name="jobRole" defaultValue={user.jobRole || ''} placeholder="e.g. Software Architect" />
                  </div>
                </div>
                <div className={styles.formRow}>
                   <div className={styles.inputGroup}>
                     <label>LinkedIn URL</label>
                     <input type="url" name="linkedinUrl" defaultValue={user.linkedinUrl || ''} />
                   </div>
                   <div className={styles.inputGroup}>
                     <label>GitHub Profile</label>
                     <input type="url" name="githubUrl" defaultValue={user.githubUrl || ''} />
                   </div>
                </div>
                <div className={styles.formRow}>
                   <div className={styles.inputGroup}>
                     <label>Twitter / X Profile</label>
                     <input type="url" name="twitterUrl" defaultValue={user.twitterUrl || ''} />
                   </div>
                   <div className={styles.inputGroup}>
                     <label>Instagram Handle</label>
                     <input type="text" name="instagramUrl" defaultValue={user.instagramUrl || ''} />
                   </div>
                </div>
                <div className={styles.inputGroup}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', background: 'rgba(123, 97, 255, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(123, 97, 255, 0.2)' }}>
                    <input type="checkbox" name="canMentor" defaultChecked={user.canMentor} style={{ width: '18px', height: '18px' }} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: '#fff' }}>Open to 15-Min Mentorship</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Allow students to request quick career guidance chats.</span>
                    </div>
                  </label>
                </div>
                <div className={styles.inputGroup}>
                  <label>Accolades & Achievements</label>
                  <textarea name="achievements" defaultValue={user.achievements || ''} placeholder="List honors, awards, and milestones..." />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>Update Profile</button>
          </form>
        </section>

        <aside className={styles.controlPanel}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Institutional Dossier</h3>
            <DigitalID user={user} />
          </div>

          <div className={styles.glassCard}>
            <h3>Account Security</h3>
            <form onSubmit={handlePasswordChange} className={styles.modernForm}>
              <div className={styles.inputGroup}>
                <input type="password" name="prevPassword" required placeholder="Current Key" />
              </div>
              <div className={styles.inputGroup}>
                <input type="password" name="newPassword" required placeholder="New Secure Key" />
              </div>
              <button type="submit" className="btn btn-glass" style={{width:'100%'}}>Update Credentials</button>
            </form>
          </div>
          <div className={styles.actionGrid}>
             <Link href="/messages" className={styles.actionTile}>
               <span className={styles.tileIcon}>✉️</span>
               <span className={styles.tileText}>Direct Messages</span>
               {pendingMessages > 0 && <span className={styles.tileBadge}>{pendingMessages}</span>}
             </Link>
             <form action={logout}>
               <button type="submit" className={styles.logoutTile}>
                 <span className={styles.tileIcon}>⏻</span>
                 <span className={styles.tileText}>Log Out</span>
               </button>
             </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
