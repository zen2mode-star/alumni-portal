'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

async function checkAdmin() {
  const session = await verifySession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized access');
  }
  return session;
}

export async function toggleUserApproval(userId: string, status: string) {
  try {
    await checkAdmin();
    await prisma.user.update({
      where: { id: userId },
      data: { status }
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update user status' };
  }
}

export async function resetUserPassword(userId: string, newPassword: string) {
  try {
    await checkAdmin();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    return { error: 'Failed to reset password' };
  }
}

export async function deleteUser(userId: string) {
  try {
    await checkAdmin();
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete user' };
  }
}

export async function addVerifiedEmail(data: { email: string, name: string, startYear: number, gradYear: number }) {
  try {
    await checkAdmin();
    await prisma.verifiedEmail.upsert({
      where: { email: data.email },
      update: data,
      create: data
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to save verified email' };
  }
}

export async function uploadVerifiedEmails(formData: FormData) {
  try {
    await checkAdmin();
    const file = formData.get('csvFile') as File;
    if (!file) return { error: 'No file uploaded' };

    const text = await file.text();
    // Expecting: Name,Email,StartYear,GradYear,AuthCode
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    for (const record of (records as any[])) {
      await prisma.verifiedEmail.upsert({
        where: { email: record.Email },
        update: {
          name: record.Name,
          authCode: record.AuthCode || null,
          startYear: parseInt(record.StartYear) || null,
          gradYear: parseInt(record.GradYear) || null
        },
        create: {
          email: record.Email,
          name: record.Name,
          authCode: record.AuthCode || null,
          startYear: parseInt(record.StartYear) || null,
          gradYear: parseInt(record.GradYear) || null
        }
      });
    }

    revalidatePath('/admin');
    return { success: true, count: records.length };
  } catch (error) {
    console.error('CSV error:', error);
    return { error: 'Failed to process CSV file. Ensure columns are: Name,Email,StartYear,GradYear,AuthCode' };
  }
}
