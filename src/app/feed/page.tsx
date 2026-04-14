export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import FeedClient from './FeedClient';

const prisma = new PrismaClient();

export default async function FeedPage() {
  const session = await verifySession();
  
  const [alumniPosts, studentPosts, user] = await Promise.all([
    prisma.post.findMany({
      where: { roleSnap: 'ALUMNI' },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, imageUrl: true, branch: true } } }
    }),
    prisma.post.findMany({
      where: { roleSnap: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, imageUrl: true, branch: true } } }
    }),
    session?.userId ? prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, imageUrl: true, role: true, status: true }
    }) : Promise.resolve(null)
  ]);

  return (
    <FeedClient 
      alumniPosts={alumniPosts} 
      studentPosts={studentPosts} 
      user={user}
      isAdmin={session?.role === 'ADMIN'}
    />
  );
}
