'use client'; // Wait, server actions should NOT have 'use client'
'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';

const prisma = new PrismaClient();

export async function addBanner(formData: FormData) {
  const session = await verifySession();
  if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const imageUrl = formData.get('imageUrl') as string;
  const title = formData.get('title') as string;

  try {
    await prisma.homeBanner.create({
      data: { imageUrl, title, order: 0 }
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to add banner' };
  }
}

export async function deleteBanner(id: string) {
  const session = await verifySession();
  if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

  try {
    await prisma.homeBanner.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to delete banner' };
  }
}

export async function addHomeCompany(formData: FormData) {
  const session = await verifySession();
  if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const name = formData.get('name') as string;
  const logoUrl = formData.get('logoUrl') as string;

  try {
    await prisma.homeCompany.create({
      data: { name, logoUrl, order: 0 }
    });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to add company' };
  }
}

export async function deleteHomeCompany(id: string) {
  const session = await verifySession();
  if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

  try {
    await prisma.homeCompany.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to delete company' };
  }
}
