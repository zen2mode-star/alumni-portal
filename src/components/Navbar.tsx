import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import TopNavbar from './TopNavbar';

const prisma = new PrismaClient();

export default async function Navbar() {
  const session = await verifySession();
  
  let unreadCount = 0;
  let user = null;
  let latestUnread: any = null;
  let latestPostTime: any = null;

  if (session?.userId) {
    const data = await Promise.all([
      prisma.message.count({
        where: {
          receiverId: session.userId,
          read: false
        }
      }),
      prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true, imageUrl: true }
      }),
      prisma.message.findFirst({
        where: {
          receiverId: session.userId,
          read: false
        },
        orderBy: { createdAt: 'desc' },
        include: { sender: { select: { name: true } } }
      }),
      prisma.post.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
      })
    ]);
    unreadCount = data[0];
    user = data[1];
    latestUnread = data[2];
    latestPostTime = data[3]?.createdAt?.toISOString() || null;
  }

  return (
    <TopNavbar 
      user={user} 
      unreadCount={unreadCount} 
      latestUnread={latestUnread}
      isAdmin={session?.role === 'ADMIN'}
      latestPostTime={latestPostTime}
    />
  );
}
