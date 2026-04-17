const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const users = await p.user.count();
  const posts = await p.post.count();
  const messages = await p.message.count();
  const jobs = await p.job.count();
  const events = await p.event.count();
  const verified = await p.verifiedEmail.count();
  const banners = await p.homeBanner.count();
  const companies = await p.homeCompany.count();
  const notices = await p.notice.count();
  const assets = await p.siteAsset.count();
  const configs = await p.siteConfig.count();
  const legacy = await p.legacyPhoto.count();

  console.log('=== Neon Cloud DB Status ===');
  console.log('Users:', users);
  console.log('Posts:', posts);
  console.log('Messages:', messages);
  console.log('Jobs:', jobs);
  console.log('Events:', events);
  console.log('Verified Emails:', verified);
  console.log('Banners:', banners);
  console.log('Companies:', companies);
  console.log('Notices:', notices);
  console.log('Site Assets:', assets);
  console.log('Site Configs:', configs);
  console.log('Legacy Photos:', legacy);
}

main().catch(console.error).finally(() => p.$disconnect());
