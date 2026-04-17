import { PrismaClient } from '@prisma/client';
import FacultyClient from './FacultyClient';
import { departments } from '@/data/faculty';

const prisma = new PrismaClient();

export const metadata = {
  title: "Faculty Directory - KEC Alumni Portal",
  description: "Official faculty and staff directory of BTKIT Dwarahat",
};

export default async function FacultyPage() {
  const staff = await prisma.user.findMany({
    where: { 
      role: 'STAFF',
      status: 'APPROVED'
    },
    select: {
      email: true,
      imageUrl: true,
      bio: true,
      name: true,
      jobRole: true,
      branch: true,
    }
  });

  // Create a map of registered staff by email
  const registeredStaffMap = new Map();
  staff.forEach(s => {
    if (s.email) registeredStaffMap.set(s.email.toLowerCase(), s);
  });

  // Combine static data with registered data
  const dynamicDepartments = departments.map(dept => ({
    ...dept,
    members: dept.members.map(member => {
      const registered = member.email ? registeredStaffMap.get(member.email.toLowerCase()) : null;
      if (registered) {
        return {
          ...member,
          imageUrl: registered.imageUrl || member.profileUrl, // Prefer DB image if exists
          bio: registered.bio,
          isRegistered: true,
          position: registered.jobRole || member.position,
        };
      }
      return { ...member, isRegistered: false };
    })
  }));

  return <FacultyClient initialDepartments={dynamicDepartments} />;
}
