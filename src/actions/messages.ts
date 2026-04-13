'use server';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function sendMessage(receiverId: string, content: string) {
  try {
    const session = await verifySession();
    if (!session?.userId) throw new Error('Not logged in');

    await prisma.message.create({
      data: {
        content,
        senderId: session.userId,
        receiverId,
        read: false
      }
    });
    
    revalidatePath('/messages');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to send message.' };
  }
}

export async function markAsRead(senderId: string) {
  try {
    const session = await verifySession();
    if (!session?.userId) return;

    await prisma.message.updateMany({
      where: {
        senderId: senderId,
        receiverId: session.userId,
        read: false
      },
      data: {
        read: true
      }
    });

    revalidatePath('/messages');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error marking as read:', error);
  }
}
