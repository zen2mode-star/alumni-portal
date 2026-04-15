export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';
import { GraduationCap } from 'lucide-react';
import DirectoryClient from '../directory/DirectoryClient';
import StaffVoices from '@/components/StaffVoices';

const prisma = new PrismaClient();

export default async function StudentsPage() {
  const students = await prisma.user.findMany({
    where: { 
      role: 'STUDENT',
      status: 'APPROVED'
    },
    select: {
      id: true,
      name: true,
      startYear: true,
      branch: true,
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

  const formattedStudents = students.map(s => ({
    id: s.id,
    name: s.name,
    gradYear: s.startYear ? s.startYear + 4 : 2028,
    department: s.branch || 'Undergraduate',
    company: 'BTKIT Dwarahat',
    role: 'Emerging Talent',
    skills: s.skills ? s.skills.split(',') : [],
    imageUrl: s.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=D4AF37&color=002147`,
    bio: s.bio || 'Future Innovator of the KEC Legacy.',
    isStudent: true
  }));

  return (
    <div className="kec-container">
      <StaffVoices messages={staffMessages} />
      <Suspense fallback={<div>Loading Talent Roster...</div>}>
        <DirectoryClient 
          initialData={formattedStudents} 
          title="Emerging Student Talent"
          subtitle="Institutional roster of currently enrolled technocrats"
          iconType="student"
        />
      </Suspense>
    </div>
  );
}
