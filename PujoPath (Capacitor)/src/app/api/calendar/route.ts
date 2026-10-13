import { NextResponse } from 'next/server';
import { CalendarService } from '@/lib/services/CalendarService';

export async function GET() {
  try {
    const calendar = CalendarService.getCalendar();
    const countdown = CalendarService.getCountdown();

    return NextResponse.json({
      success: true,
      countdown,
      data: calendar,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve calendar' },
      { status: 500 }
    );
  }
}
