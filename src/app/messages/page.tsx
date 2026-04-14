export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ChatUI from './ChatUI';
import MessageSidebar from './MessageSidebar';
import { decryptMessage } from '@/lib/encryption';

const prisma = new PrismaClient();

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ to?: string }> }) {
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const resolvedParams = await searchParams;
  const activeUserId = resolvedParams.to;

  // Fetch all approved users except self
  const allUsers = await prisma.user.findMany({
    where: { status: 'APPROVED', NOT: { id: session.userId } },
    select: { id: true, name: true, imageUrl: true, role: true }
  });

  // Fetch all messages involving this user
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: session.userId }, { receiverId: session.userId }] },
    orderBy: { createdAt: 'desc' },
    select: { id: true, content: true, createdAt: true, senderId: true, receiverId: true, read: true }
  });

  // Build per-contact preview map
  const messageMap = new Map();
  messages.forEach(msg => {
    const contactId = msg.senderId === session.userId ? msg.receiverId : msg.senderId;
    if (!messageMap.has(contactId)) {
      messageMap.set(contactId, {
        lastMessage: decryptMessage(msg.content),
        lastMessageAt: msg.createdAt,
        unread: !msg.read && msg.receiverId === session.userId
      });
    }
  });

  const users = allUsers.map(u => ({
    ...u,
    ...(messageMap.get(u.id) || { lastMessageAt: new Date(0), lastMessage: '', unread: false })
  })).sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

  // Fetch full conversation if a contact is selected
  let conversation: any[] = [];
  if (activeUserId) {
    const rawConv = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.userId, receiverId: activeUserId },
          { senderId: activeUserId, receiverId: session.userId },
        ],
        NOT: { deletedFor: { contains: session.userId } }
      },
      orderBy: { createdAt: 'asc' }
    });
    conversation = rawConv.map(msg => ({ ...msg, content: decryptMessage(msg.content) }));
  }

  const activeUser = users.find(u => u.id === activeUserId);

  return (
    <div style={{
      position: 'fixed',
      top: '64px',
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-color)',
      overflow: 'hidden',
    }}>
      {/* Page header bar */}
      <div style={{
        padding: '1rem 2rem',
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--card-border)',
        flexShrink: 0,
      }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
          🔒 Secure Network Dialogue
        </h1>
        <p style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          End-to-End Encrypted · BTKIT Graduates Only
        </p>
      </div>

      {/* Main chat grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        flex: 1,
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Left Sidebar */}
        <MessageSidebar users={users} activeUserId={activeUserId} />

        {/* Right Chat Area */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--card-bg)',
          borderLeft: '1px solid var(--card-border)',
        }}>
          <ChatUI
            receiverId={activeUserId || ''}
            receiverName={activeUser?.name || ''}
            initialMessages={conversation}
            currentUserId={session.userId}
          />
        </div>
      </div>
    </div>
  );
}
