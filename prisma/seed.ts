import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('adminpassword123', 10);
  
  // 1. Create Master Admin
  await prisma.user.upsert({
    where: { email: 'admin@kecalumini.in' },
    update: {},
    create: {
      email: 'admin@kecalumini.in',
      name: 'Master Admin',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'APPROVED',
      branch: 'CSE',
      startYear: 2020,
      gradYear: 2024,
    },
  });

  // 2. Sample Verified Alumni List
  const verifiedList = [
    { name: 'Pankaj Sharma', email: 'pankaj@test.com', startYear: 2016, gradYear: 2020 },
    { name: 'Neha Gupta', email: 'neha@test.com', startYear: 2017, gradYear: 2021 },
    { name: 'Rahul Verma', email: 'rahul@test.com', startYear: 2018, gradYear: 2022 },
    { name: 'Anjali Singh', email: 'anjali@test.com', startYear: 2019, gradYear: 2023 },
  ];

  for (const person of verifiedList) {
    await prisma.verifiedEmail.upsert({
      where: { email: person.email },
      update: {},
      create: person,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
