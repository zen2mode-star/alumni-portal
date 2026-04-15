const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
  const users = await prisma.user.findMany();
  const posts = await prisma.post.findMany();
  const messages = await prisma.message.findMany();
  const jobs = await prisma.job.findMany();
  const jobImages = await prisma.jobImage.findMany();
  const jobInterests = await prisma.jobInterest.findMany();
  const events = await prisma.event.findMany();
  const verifiedEmails = await prisma.verifiedEmail.findMany();
  const banners = await prisma.homeBanner.findMany();
  const companies = await prisma.homeCompany.findMany();
  const notices = await prisma.notice.findMany();
  const assets = await prisma.siteAsset.findMany();
  const configs = await prisma.siteConfig.findMany();
  const legacyPhotos = await prisma.legacyPhoto.findMany();

  const data = {
    users,
    posts,
    messages,
    jobs,
    jobImages,
    jobInterests,
    events,
    verifiedEmails,
    banners,
    companies,
    notices,
    assets,
    configs,
    legacyPhotos
  };

  const scratchDir = path.join(__dirname, '..', 'scratch');
  if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir);
  
  fs.writeFileSync(
    path.join(scratchDir, 'migration-data.json'),
    JSON.stringify(data, null, 2)
  );
  
  console.log('Extraction complete!');
  console.log(`Users: ${users.length}, Posts: ${posts.length}, Messages: ${messages.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
