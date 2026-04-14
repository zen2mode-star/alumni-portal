'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function createJob(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session) return { error: 'Not authenticated' };

    const title = formData.get('title') as string;
    const company = formData.get('company') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;

    await prisma.job.create({
      data: {
        title,
        company,
        description,
        link,
        authorId: session.userId,
        status: session.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
      }
    });

    revalidatePath('/jobs');
    revalidatePath('/');
    
    // Redirect must be outside try-catch to properly bubble up
  } catch (error) {
    return { error: 'Failed to post job' };
  }
  redirect('/jobs');
}

export async function toggleJobInterest(jobId: string) {
  try {
    const session = await verifySession();
    if (!session) return { error: 'Not authenticated' };

    const existing = await prisma.jobInterest.findUnique({
      where: {
        userId_jobId: {
          userId: session.userId,
          jobId
        }
      }
    });

    if (existing) {
      await prisma.jobInterest.delete({
        where: { id: existing.id }
      });
    } else {
      await prisma.jobInterest.create({
        data: {
          userId: session.userId,
          jobId
        }
      });
    }

    revalidatePath('/jobs');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update interest' };
  }
}

export async function deleteJob(jobId: string) {
  try {
    const session = await verifySession();
    if (!session) return { error: 'Not authenticated' };

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return { error: 'Job not found' };

    // Check if user is author OR admin
    if (job.authorId !== session.userId && session.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    await prisma.job.delete({ where: { id: jobId } });

    revalidatePath('/jobs');
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete job' };
  }
}

export async function approveJob(jobId: string) {
  try {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };
    await prisma.job.update({ where: { id: jobId }, data: { status: 'APPROVED' } });
    revalidatePath('/jobs');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to approve job' };
  }
}

export async function rejectJob(jobId: string) {
  try {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };
    await prisma.job.delete({ where: { id: jobId } });
    revalidatePath('/jobs');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to reject job' };
  }
}

export async function adminCreateJob(formData: FormData) {
  try {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

    const title = formData.get('title') as string;
    const company = formData.get('company') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;

    await prisma.job.create({
      data: {
        title,
        company,
        description,
        link,
        authorId: session.userId,
        status: 'APPROVED',
      }
    });

    revalidatePath('/jobs');
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to post job' };
  }
}
