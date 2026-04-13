export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import styles from '../jobs/page.module.css'; // Re-use jobs CSS

const prisma = new PrismaClient();

export default async function EventsPage() {
  const session = await verifySession();
  const events = await prisma.event.findMany({
    include: { author: true },
    orderBy: { date: 'asc' }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Upcoming Events</h1>
        {session && session.role === 'ADMIN' && <button className={styles.primaryButton}>Post Event</button>}
      </div>
      <div className={styles.grid}>
        {events.length === 0 ? (
          <div className={styles.emptyState}>No upcoming events.</div>
        ) : (
          events.map(event => (
            <div key={event.id} className={styles.jobCard}>
              <h2>{event.title}</h2>
              <p className={styles.company}>{new Date(event.date).toLocaleDateString()}</p>
              <p className={styles.desc}>{event.description}</p>
              <div className={styles.footer}>
                <span>Posted by {event.author.name}</span>
                <button className={styles.applyBtn}>RSVP</button>
              </div>
            </div>
          ))
        )}
        
        {/* Placeholder Demo Event */}
        {events.length === 0 && (
           <div className={styles.jobCard}>
             <h2>Annual BTKIT Alumni Meet 2026</h2>
             <p className={styles.company}>{new Date().toLocaleDateString()}</p>
             <p className={styles.desc}>Join us for the largest gathering of BTKIT alumni this decade. Featuring keynote speeches, networking sessions, and a gala dinner.</p>
             <div className={styles.footer}>
               <span>Posted by BTKIT Admin</span>
               <button className={styles.applyBtn}>RSVP Now</button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
