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

export async function addVerifiedEmail(data: { name: string, email: string, startYear: number, gradYear: number, authCode?: string, role?: string }) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    // Enforce 5-digit auth code if provided
    let finalAuthCode = data.authCode || null;
    if (finalAuthCode && finalAuthCode.length !== 5) {
      return { error: 'Auth code must be exactly 5 digits' };
    }

    await prisma.verifiedEmail.create({
      data: {
        name: data.name,
        email: data.email,
        startYear: data.startYear,
        gradYear: data.gradYear,
        authCode: finalAuthCode,
        role: data.role || 'ALUMNI'
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
      if (!row.trim()) continue;
      const [name, email, startYear, gradYear, authCode, role] = row.split(',').map(s => s?.trim());
      
      let finalAuthCode = authCode || null;
      if (finalAuthCode && finalAuthCode.length !== 5) {
        finalAuthCode = finalAuthCode.slice(0, 5); // Fallback: truncate to 5 digits
      }

      if (email && name) {
        await prisma.verifiedEmail.upsert({
          where: { email },
          update: { 
            name, 
            startYear: parseInt(startYear) || null, 
            gradYear: parseInt(gradYear) || null,
            authCode: finalAuthCode,
            role: (role?.toUpperCase() === 'STAFF' ? 'STAFF' : 'ALUMNI')
          },
          create: { 
            name, 
            email, 
            startYear: parseInt(startYear) || null, 
            gradYear: parseInt(gradYear) || null,
            authCode: finalAuthCode,
            role: (role?.toUpperCase() === 'STAFF' ? 'STAFF' : 'ALUMNI')
          }
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

export async function getPotentialDuplicates() {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return [];

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, status: true, role: true, createdAt: true }
    });

    const nameMap = new Map<string, any[]>();
    users.forEach(u => {
      const existing = nameMap.get(u.name) || [];
      nameMap.set(u.name, [...existing, u]);
    });

    const duplicates = Array.from(nameMap.entries())
      .filter(([name, list]) => list.length > 1)
      .map(([name, list]) => ({ name, users: list }));

    return duplicates;
  } catch (err) {
    return [];
  }
}

export async function resolveDuplicate(userIdToDelete: string) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    await prisma.user.delete({
      where: { id: userIdToDelete }
    });

    revalidatePath('/admin');
    return { success: true, message: 'Duplicate profile purged from KecNetwork.in database.' };
  } catch (err) {
    return { error: 'Failed to resolve duplicate.' };
  }
}

export async function adminEditPost(postId: string, newContent: string) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { content: true, authorId: true }
    });

    if (!post) return { error: 'Post not found.' };

    await prisma.post.update({
      where: { id: postId },
      data: { 
        content: newContent,
        adminEdited: true
      }
    });

    // Notify the author
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        message: `KecNetwork.in Admin Action: Your post content has been refined for institutional clarity. You have the right to appeal.`,
        type: 'EDIT',
        targetId: postId
      }
    });

    revalidatePath('/feed');
    revalidatePath('/dashboard');
    return { success: true, message: 'Institutional content refined.' };
  } catch (err) {
    return { error: 'Refinement failed.' };
  }
}

export async function getUserNotifications() {
  try {
    const session = await verifySession();
    if (!session?.userId) return [];

    return await prisma.notification.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  } catch (err) {
    return [];
  }
}

export async function submitAppeal(postId: string, reason: string) {
  try {
    const session = await verifySession();
    if (!session?.userId) return { error: 'Unauthorized' };

    await prisma.appeal.create({
      data: {
        userId: session.userId,
        postId,
        reason,
        status: 'PENDING'
      }
    });

    return { success: true, message: 'Appeal submitted for institutional review.' };
  } catch (err) {
    return { error: 'Appeal failed.' };
  }
}
