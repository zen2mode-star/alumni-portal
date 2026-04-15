export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';
import DirectoryClient from './DirectoryClient';
import StaffVoices from '@/components/StaffVoices';

const prisma = new PrismaClient();

export default async function DirectoryPage() {
  const alumni = await prisma.user.findMany({
    where: { 
      role: 'ALUMNI',
      status: 'APPROVED'
    },
    select: {
      id: true,
      name: true,
      gradYear: true,
      branch: true,
      company: true,
      jobRole: true,
      imageUrl: true,
      bio: true,
      skills: true,
    }
  });

  const staffMessages = await prisma.notice.findMany({
    where: {
      designation: { in: ['Director', 'Principal', 'Registrar', 'Vice Principal', 'Dean Academics', 'Alumni Cell'] }
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const formattedAlumni = alumni.map(a => ({
    id: a.id,
    name: a.name,
    gradYear: a.gradYear || 2020,
    department: a.branch || 'Unknown',
    company: a.company || 'Searching...',
    role: a.jobRole || 'Professional',
    skills: a.skills ? a.skills.split(',') : [],
    imageUrl: a.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=7B61FF&color=fff`,
    bio: a.bio || 'Verified Alumni Member',
  }));

  return (
    <div className="kec-container">
      <StaffVoices messages={staffMessages} />
      <Suspense fallback={<div>Loading Directory...</div>}>
        <DirectoryClient 
          initialData={formattedAlumni} 
          iconType="alumni"
        />
      </Suspense>
    </div>
  );
}
