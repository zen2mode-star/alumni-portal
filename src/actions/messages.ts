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
    const audio = formData.get('audio') as File | null;

    // 1. Security Check: Is sender blocked globally?
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { isBlocked: true }
    });
    if (user?.isBlocked) return { error: 'Your account has been restricted globally on KecNetwork.in due to community violations.' };

    // 2. Security Check: Is sender blocked by receiver?
    const isBlockedByReceiver = await prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId: receiverId, blockedId: session.userId } }
    });
    if (isBlockedByReceiver) return { error: 'Conversation locked by the recipient.' };

    let imageUrl = null;
    let audioUrl = null;
    let type = 'TEXT';

    if (image && image.size > 0) {
      imageUrl = await uploadImage(image, 'messages');
      type = 'IMAGE';
    }
    if (audio && audio.size > 0) {
      audioUrl = await uploadImage(audio, 'voice_notes');
      type = 'AUDIO';
    }

    if (!content && !imageUrl && !audioUrl) throw new Error('Empty message');

    await prisma.message.create({
      data: {
        content: content ? encryptMessage(content) : null,
        imageUrl,
        audioUrl,
        type,
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

export async function toggleBlockUser(targetId: string) {
  try {
    const session = await verifySession();
    if (!session?.userId) return { error: 'Unauthorized' };

    const existing = await prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId: session.userId, blockedId: targetId } }
    });

    if (existing) {
      await prisma.block.delete({ where: { id: existing.id } });
      return { success: true, message: 'User unblocked.' };
    } else {
      await prisma.block.create({ data: { blockerId: session.userId, blockedId: targetId } });
      return { success: true, message: 'User blocked.' };
    }
  } catch {
    return { error: 'Blocking failed.' };
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
