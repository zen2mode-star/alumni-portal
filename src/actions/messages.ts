'use server';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { encryptMessage } from '@/lib/encryption';
import { uploadImage } from '@/lib/cloudinary';

const prisma = new PrismaClient();

export async function sendMessage(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session?.userId) throw new Error('Not logged in');

    const receiverId = formData.get('receiverId') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File | null;

    let imageUrl = null;
    if (image && image.size > 0) {
      try {
        imageUrl = await uploadImage(image, 'messages');
      } catch (e) {
        throw new Error('Failed to upload message attachment.');
      }
    }

    if (!content && !imageUrl) throw new Error('Empty message');

    await prisma.message.create({
      data: {
        content: encryptMessage(content || ''),
        imageUrl,
        senderId: session.userId,
        receiverId,
        read: false
      }
    });
    
    revalidatePath('/messages');
    return { success: true };
  } catch (error) {
    console.error('Send Error:', error);
    return { error: 'Failed to send message.' };
  }
}

export async function deleteConversation(otherUserId: string, mode: 'self' | 'both') {
  try {
    const session = await verifySession();
    if (!session?.userId) throw new Error('Unauthorized');

    if (mode === 'both') {
      // Hard delete — remove all messages from DB for both parties
      await prisma.message.deleteMany({
        where: {
          OR: [
            { senderId: session.userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: session.userId }
          ]
        }
      });
    } else {
      // Soft delete — mark messages as deleted for current user only
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: session.userId }
          ]
        },
        select: { id: true, deletedFor: true }
      });

      for (const msg of messages) {
        const existing = msg.deletedFor ? msg.deletedFor.split(',').filter(Boolean) : [];
        if (!existing.includes(session.userId)) {
          await prisma.message.update({
            where: { id: msg.id },
            data: { deletedFor: [...existing, session.userId].join(',') }
          });
        }
      }
    }

    revalidatePath('/messages');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete conversation.' };
  }
}

export async function markAsRead(senderId: string) {
  try {
    const session = await verifySession();
    if (!session?.userId) return;

    const result = await prisma.message.updateMany({
      where: {
        senderId: senderId,
        receiverId: session.userId,
        read: false
      },
      data: {
        read: true
      }
    });

    if (result.count > 0) {
      revalidatePath('/messages');
      revalidatePath('/dashboard');
    }
  } catch (error) {
    console.error('Error marking as read:', error);
  }
}
