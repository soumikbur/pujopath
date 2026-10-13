import { MusicTrack } from '@/types';
import { PUJA_MUSIC_DATA } from '@/data/music';

export async function fetchTracks(category?: string): Promise<MusicTrack[]> {
  if (category && category !== 'All') {
    return PUJA_MUSIC_DATA.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }
  return PUJA_MUSIC_DATA;
}
