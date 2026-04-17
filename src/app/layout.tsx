import { verifySession } from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeContext";
import AutoRefresh from "@/components/AutoRefresh";
import "./globals.css";


const prisma = new PrismaClient();

export const metadata = {
  title: "KecNetwork.in - Official KEC Community",
  description: "Connect with the official KEC Network of BTKIT (KEC) Dwarahat — KecNetwork.in.",
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
