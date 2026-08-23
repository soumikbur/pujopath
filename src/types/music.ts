export interface MusicTrack {
  id: string;
  title: string;
  titleBn: string;
  artist: string;
  artistBn: string;
  category: 'Mahalaya' | 'Dhak' | 'Agomoni' | 'Devotional' | 'Modern' | 'Classics';
  durationSeconds: number;
  audioUrl: string;
  coverUrl: string;
  description: string;
  descriptionBn: string;
  lyricsSnippet?: string;
  lyricsSnippetBn?: string;
}
