'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function getOpenRegistrationStatus() {
  const config = await prisma.siteConfig.findUnique({
    where: { key: 'OPEN_REGISTRATION' }
  });
  return config?.value === 'TRUE';
}

export async function toggleOpenRegistration(enabled: boolean) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    await prisma.siteConfig.upsert({
      where: { key: 'OPEN_REGISTRATION' },
      update: { value: enabled ? 'TRUE' : 'FALSE' },
      create: { key: 'OPEN_REGISTRATION', value: enabled ? 'TRUE' : 'FALSE' }
    });

    revalidatePath('/admin');
    revalidatePath('/register');
    return { success: true, message: `Registration is now ${enabled ? 'OPEN' : 'CLOSED'}` };
  } catch (err) {
    return { error: 'Failed to update site configuration.' };
  }
}

export async function getPendingLegacyPhotos() {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return [];

    return await prisma.legacyPhoto.findMany({
      where: { status: 'PENDING' },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    return [];
  }
}

export async function handleLegacyPhoto(id: string, action: 'APPROVE' | 'REJECT') {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    if (action === 'APPROVE') {
      await prisma.legacyPhoto.update({
        where: { id },
        data: { status: 'APPROVED' }
      });
    } else {
      await prisma.legacyPhoto.delete({
        where: { id }
      });
    }

    revalidatePath('/admin');
    revalidatePath('/legacy');
    return { success: true };
  } catch (err) {
    return { error: 'Action failed.' };
  }
}

export async function addVerifiedEmail(data: { name: string, email: string, startYear: number, gradYear: number }) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    await prisma.verifiedEmail.create({
      data: {
        name: data.name,
        email: data.email,
        startYear: data.startYear,
        gradYear: data.gradYear
      }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to add member.' };
  }
}

export async function toggleUserApproval(userId: string, status: string) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    await prisma.user.update({
      where: { id: userId },
      data: { status }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to update user status.' };
  }
}

export async function resetUserPassword(userId: string, newPass: string) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    const hashedPassword = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (err) {
    return { error: 'Failed to reset password.' };
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to delete user.' };
  }
}

export async function getAlumniCompanies() {
  try {
    const alumni = await prisma.user.findMany({
      where: { role: 'ALUMNI', status: 'APPROVED' },
      select: { company: true }
    });
    
    const companies = Array.from(new Set(alumni.map(a => a.company).filter(Boolean)));
    return companies as string[];
  } catch (err) {
    return [];
  }
}

export async function uploadVerifiedEmails(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    const file = formData.get('csvFile') as File;
    if (!file) return { error: 'No file uploaded' };

    const text = await file.text();
    const rows = text.split('\n').slice(1); // Skip header
    let count = 0;

    for (const row of rows) {
      const [name, email, startYear, gradYear] = row.split(',').map(s => s?.trim());
      if (email && name) {
        await prisma.verifiedEmail.upsert({
          where: { email },
          update: { name, startYear: parseInt(startYear), gradYear: parseInt(gradYear) },
          create: { name, email, startYear: parseInt(startYear), gradYear: parseInt(gradYear) }
        });
        count++;
      }
    }

    revalidatePath('/admin');
    return { success: true, count };
  } catch (err) {
    console.error('Upload error:', err);
    return { error: 'Failed to upload CSV.' };
  }
}
