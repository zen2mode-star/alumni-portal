'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createJob(formData: FormData) {
  const session = await verifySession();
  if (!session || session.role === 'STUDENT') throw new Error('Not authorized to post jobs');

  const title = formData.get('title') as string;
  const company = formData.get('company') as string;
  const description = formData.get('description') as string;
  const link = (formData.get('link') as string) || '';

  await prisma.job.create({
    data: {
      title,
      company,
      description,
      link,
      authorId: session.userId
    }
  });

  revalidatePath('/jobs');
  redirect('/jobs');
}

export async function applyForJob(jobId: string, authorId: string, jobTitle: string) {
  const session = await verifySession();
  if (!session) return { error: 'Please sign in to apply.' };

  const applicant = await prisma.user.findUnique({ where: { id: session.userId } });

  // Send an automated direct message using the existing messaging system!
  await prisma.message.create({
    data: {
      content: `Hello! I would like to apply for the position of "${jobTitle}" you recently posted. Please check out my profile and let me know the next steps. Thank you! - ${applicant?.name}`,
      senderId: session.userId,
      receiverId: authorId
    }
  });

  return { success: true, message: 'Application sent! The poster has been notified in their Messages.' };
}
