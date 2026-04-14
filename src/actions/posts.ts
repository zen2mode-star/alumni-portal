'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/cloudinary';

const prisma = new PrismaClient();

export async function createPost(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session) return { error: 'Not authenticated. Campus verification required.' };

    const content = formData.get('content') as string;
    if (!content || content.trim().length === 0) {
      return { error: 'Post content cannot be empty.' };
    }

    // Media Handling
    const imageFile = formData.get('postImage') as File;
    let imageUrl: string | undefined = undefined;

    if (imageFile && imageFile.size > 0) {
      // 5MB Limit check
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: 'Media size exceeds 5MB limit.' };
      }

      try {
        imageUrl = await uploadImage(imageFile, 'posts');
      } catch (e) {
        return { error: 'Failed to upload campus media.' };
      }
    }

    // Role snapshot ensures the post stays in the correct tab even if user upgrades role later
    await prisma.post.create({
      data: {
        content,
        imageUrl,
        authorId: session.userId,
        roleSnap: session.role
      }
    });

    revalidatePath('/feed');
    revalidatePath('/');
    return { success: true, message: 'Campus update published!' };
  } catch (error) {
    console.error('Post creation error:', error);
    return { error: 'Failed to publish campus update.' };
  }
}

export async function deletePost(postId: string) {
  try {
    const session = await verifySession();
    if (!session) return { error: 'Not authenticated.' };

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { error: 'Update not found.' };

    if (post.authorId !== session.userId && session.role !== 'ADMIN') {
      return { error: 'Unauthorized to remove this update.' };
    }

    await prisma.post.delete({ where: { id: postId } });

    revalidatePath('/feed');
    revalidatePath('/');
    return { success: true, message: 'Update removed from network.' };
  } catch (error) {
    return { error: 'Failed to remove update.' };
  }
}
