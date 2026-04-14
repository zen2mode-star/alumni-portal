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

  const [unreadResult, userResult, latestUnreadResult, latestPostResult, logoAsset] = await Promise.all([
    session?.userId ? prisma.message.count({
      where: {
        receiverId: session.userId,
        read: false
      }
    }) : Promise.resolve(0),
    session?.userId ? prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, imageUrl: true }
    }) : Promise.resolve(null),
    session?.userId ? prisma.message.findFirst({
      where: {
        receiverId: session.userId,
        read: false
      },
      orderBy: { createdAt: 'desc' },
      include: { sender: { select: { name: true } } }
    }) : Promise.resolve(null),
    prisma.post.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    }),
    prisma.siteAsset.findUnique({ where: { key: 'CAMPUS_LOGO' } })
  ]);

  unreadCount = unreadResult;
  user = userResult;
  latestUnread = latestUnreadResult;
  latestPostTime = latestPostResult?.createdAt?.toISOString() || null;

  return (
    <TopNavbar 
      user={user} 
      unreadCount={unreadCount} 
      latestUnread={latestUnread}
      isAdmin={session?.role === 'ADMIN'}
      latestPostTime={latestPostTime}
      logoUrl={logoAsset?.url || null}
    />
  );
}
