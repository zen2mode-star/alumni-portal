'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/cloudinary';

const prisma = new PrismaClient();

export async function uploadLegacyPhoto(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session) return { error: 'You must be signed in to contribute to the legacy wall.' };

    const imageFile = formData.get('photo') as File;
    const caption = formData.get('caption') as string;
    const yearStr = formData.get('year') as string;
    const year = parseInt(yearStr);

    if (!imageFile || imageFile.size === 0) return { error: 'Please select a photo.' };
    if (!year) return { error: 'Please specify the batch year.' };

    const imageUrl = await uploadImage(imageFile, 'legacy');

    await prisma.legacyPhoto.create({
      data: {
        imageUrl,
        caption: caption || undefined,
        year,
        authorId: session.userId,
        status: 'PENDING'
      }
    });

    revalidatePath('/legacy');
    return { success: true, message: 'Your memory has been submitted for admin approval!' };
  } catch (err) {
    console.error('Legacy upload error:', err);
    return { error: 'Failed to upload photo.' };
  }
}

export async function getLegacyPhotos(year?: number) {
  try {
    return await prisma.legacyPhoto.findMany({
      where: { 
        status: 'APPROVED',
        ...(year ? { year } : {})
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    return [];
  }
}
