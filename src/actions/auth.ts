'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession, verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function login(formData: FormData) {
  try {
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) return { error: 'Email and password required' };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: 'Invalid credentials' };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { error: 'Invalid credentials' };

    await createSession(user.id, user.role);

    // Redirect logic
    if (user.role === 'ADMIN') return { success: true, url: '/admin' };
    if (user.status === 'PENDING') return { success: true, url: '/pending' };
    return { success: true, url: '/dashboard' };
  } catch (error: any) {
    return { error: 'Login failed. Please try again.' };
  }
}

export async function register(formData: FormData) {
  try {
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const name = formData.get('name')?.toString();
    const role = formData.get('role')?.toString();
    const authCode = formData.get('authCode')?.toString();

    if (!email || !password || !name || !role || !authCode) return { error: 'All fields are required' };

    // 1. Verify against official alumni list (VerifiedEmail)
    const verified = await prisma.verifiedEmail.findUnique({ where: { email } });
    if (!verified) {
      return { error: 'Your email is not in the KEC database. Please contact the administrator.' };
    }

    if (verified.authCode !== authCode) {
      return { error: 'Invalid KEC Verification Code for this email.' };
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: 'An account with this email already exists.' };

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. Create user (forced to PENDING for admin approval)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: verified.name || name, // Prefer institutional name
        role,
        status: 'PENDING',
        startYear: verified.startYear,
        gradYear: verified.gradYear,
        imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(verified.name || name)}&background=7B61FF&color=fff`,
      }
    });

    await createSession(user.id, user.role);
    return { success: true, url: '/pending' };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { error: 'Registration failed. Please try again later.' };
  }
}

export async function changePassword(formData: FormData) {
  try {
    const session = await verifySession();
    if (!session) return { error: 'Unauthorized' };

    const prevPassword = formData.get('prevPassword')?.toString();
    const newPassword = formData.get('newPassword')?.toString();

    if (!prevPassword || !newPassword) return { error: 'All fields required' };

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return { error: 'User not found' };

    const isMatch = await bcrypt.compare(prevPassword, user.password);
    if (!isMatch) return { error: 'Current password is incorrect' };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedPassword }
    });

    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    return { error: 'Failed to update password' };
  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
