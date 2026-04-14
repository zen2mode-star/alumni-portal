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
    if (post.imageUrl) {
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
    if (msg.imageUrl) {
      msg.imageUrl = await uploadToCloudinary(msg.imageUrl, 'messages');
    }
    await prisma.message.upsert({
      where: { id: msg.id },
      update: msg,
      create: msg,
    });
  }

  console.log('Migration Successfully Completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
