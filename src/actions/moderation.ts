'use server';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function issueStrike(targetUserId: string, reason?: string) {
  try {
    const session = await verifySession();
    if (!session?.userId) throw new Error('Unauthorized');

    if (session.userId === targetUserId) return { error: 'Violation: You cannot strike your own profile.' };

    // 1. Check if this specific striker has already striked this target
    const existingStrike = await prisma.strike.findUnique({
      where: { strikerId_targetId: { strikerId: session.userId, targetId: targetUserId } }
    });

    if (existingStrike) return { error: 'Duplicate Action: You have already issued a strike against this member.' };

    // 2. Create the unique strike
    await prisma.strike.create({
      data: {
        strikerId: session.userId,
        targetId: targetUserId,
        reason: reason || 'Community Violation'
      }
    });

    // 3. Count unique community strikes
    const uniqueStrikeCount = await prisma.strike.count({
      where: { targetId: targetUserId }
    });

    // 4. Update the user warning count and check for auto-block
    let user = await prisma.user.update({
      where: { id: targetUserId },
      data: { warningCount: uniqueStrikeCount }
    });

    // 5. Notify the user
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        message: `KecNetwork.in Security: You have received a community strike (${uniqueStrikeCount}/3). Subsequent violations will lead to an automated platform ban.`,
        type: 'STRIKE'
      }
    });

    if (uniqueStrikeCount >= 3) {
      user = await prisma.user.update({
        where: { id: targetUserId },
        data: { isBlocked: true }
      });

      await prisma.notification.create({
        data: {
          userId: targetUserId,
          message: 'CRITICAL: Your KecNetwork.in account has been automatically restricted following 3 cumulative community strikes.',
          type: 'ADMIN'
        }
      });

      return { success: true, blocked: true, message: 'Institutional Safety: User has been automatically restricted after 3 cumulative strikes.' };
    }

    revalidatePath('/messages');
    revalidatePath('/admin');
    return { success: true, warningCount: uniqueStrikeCount };
  } catch (error) {
    console.error('Strike Error:', error);
    return { error: 'Failed to process strike action.' };
  }
}
