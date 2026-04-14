import { createJob } from '@/actions/jobs';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import styles from '../../login/page.module.css'; // Re-use login form styles

export default async function NewJobPage() {
  const session = await verifySession();
  if (!session || session.role === 'STUDENT') {
    redirect('/jobs');
  }

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{maxWidth: '600px'}}>
        <h2>Post an Opportunity</h2>
        <p>Hire from the BTKIT Alumni Network.</p>
        
        <form action={async (formData) => {
          'use server';
          await createJob(formData);
        }} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Job Title</label>
            <input type="text" name="title" required placeholder="e.g. Software Engineer" />
          </div>
          
          <div className={styles.formGroup}>
            <label>Company</label>
            <input type="text" name="company" required placeholder="e.g. Microsoft" />
          </div>
          
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea name="description" required placeholder="Describe the role..." className={styles.select} style={{minHeight: '120px', resize: 'vertical'}}></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>External Application Link (Optional)</label>
            <input type="url" name="link" placeholder="https://careers.company.com/..." />
          </div>
          
          <button type="submit" className={styles.submitBtn}>Post Job</button>
        </form>
      </div>
    </div>
  );
}
