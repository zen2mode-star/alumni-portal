'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkNewContent } from '@/actions/home';

interface Props {
  lastPostTime: string | null;
  lastJobTime: string | null;
}

export default function AutoRefresh({ lastPostTime, lastJobTime }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Only auto-refresh on home or feed or jobs
    const watchPaths = ['/', '/feed', '/jobs'];
    if (!watchPaths.includes(pathname)) return;

    const interval = setInterval(async () => {
      const res = await checkNewContent(lastPostTime, lastJobTime);
      if (res.hasUpdate) {
        console.log('New content detected! Refreshing...');
        router.refresh();
      }
    }, 60000); // Check Every 60 seconds

    return () => clearInterval(interval);
  }, [mounted, lastPostTime, lastJobTime, pathname, router]);

  return null;
}
