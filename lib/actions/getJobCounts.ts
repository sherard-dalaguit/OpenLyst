'use server';

import { countJobsSince } from '@/lib/utils';

export interface JobCounts {
  dailyCount: number;
  weeklyCount: number;
  allCount: number;
}

export async function getJobCounts(): Promise<JobCounts> {
  const now = Date.now();
  const dailySince = new Date(now - 24 * 60 * 60 * 1000);
  const weeklySince = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const foreverSince = new Date(0);

  const [dailyCount, weeklyCount, allCount] = await Promise.all([
    countJobsSince(dailySince),
    countJobsSince(weeklySince),
    countJobsSince(foreverSince),
  ]);

  return { dailyCount, weeklyCount, allCount };
}