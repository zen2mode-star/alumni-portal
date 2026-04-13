export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await verifySession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect('/login');

  const pendingMessages = await prisma.message.count({
    where: { 
      receiverId: session.userId,
      read: false
    }
  });

  return <DashboardClient user={user} pendingMessages={pendingMessages} />;
}
