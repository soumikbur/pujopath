import { PujaDay } from '@/types';
import { PUJA_CALENDAR_DATA } from '@/data/calendar';

export class CalendarService {
  static getCalendar(): PujaDay[] {
    return [...PUJA_CALENDAR_DATA];
  }

  static getPujaDayBySlug(slug: string): PujaDay | null {
    return PUJA_CALENDAR_DATA.find((d) => d.slug === slug || d.id === slug) || null;
  }

  static getCountdown(targetDateStr: string = '2026-10-16T06:00:00+05:30') {
    const target = new Date(targetDateStr).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isLive: true,
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isLive: false,
    };
  }

  static getTodayOrUpcoming(): PujaDay {
    return PUJA_CALENDAR_DATA[1];
  }
}
