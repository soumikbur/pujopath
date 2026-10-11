import { NextRequest, NextResponse } from 'next/server';
import { PandalService } from '@/lib/services/PandalService';
import { FilterOptions, LocalityZone, CrowdLevel, PandalCategory } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const searchQuery = searchParams.get('q') || '';
    const zone = (searchParams.get('zone') as LocalityZone | 'All') || 'All';
    const crowdLevel = (searchParams.get('crowd') as CrowdLevel | 'All') || 'All';
    const category = (searchParams.get('category') as PandalCategory | 'All') || 'All';
    const metroAccessibleOnly = searchParams.get('metroOnly') === 'true';
    const wheelchairAccessibleOnly = searchParams.get('wheelchairOnly') === 'true';
    const featuredOnly = searchParams.get('featuredOnly') === 'true';
    const heritageOnly = searchParams.get('heritageOnly') === 'true';
    const sortBy = (searchParams.get('sort') as FilterOptions['sortBy']) || 'recommended';

    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const parsedLat = latParam ? parseFloat(latParam) : NaN;
    const parsedLng = lngParam ? parseFloat(lngParam) : NaN;
    const userLat = !isNaN(parsedLat) && parsedLat >= -90 && parsedLat <= 90 ? parsedLat : undefined;
    const userLng = !isNaN(parsedLng) && parsedLng >= -180 && parsedLng <= 180 ? parsedLng : undefined;

    const filters: Partial<FilterOptions> = {
      searchQuery,
      zone,
      crowdLevel,
      category,
      metroAccessibleOnly,
      wheelchairAccessibleOnly,
      featuredOnly,
      heritageOnly,
      sortBy,
    };

    const pandals = PandalService.filterPandals(filters, userLat, userLng);

    return NextResponse.json({
      success: true,
      count: pandals.length,
      data: pandals,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve pandals' },
      { status: 500 }
    );
  }
}
