'use client';
import { useState } from 'react';
import { uploadLegacyPhoto } from '@/actions/legacy';
import { Camera, X, Upload, CheckCircle } from 'lucide-react';
import styles from './MemoryUpload.module.css';

export default function MemoryUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const res = await uploadLegacyPhoto(formData);
    
    setLoading(false);
    if (res.error) setError(res.error);
    else {
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 3000);
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={styles.triggerBtn}>
        <Camera size={18} /> Share a Campus Memory
      </button>

      {isOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}><X size={24} /></button>
            
            {success ? (
              <div className={styles.successState}>
                <CheckCircle size={48} color="#22c55e" />
                <h3>Memory Shared!</h3>
                <p>Your photo has been sent to the KEC Admin for approval. It will appear on the Legacy Wall shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Contribute to Legacy</h2>
                <p>Upload a photo from your time at BTKIT (KEC) Dwarahat to share with the network.</p>
                
                <div className={styles.inputGroup}>
                  <label>Select Batch Year</label>
                  <input type="number" name="year" placeholder="e.g. 2012" required min="1992" max="2024" />
                </div>

                <div className={styles.inputGroup}>
                  <label>Campus Photo</label>
                  <input type="file" name="photo" accept="image/*" required className={styles.fileInput} />
                </div>

                <div className={styles.inputGroup}>
                  <label>Short Caption (Optional)</label>
                  <textarea name="caption" placeholder="Describe this memory..." maxLength={200} />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button type="submit" disabled={loading} className={styles.submitBtn}>
                  {loading ? 'Uploading...' : 'Submit to Legacy Wall'}
                  {!loading && <Upload size={18} />}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
