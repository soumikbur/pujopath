export type MusicCategory =
  | 'Dhak & Shankha'
  | 'Agomoni & Devotional'
  | 'Puja Ritual & Ambience'
  | 'Pandal-Hopping'
  | 'Bengali Folk'
  | 'Cultural Programmes'
  | 'Bisarjan & Immersion'
  | 'Ambient Soundscapes'
  | 'Mahalaya'
  | 'Dhak'
  | 'Agomoni'
  | 'Devotional'
  | 'Modern'
  | 'Classics';

export type PujaMood =
  | 'Ritual & Devotion'
  | 'Dhak & Traditional'
  | 'Pandal Hopping'
  | 'Bengali Festive'
  | 'Folk & Cultural'
  | 'Bisarjan'
  | 'Ambient Sounds';

export interface MusicTrack {
  id: string;
  title: string;
  titleBn: string;
  artist: string;
  artistBn: string;
  category: MusicCategory;
  durationSeconds: number;
  audioUrl?: string;
  coverUrl: string;
  description: string;
  descriptionBn: string;
  language: 'Bengali' | 'Sanskrit' | 'Instrumental' | 'Hindi';
  playbackMethod: 'direct_audio' | 'authorized_stream' | 'external_listen_link';
  licenseType: string;
  attribution: string;
  sourceUrl: string;
  isLocalAsset: boolean;
  externalListenUrl?: string;
  lyricsSnippet?: string;
  lyricsSnippetBn?: string;
  mood?: PujaMood;
  culturalContext?: string;
  culturalContextBn?: string;
  tags?: string[];
  isCustomPlaylist?: boolean;
}

export interface UserPlaylist {
  id: string;
  name: string;
  nameBn?: string;
  trackIds: string[];
  createdAt: string;
  updatedAt: string;
}

