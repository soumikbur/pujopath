import { NextRequest, NextResponse } from 'next/server';
import { PandalService } from '@/lib/services/PandalService';
import { PANDALS_DATA } from '@/data/pandals';

export function generateStaticParams() {
  return PANDALS_DATA.map((pandal) => ({
    slug: pandal.slug,
  }));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const parsedLat = latParam ? parseFloat(latParam) : NaN;
    const parsedLng = lngParam ? parseFloat(lngParam) : NaN;
    const userLat = !isNaN(parsedLat) && parsedLat >= -90 && parsedLat <= 90 ? parsedLat : undefined;
    const userLng = !isNaN(parsedLng) && parsedLng >= -180 && parsedLng <= 180 ? parsedLng : undefined;

    const pandal = PandalService.getPandalBySlug(slug, userLat, userLng);

    if (!pandal) {
      return NextResponse.json(
        { success: false, error: 'Pandal not found' },
        { status: 404 }
      );
    }

    const nearby = PandalService.getNearbyPandals(pandal, 4);

    return NextResponse.json({
      success: true,
      data: pandal,
      nearby,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve pandal details' },
      { status: 500 }
    );
  }
}
