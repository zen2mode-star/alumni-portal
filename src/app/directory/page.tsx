export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';
import DirectoryClient from './DirectoryClient';
import StaffVoices from '@/components/StaffVoices';

const prisma = new PrismaClient();

export default async function DirectoryPage() {
  const members = await prisma.user.findMany({
    where: { 
      status: 'APPROVED'
    },
    select: {
      id: true,
      name: true,
      role: true,
      designation: true,
      gradYear: true,
      startYear: true,
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

  const formattedMembers = members.map(m => ({
    id: m.id,
    name: m.name,
    role: m.role,
    designation: m.designation,
    gradYear: m.gradYear || (m.startYear ? m.startYear + 4 : 2024),
    department: m.branch || 'KEC Community',
    company: m.role === 'STUDENT' ? 'BTKIT Dwarahat' : (m.company || 'Searching...'),
    jobTitle: m.jobRole || (m.role === 'STUDENT' ? 'Emerging Talent' : 'Professional'),
    skills: m.skills ? m.skills.split(',') : [],
    imageUrl: m.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=7B61FF&color=fff`,
    bio: m.bio || `Verified ${m.role} Member`,
  }));

  return (
    <div className="kec-container">
      <StaffVoices messages={staffMessages} />
      <Suspense fallback={<div>Loading Directory...</div>}>
        <DirectoryClient 
          initialData={formattedMembers} 
          title="KEC Network Directory" 
          subtitle="Integrated community access for Alumni, Staff, Faculty, and Leadership"
          iconType="alumni"
        />
      </Suspense>
    </div>
  );
}
