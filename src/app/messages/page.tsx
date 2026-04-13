import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ChatUI from './ChatUI';
import styles from './page.module.css';

const prisma = new PrismaClient();

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ to?: string }> }) {
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const resolvedParams = await searchParams;
  const activeUserId = resolvedParams.to;

  const users = await prisma.user.findMany({
    where: { status: 'APPROVED' },
    select: { id: true, name: true, imageUrl: true }
  });

  const currentUser = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  let conversation: any[] = [];
  if (activeUserId) {
    conversation = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.userId, receiverId: activeUserId },
          { senderId: activeUserId, receiverId: session.userId },
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Messages</h1>
      <div className={styles.chatContainer}>
        <div className={styles.sidebar}>
          <h3>Contacts</h3>
          <div className={styles.contactList}>
            {users.filter(u => u.id !== session.userId).map(u => (
              <a key={u.id} href={`/messages?to=${u.id}`} className={styles.contactCard} style={{ background: activeUserId === u.id ? 'var(--card-border)' : '' }}>
                <img src={u.imageUrl || ''} alt={u.name} className={styles.avatar} />
                <span>{u.name}</span>
              </a>
            ))}
          </div>
        </div>
        <div className={styles.chatArea}>
          {activeUserId ? (
            <ChatUI receiverId={activeUserId} initialMessages={conversation} currentUserId={session.userId} />
          ) : (
            <div className={styles.emptyState}>Select a contact to start messaging.</div>
          )}
        </div>
      </div>
    </div>
  );
}
