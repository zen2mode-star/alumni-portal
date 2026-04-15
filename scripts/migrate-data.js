const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(localPath, folder) {
  if (!localPath) return null;
  // If already a URL, return it
  if (localPath.startsWith('http')) return localPath;

  const fullPath = path.join(process.cwd(), 'public', localPath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return null;
  }

  console.log(`Uploading ${localPath}...`);
  const result = await cloudinary.uploader.upload(fullPath, {
    folder: `alumni-portal/${folder}`,
  });
  return result.secure_url;
}

async function main() {
  const dataPath = path.join(__dirname, '..', 'scratch', 'migration-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log('Starting Cloud Migration...');

  // 1. Users
  for (const user of data.users) {
    console.log(`Migrating User: ${user.email}`);
    if (user.imageUrl) {
      user.imageUrl = await uploadToCloudinary(user.imageUrl, 'profiles');
    }
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  // 2. Verified Emails
  for (const ve of data.verifiedEmails) {
    await prisma.verifiedEmail.upsert({
      where: { email: ve.email },
      update: ve,
      create: ve,
    });
  }

  // 3. Jobs
  for (const job of data.jobs) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: job,
      create: job,
    });
  }

  // 3.1 Job Images
  for (const img of data.jobImages) {
    if (!img.url.startsWith('http')) {
       img.url = await uploadToCloudinary(img.url, 'jobs');
    }
    await prisma.jobImage.upsert({
      where: { id: img.id },
      update: img,
      create: img,
    });
  }

  // 4. Job Interests
  for (const ji of data.jobInterests) {
    await prisma.jobInterest.upsert({
      where: { 
        userId_jobId: { userId: ji.userId, jobId: ji.jobId } 
      },
      update: ji,
      create: ji,
    });
  }

  // 5. Events
  for (const event of data.events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: event,
      create: event,
    });
  }

  // 6. Posts
  for (const post of data.posts) {
    if (post.imageUrl && !post.imageUrl.startsWith('http')) {
      post.imageUrl = await uploadToCloudinary(post.imageUrl, 'posts');
    }
    await prisma.post.upsert({
      where: { id: post.id },
      update: post,
      create: post,
    });
  }

  // 7. Messages
  for (const msg of data.messages) {
    if (msg.imageUrl && !msg.imageUrl.startsWith('http')) {
      msg.imageUrl = await uploadToCloudinary(msg.imageUrl, 'messages');
    }
    await prisma.message.upsert({
      where: { id: msg.id },
      update: msg,
      create: msg,
    });
  }

  // 8. Banners
  for (const banner of data.banners) {
    if (banner.imageUrl && !banner.imageUrl.startsWith('http')) {
      banner.imageUrl = await uploadToCloudinary(banner.imageUrl, 'banners');
    }
    await prisma.homeBanner.upsert({
      where: { id: banner.id },
      update: banner,
      create: banner,
    });
  }

  // 9. Companies
  for (const company of data.companies) {
    if (company.logoUrl && !company.logoUrl.startsWith('http')) {
      company.logoUrl = await uploadToCloudinary(company.logoUrl, 'companies');
    }
    await prisma.homeCompany.upsert({
      where: { id: company.id },
      update: company,
      create: company,
    });
  }

  // 10. Notices
  for (const notice of data.notices) {
    await prisma.notice.upsert({
      where: { id: notice.id },
      update: notice,
      create: notice,
    });
  }

  // 11. Assets
  for (const asset of data.assets) {
    if (asset.url && !asset.url.startsWith('http')) {
      asset.url = await uploadToCloudinary(asset.url, 'assets');
    }
    await prisma.siteAsset.upsert({
      where: { id: asset.id },
      update: asset,
      create: asset,
    });
  }

  // 12. Configs
  for (const config of data.configs) {
    await prisma.siteConfig.upsert({
      where: { id: config.id },
      update: config,
      create: config,
    });
  }

  // 13. Legacy Photos
  for (const photo of data.legacyPhotos) {
    if (photo.imageUrl && !photo.imageUrl.startsWith('http')) {
      photo.imageUrl = await uploadToCloudinary(photo.imageUrl, 'legacy');
    }
    await prisma.legacyPhoto.upsert({
      where: { id: photo.id },
      update: photo,
      create: photo,
    });
  }

  console.log('Migration Successfully Completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
