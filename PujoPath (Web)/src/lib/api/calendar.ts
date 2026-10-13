import { PujaDay } from '@/types';
import { CalendarService } from '@/lib/services/CalendarService';

export async function fetchCalendar(): Promise<PujaDay[]> {
  return CalendarService.getCalendar();
}

export function fetchCountdown() {
  return CalendarService.getCountdown();
}
