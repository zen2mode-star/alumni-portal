
import { PrismaClient } from '@prisma/client';
import { departments } from '../src/data/faculty';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Faculty data into VerifiedEmail table...');
  
  let count = 0;
  for (const dept of departments) {
    for (const member of dept.members) {
      if (member.email) {
        const emailPrefix = member.email.split('@')[0].toUpperCase();
        const generatedAuthCode = `KEC-${emailPrefix}-STAFF`;
        
        await prisma.verifiedEmail.upsert({
          where: { email: member.email },
          update: {
            name: member.name,
            role: 'STAFF',
            authCode: generatedAuthCode,
          },
          create: {
            email: member.email,
            name: member.name,
            role: 'STAFF',
            authCode: generatedAuthCode,
          }
        });
        count++;
      }
    }
  }

  console.log(`Successfully seeded ${count} faculty members into the whitelist.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
