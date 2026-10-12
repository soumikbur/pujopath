export interface MusicTrack {
  id: string;
  title: string;
  titleBn: string;
  artist: string;
  artistBn: string;
  category: 'Mahalaya' | 'Dhak' | 'Agomoni' | 'Devotional' | 'Modern' | 'Classics';
  durationSeconds: number;
  audioUrl?: string;
  coverUrl: string;
  description: string;
  descriptionBn: string;
  language: 'Bengali' | 'Sanskrit' | 'Instrumental';
  playbackMethod: 'direct_audio' | 'authorized_stream' | 'external_listen_link';
  licenseType: string;
  attribution: string;
  sourceUrl: string;
  isLocalAsset: boolean;
  externalListenUrl?: string;
  lyricsSnippet?: string;
  lyricsSnippetBn?: string;
}
