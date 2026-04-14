'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';
import { uploadImage } from '@/lib/cloudinary';

const prisma = new PrismaClient();

export async function addBanner(formData: FormData) {
  try {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

    const title = formData.get('title') as string;
    const imageFile = formData.get('bannerImage') as File;

    if (!imageFile || imageFile.size === 0) {
      return { error: 'Please select an image file.' };
    }

    const imageUrl = await uploadImage(imageFile, 'banners');

    await prisma.homeBanner.create({
      data: { imageUrl, title, order: 0 }
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('Add Banner Error:', err);
    return { error: 'Failed to upload and add banner' };
  }
}

export async function deleteBanner(id: string) {
  try {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

    await prisma.homeBanner.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to delete banner' };
  }
}

export async function addHomeCompany(formData: FormData) {
  try {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

    const name = formData.get('name') as string;
    const logoFile = formData.get('logoImage') as File;

    let logoUrl = null;
    if (logoFile && logoFile.size > 0) {
      logoUrl = await uploadImage(logoFile, 'companies');
    }

    await prisma.homeCompany.create({
      data: { name, logoUrl, order: 0 }
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('Add Company Error:', err);
    return { error: 'Failed to add company' };
  }
}

export async function deleteHomeCompany(id: string) {
  try {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

    await prisma.homeCompany.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to delete company' };
  }
}

export async function updateSiteAsset(formData: FormData) {
  try {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

    const key = formData.get('key') as string;
    const imageFile = formData.get('assetImage') as File;

    if (!imageFile || imageFile.size === 0) {
      return { error: 'Please select an image file.' };
    }

    const url = await uploadImage(imageFile, 'site-assets');

    await prisma.siteAsset.upsert({
      where: { key },
      update: { url },
      create: { key, url }
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, message: `Successfully updated ${key}` };
  } catch (err) {
    console.error('Update Asset Error:', err);
    return { error: 'Failed to update site asset' };
  }
}

export async function checkNewContent(lastPostTime: string | null, lastJobTime: string | null) {
  try {
    // This is a helper for auto-refresh polling
    const [latestPost, latestJob] = await Promise.all([
      prisma.post.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
      prisma.job.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
    ]);

    const hasNewPost = latestPost && (!lastPostTime || new Date(latestPost.createdAt) > new Date(lastPostTime));
    const hasNewJob = latestJob && (!lastJobTime || new Date(latestJob.createdAt) > new Date(lastJobTime));

    return { hasUpdate: hasNewPost || hasNewJob };
  } catch (error) {
    return { hasUpdate: false };
  }
}
