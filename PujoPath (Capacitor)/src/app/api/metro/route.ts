import { NextRequest, NextResponse } from 'next/server';
import { MetroService } from '@/lib/services/MetroService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    const stations = MetroService.searchStations(query);

    return NextResponse.json({
      success: true,
      count: stations.length,
      data: stations,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve metro stations' },
      { status: 500 }
    );
  }
}
