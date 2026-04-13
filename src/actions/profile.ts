'use server';

import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateProfile(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session) return { error: 'Not authenticated. Please sign in again.' };

    const company = formData.get('company') as string;
    const jobRole = formData.get('jobRole') as string;
    const bio = formData.get('bio') as string;
    const skills = formData.get('skills') as string;
    const branch = formData.get('branch') as string;
    const gradYearStr = formData.get('gradYear') as string;
    const gradYear = gradYearStr ? parseInt(gradYearStr) : undefined;
    const linkedinUrl = formData.get('linkedinUrl') as string;
    
    const imageFile = formData.get('profileImage') as File;
    let imageUrl = formData.get('existingImageUrl') as string;

    // Handle Cloudinary Upload
    if (imageFile && imageFile.size > 0) {
      if (!['image/jpeg', 'image/png'].includes(imageFile.type)) {
        return { error: 'Invalid file type. Please upload JPEG or PNG only.' };
      }

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Convert buffer to base64 for Cloudinary upload
      const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
      
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: 'alumni-portal-profiles',
      });
      
      imageUrl = uploadResponse.secure_url;
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { 
        company: company || undefined, 
        jobRole: jobRole || undefined, 
        bio: bio || undefined, 
        skills: skills || undefined, 
        branch: branch || undefined, 
        gradYear, 
        imageUrl: imageUrl || undefined,
        linkedinUrl: linkedinUrl || undefined
      }
    });

    revalidatePath('/dashboard');
    revalidatePath('/directory');
    return { success: true, message: 'Production profile updated via Cloudinary!' };
  } catch (error: any) {
    console.error('Profile update error:', error);
    return { error: 'Failed to update profile to cloud storage.' };
  }
}
