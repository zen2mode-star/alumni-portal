import Link from 'next/link';
import { logout } from '@/actions/auth';
import styles from './page.module.css';

export default function PendingPage() {
  return (
    <div className={styles.container}>
      <div className={`${styles.bubble} animate-pop`}>
        <div className={styles.icon}>⏳</div>
        <h1>Account Pending Approval</h1>
        <p>
          Thank you for joining <strong>KecAlumini.in</strong>! 
          To ensure the integrity of our network, a site administrator must verify your account.
        </p>
        <p className={styles.hint}>
          You will receive access once the verification process is complete.
        </p>
        <div className={styles.actions}>
          <form action={logout}>
            <button type="submit" className={styles.signOutBtn}>Log Out</button>
          </form>
          <Link href="/" className={styles.homeBtn}>Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
