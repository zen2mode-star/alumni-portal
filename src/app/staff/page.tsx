import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';
import DirectoryClient from '../directory/DirectoryClient';
import StaffVoices from '@/components/StaffVoices';

const prisma = new PrismaClient();

export default async function StaffPage() {
  const staff = await prisma.user.findMany({
    where: {
      role: 'STAFF',
      status: 'APPROVED'
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      branch: true,
      jobRole: true,
      imageUrl: true,
      bio: true,
    }
  });

  const staffMessages = await prisma.notice.findMany({
    where: {
      designation: { in: ['Director', 'Ex-Director', 'Registrar', 'Dean Academics', 'Alumni Cell'] }
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const formattedStaff = staff.map(s => ({
    id: s.id,
    name: s.name,
    department: s.branch || 'KEC Faculty',
    role: s.jobRole || 'Official Staff',
    company: 'BTKIT Dwarahat',
    imageUrl: s.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=7B61FF&color=fff`,
    bio: s.bio || 'Proud member of the KEC institutional ecosystem.',
    isStudent: false
  }));

  return (
    <div className="kec-container">
      <StaffVoices messages={staffMessages} />
      <Suspense fallback={<div>Loading Staff Directory...</div>}>
        <DirectoryClient 
          initialData={formattedStaff} 
          title="KEC Campus Staff" 
          subtitle="Profiles of the management and faculty at BTKIT Dwarahat"
          iconType="alumni"
        />
      </Suspense>
    </div>
  );
}
