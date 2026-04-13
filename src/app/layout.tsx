import { verifySession } from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeContext";
import "./globals.css";

const prisma = new PrismaClient();

export const metadata = {
  title: "KecAlumini.in - Alumni Network",
  description: "Join the official alumni network of KecAlumini.in.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await verifySession();
  
  // No redirect in RootLayout to avoid recursion on /pending
  // But we can pass the user status to children or handle it in specific page components.
  // We'll trust the /login and /register paths are safe.

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="app-container">
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
