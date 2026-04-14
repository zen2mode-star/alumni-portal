const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

// This script expects the schema to be sqlite
// We'll manually read the dev.db if we can't switch provider easily
// Actually, let's just create an admin in the CLOUD for them.

async function createCloudAdmin() {
  const prisma = new PrismaClient();
  const bcrypt = require('bcryptjs');
  
  const email = 'admin@kecalumni.in';
  const password = await bcrypt.hash('admin123', 10);
  
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: 'ADMIN', status: 'APPROVED' },
      create: {
        email,
        password,
        name: 'System Admin',
        role: 'ADMIN',
        status: 'APPROVED'
      }
    });
    console.log('Cloud Admin Created/Updated:', user.id);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

createCloudAdmin();
