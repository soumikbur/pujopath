import { NextRequest, NextResponse } from 'next/server';
import { PUJA_MUSIC_DATA } from '@/data/music';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let tracks = PUJA_MUSIC_DATA;
    if (category && category !== 'All') {
      tracks = tracks.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      count: tracks.length,
      data: tracks,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve music' },
      { status: 500 }
    );
  }
}
