'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/cloudinary';

const prisma = new PrismaClient();

export async function updateProfile(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session) return { error: 'Not authenticated. Please sign in again.' };

    // Basic & Personal
    const company = formData.get('company') as string;
    const jobRole = formData.get('jobRole') as string;
    const bio = formData.get('bio') as string;
    const skills = formData.get('skills') as string;
    const location = formData.get('location') as string;
    const phone = formData.get('phone') as string;
    const website = formData.get('website') as string;

    // Academic & Institutional
    const branch = formData.get('branch') as string;
    const gradYearStr = formData.get('gradYear') as string;
    const gradYear = gradYearStr ? parseInt(gradYearStr) : undefined;
    const rollNumber = formData.get('rollNumber') as string;
    const hostel = formData.get('hostel') as string;
    const higherStudies = formData.get('higherStudies') as string;

    // Social Links
    const linkedinUrl = formData.get('linkedinUrl') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const twitterUrl = formData.get('twitterUrl') as string;
    const instagramUrl = formData.get('instagramUrl') as string;

    // Professional Accomplishments
    const achievements = formData.get('achievements') as string;
    
    // Image Handling
    const imageFile = formData.get('profileImage') as File;
    let imageUrl = formData.get('existingImageUrl') as string;

    if (imageFile && imageFile.size > 0) {
      if (!['image/jpeg', 'image/png'].includes(imageFile.type)) {
        return { error: 'Invalid file type. Please upload JPEG or PNG only.' };
      }
      
      try {
        imageUrl = await uploadImage(imageFile, 'profiles');
      } catch (e) {
        return { error: 'Failed to upload image to cloud storage.' };
      }
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { 
        // Professional
        company: company || undefined, 
        jobRole: jobRole || undefined, 
        bio: bio || undefined, 
        skills: skills || undefined, 
        achievements: achievements || undefined,

        // Personal
        location: location || undefined,
        phone: phone || undefined,
        website: website || undefined,

        // Academic
        branch: branch || undefined, 
        gradYear, 
        rollNumber: rollNumber || undefined,
        hostel: hostel || undefined,
        higherStudies: higherStudies || undefined,

        // Visual & Social
        imageUrl: imageUrl || undefined,
        linkedinUrl: linkedinUrl || undefined,
        githubUrl: githubUrl || undefined,
        twitterUrl: twitterUrl || undefined,
        instagramUrl: instagramUrl || undefined,
        
        updatedAt: new Date()
      }
    });

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/directory');
    revalidatePath('/students');
    revalidatePath(`/profile/${session.userId}`);
    
    return { success: true, message: 'Institutional dossier synchronized successfully!' };
  } catch (error: any) {
    console.error('Profile update error:', error);
    return { error: 'Failed to synchronize expanded identity markers.' };
  }
}
