import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const alumniData = [
  { name: 'KAILASH CHANDRA VERMA', jobRole: 'Vice President', company: 'T Systems', branch: 'ece', gradYear: 1995 },
  { name: 'RAMENDRA UMRAV', jobRole: 'Senior Project Manager', company: 'HCL Technologies, Hyderabad', branch: 'cse', gradYear: 2000 },
  { name: 'ASHISH JOHARI', jobRole: 'Director', company: 'Nagarro Inc', branch: 'ce', gradYear: 1998 },
  { name: 'ANUJ GARG', jobRole: 'Client Partner', company: 'UST', branch: 'ece', gradYear: 2002 },
  { name: 'PRASHANT VASHISHTHA', jobRole: 'Senior Program Director', company: 'Nokia UK Ltd', branch: 'cse', gradYear: 2005 },
  { name: 'DR. PARAG AGRAWAL', jobRole: 'CVO', company: 'IRCTC', branch: 'mechanical', gradYear: 1992 },
  { name: 'AJIT GUPTA', jobRole: 'Vice President - Technology', company: 'Natwest Group Plc', branch: 'cse', gradYear: 1996 },
  { name: 'SATYENDRA SINGH', jobRole: 'Global Instructor', company: 'Udemy Inc. USA', branch: 'electrical', gradYear: 2008 },
  { name: 'GAURAV VINOD SAXENA', jobRole: 'Director, Bank Operations', company: 'Capital One Bank N.A', branch: 'chemical engnieer', gradYear: 2001 },
  { name: 'ASHISH SINGHAL', jobRole: 'Director', company: 'Singhal Coke Industries, Rampur', branch: 'mechanical', gradYear: 1999 },
  { name: 'NAUSHAD ALI', jobRole: 'Superintendent Sales', company: 'Dubai Cable Company (DUCAB), Dubai', branch: 'electrical', gradYear: 2007 },
  { name: 'RAKESH KUMAR UPADHYAY', jobRole: 'Manager (C&I)', company: 'Sohar International Urea', branch: 'ece', gradYear: 2004 },
  { name: 'PANKAJ SHARMA', jobRole: 'Principal Technical Program Manager', company: 'Microsoft, Hyderabad', branch: 'cse', gradYear: 2003 },
  { name: 'ABHISHEK PRIYA', jobRole: 'Co-Founder/CTO', company: 'Aarmorics Security Inc, San Francisco, CA', branch: 'cse', gradYear: 2006 },
  { name: 'Sanjeev Chhabra', jobRole: 'Director', company: 'Yash Infonet Pvt. Ltd., Noida', branch: 'MCA', gradYear: 1997 }
];

async function main() {
  console.log('Seeding Database with BTKIT Alumni...');

  // Create an Admin
  await prisma.user.upsert({
    where: { email: 'admin@btkit.ac.in' },
    update: {},
    create: {
      email: 'admin@btkit.ac.in',
      password: 'adminpassword123', // In real app, hash this
      name: 'BTKIT Admin',
      role: 'ADMIN',
      status: 'APPROVED',
    },
  });

  for (const a of alumniData) {
    const email = `${a.name.split(' ').join('.').toLowerCase()}@example.com`;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: 'password123',
        name: a.name,
        role: 'ALUMNI',
        status: 'APPROVED',
        company: a.company,
        jobRole: a.jobRole,
        branch: a.branch,
        gradYear: a.gradYear,
        imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=random`,
        bio: `Happy to connect with students from BTKIT. Currently working at ${a.company}.`
      }
    });
  }

  console.log('Database seeded successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
