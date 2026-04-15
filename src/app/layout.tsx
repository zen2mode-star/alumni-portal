import { verifySession } from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeContext";
import AutoRefresh from "@/components/AutoRefresh";
import "./globals.css";


const prisma = new PrismaClient();

export const metadata = {
  title: "KecAlumni.in - Official Alumni Network",
  description: "Connect with the official alumni network of BTKIT (KEC) Dwarahat — KecAlumni.in. Bridging generations of excellence since 1991.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await verifySession();
  
  // Fetch latest update times for smart refresh
  const [latestPost, latestJob] = await Promise.all([
    prisma.post.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
    prisma.job.findFirst({ orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
  ]);

  const lastPostTime = latestPost?.createdAt.toISOString() || null;
  const lastJobTime = latestJob?.createdAt.toISOString() || null;

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="app-container">
            <AutoRefresh lastPostTime={lastPostTime} lastJobTime={lastJobTime} />
            <Navbar />
            <main className="main-content">
              {children}

            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
