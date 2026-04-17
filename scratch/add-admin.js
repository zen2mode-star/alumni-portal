const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'mj@admin';
  const password = '96278941';
  const name = 'MJ Admin';

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        status: 'APPROVED',
        imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7B61FF&color=fff`,
      },
    });

    console.log('Admin user created successfully:');
    console.log({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('Error: A user with this email already exists.');
    } else {
      console.error('Error creating admin user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
