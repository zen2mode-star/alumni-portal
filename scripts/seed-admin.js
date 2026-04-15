const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@kec.ac.in';
  const password = 'adminpassword';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create Verified Email entry first
  await prisma.verifiedEmail.upsert({
    where: { email },
    update: { role: 'ADMIN' },
    create: {
      email,
      name: 'KEC Admin',
      role: 'ADMIN',
      authCode: 'ADMIN123'
    }
  });

  // 2. Create actual User
  const user = await prisma.user.upsert({
    where: { email },
    update: {
        role: 'ADMIN',
        status: 'APPROVED'
    },
    create: {
      email,
      password: hashedPassword,
      name: 'KEC Admin',
      role: 'ADMIN',
      status: 'APPROVED',
      imageUrl: 'https://ui-avatars.com/api/?name=KEC+Admin&background=7B61FF&color=fff'
    }
  });

  console.log('-----------------------------------');
  console.log('✅ FRESH START COMPLETE');
  console.log('-----------------------------------');
  console.log('Admin Account Created:');
  console.log('Email: admin@kec.ac.in');
  console.log('Password: adminpassword');
  console.log('-----------------------------------');
  console.log('You can now log in at localhost:3000/login');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
