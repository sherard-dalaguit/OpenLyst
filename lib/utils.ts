import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimeStamp = (createdAt: Date) => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let value: number;
  let unit: string;

  if (diffInSeconds < 60) {
    value = diffInSeconds;
    unit = 'second';
  } else if (diffInSeconds < 3600) {
    value = Math.floor(diffInSeconds / 60);
    unit = 'minute';
  } else if (diffInSeconds < 86400) {
    value = Math.floor(diffInSeconds / 3600);
    unit = 'hour';
  } else if (diffInSeconds < 86400 * 7) {
    value = Math.floor(diffInSeconds / 86400);
    unit = 'day';
  } else if (diffInSeconds < 86400 * 30) {
    value = Math.floor(diffInSeconds / (86400 * 7));
    unit = 'week';
  } else if (diffInSeconds < 86400 * 365) {
    value = Math.floor(diffInSeconds / (86400 * 30));
    unit = 'month';
  } else {
    value = Math.floor(diffInSeconds / (86400 * 365));
    unit = 'year';
  }

  const plural = value === 1 ? '' : 's';
  return `${value} ${unit}${plural} ago`;
}
