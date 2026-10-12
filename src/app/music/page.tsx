'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  Music2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Search,
  Bookmark,
  BookmarkCheck,
  ListPlus,
  Compass,
  Sparkles,
  Waves,
  HeartHandshake,
  Drum,
  Flame,
  Radio,
  Sun,
  X,
} from 'lucide-react';
import { useAudio } from '@/lib/context/AudioContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import {
  MUSIC_TRACKS_DATA,
  MUSIC_CATEGORIES_META,
  PUJA_MOODS_LIST,
} from '@/data/music';
import { MusicCategory, PujaMood, MusicTrack } from '@/types';
import { toBengaliDigits } from '@/lib/geo';
import { cn, getAssetPath } from '@/lib/utils';

export default function MusicPage() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    playbackError,
    playTrack,
    togglePlay,
    clearError,
    userPlaylistIds,
    togglePlaylistTrack,
    isInPlaylist,
    playQueue,
  } = useAudio();

  const { locale } = useI18n();
  const isBn = locale === 'bn';

  // State
  const [selectedCategory, setSelectedCategory] = useState<MusicCategory | 'All'>('All');
  const [selectedMood, setSelectedMood] = useState<PujaMood | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewTab, setViewTab] = useState<'all' | 'playlist'>('all');

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const str = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return isBn ? toBengaliDigits(str) : str;
  };

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    let list = [...MUSIC_TRACKS_DATA];

    // Filter by User Playlist tab
    if (viewTab === 'playlist') {
      list = list.filter((t) => userPlaylistIds.includes(t.id));
    }

    // Filter by Mood
    if (selectedMood !== 'All') {
      list = list.filter((t) => t.mood === selectedMood);
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((t) => {
        return (
          t.title.toLowerCase().includes(q) ||
          t.titleBn.includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.artistBn.includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q))) ||
          t.description.toLowerCase().includes(q) ||
          t.descriptionBn.includes(q)
        );
      });
    }

    return list;
  }, [viewTab, selectedMood, selectedCategory, searchQuery, userPlaylistIds]);

  // Playlist tracks
  const userPlaylistTracks = useMemo(() => {
    return MUSIC_TRACKS_DATA.filter((t) => userPlaylistIds.includes(t.id));
  }, [userPlaylistIds]);

  const handlePlayUserPlaylist = () => {
    if (userPlaylistTracks.length > 0) {
      playQueue(userPlaylistTracks);
    }
  };

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-36 sm:pb-28">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#b42323] text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Music2 className="w-4 h-4" />
            <span>{isBn ? 'শারদীয়া সুর, ঢাক ও লোকঐতিহ্য' : 'Sharodiya Soundscape & Heritage'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
            {isBn ? 'শারদীয়া সঙ্গীত ও ঐতিহ্যবাহী সুর' : 'Festive Puja Music Traditions'}
          </h1>
          <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] mt-1 max-w-3xl">
            {isBn
              ? 'পূজা আচারের গম্ভীর শঙ্খনাদ, মণ্ডপের ঐতিহ্যবাহী ঢাকের বোল, প্যান্ডেল হপিং-এর উদ্দীপনা থেকে বিজয়ার অশ্রুসজল বিসর্জন।'
              : 'Explore Bengal’s rich Durga Puja music culture — traditional Dhak beats, Agomoni hymns, pandal-hopping anthems, and immersion chants.'}
          </p>
        </div>

        {/* View switcher: All Tracks vs My Playlist */}
        <div className="flex items-center gap-2 bg-[#f4ede4] dark:bg-[#201c18] p-1 rounded-2xl shrink-0 self-start md:self-auto border border-[#eee8e1] dark:border-[#2f2720]">
          <button
            type="button"
            onClick={() => setViewTab('all')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer',
              viewTab === 'all'
                ? 'bg-white dark:bg-[#1a1613] text-[#b42323] shadow-xs'
                : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424]'
            )}
          >
            {isBn ? 'সব গান ও বোল' : 'All Soundscapes'}
          </button>
          <button
            type="button"
            onClick={() => setViewTab('playlist')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer',
              viewTab === 'playlist'
                ? 'bg-white dark:bg-[#1a1613] text-[#b42323] shadow-xs'
                : 'text-[#665a54] dark:text-[#a89e95] hover:text-[#242424]'
            )}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isBn ? 'আমার প্লেলিস্ট' : 'My Playlist'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#b42323]/10 text-[#b42323] font-black">
              {userPlaylistIds.length}
            </span>
          </button>
        </div>
      </div>

      {/* Playback Error Alert if any */}
      {playbackError && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{playbackError}</span>
          </div>
          <button
            onClick={clearError}
            className="font-bold underline text-xs cursor-pointer ml-2"
          >
            {isBn ? 'বাতিল' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Featured Now Playing Showcase */}
      {currentTrack && (
        <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-linear-to-br from-white to-[#fbf8f4] dark:from-[#1a1613] dark:to-[#14100d] border border-[#eee8e1] dark:border-[#2f2720] shadow-card flex flex-col md:flex-row items-center gap-5 sm:gap-6">
          <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-card border border-[#eee8e1] dark:border-[#2f2720] shrink-0 bg-white dark:bg-[#14110e]">
            <Image
              src={getAssetPath('/images/mahalaya-thumb.jpg')}
              alt={currentTrack.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 112px, 160px"
            />
          </div>

          <div className="space-y-2.5 sm:space-y-3 flex-1 text-center md:text-left min-w-0 w-full">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b42323]">
                {isPlaying ? (isBn ? 'বর্তমানে বাজছে' : 'Now Playing') : (isBn ? 'নির্বাচিত গান' : 'Selected Track')}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{currentTrack.licenseType}</span>
              </span>
              {currentTrack.mood && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-200 font-bold">
                  {currentTrack.mood}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#242424] dark:text-[#ede5dc] leading-tight break-words">
              {isBn ? currentTrack.titleBn || currentTrack.title : currentTrack.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95]">
              {isBn ? currentTrack.artistBn || currentTrack.artist : currentTrack.artist} •{' '}
              <span className="font-semibold">{currentTrack.category}</span>
            </p>
            <p className="text-xs text-[#776d65] dark:text-[#998e84] line-clamp-2">
              {isBn ? currentTrack.descriptionBn : currentTrack.description}
            </p>

            <div className="pt-1 flex flex-col xs:flex-row flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 w-full">
              {currentTrack.playbackMethod === 'external_listen_link' ? (
                <a
                  href={currentTrack.externalListenUrl || currentTrack.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#b42323] hover:bg-[#971c1c] text-white font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isBn ? 'অফিসিয়াল স্ট্রিমে শুনুন' : 'Listen on Official Stream'}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 rounded-2xl bg-[#b42323] hover:bg-[#971c1c] text-white font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                  <span>
                    {isLoading
                      ? (isBn ? 'লোড হচ্ছে...' : 'Buffering...')
                      : isPlaying
                      ? (isBn ? 'থামান' : 'Pause Audio')
                      : (isBn ? 'গান শুনুন' : 'Play Soundscape')}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => togglePlaylistTrack(currentTrack.id)}
                className="w-full xs:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-xs font-semibold text-[#665a54] dark:text-[#a89e95] hover:text-[#b42323] transition-colors cursor-pointer"
              >
                {isInPlaylist(currentTrack.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-[#b42323]" />
                    <span className="text-[#b42323] font-bold">{isBn ? 'প্লেলিস্টে সংরক্ষিত' : 'In My Playlist'}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>{isBn ? '+ প্লেলিস্টে যোগ করুন' : '+ Add to Playlist'}</span>
                  </>
                )}
              </button>

              {currentTrack.sourceUrl && (
                <a
                  href={currentTrack.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-xs font-semibold text-[#665a54] dark:text-[#a89e95] hover:text-[#b42323] transition-colors"
                >
                  <span>{isBn ? 'লাইসেন্স ও সোর্স' : 'Source & License'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mood Selector: "Choose your Puja mood" */}
      <div className="space-y-3 p-5 sm:p-6 rounded-3xl bg-[#fcfaf7] dark:bg-[#15120f] border border-[#eee8e1] dark:border-[#2f2720]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#b42323]" />
            <h3 className="text-sm sm:text-base font-black text-[#242424] dark:text-[#ede5dc]">
              {isBn ? 'আপনার পুজোর মুড বেছে নিন' : 'Choose Your Puja Mood'}
            </h3>
          </div>
          {selectedMood !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedMood('All')}
              className="text-xs font-bold text-[#b42323] hover:underline cursor-pointer"
            >
              {isBn ? 'সব মুড দেখুন' : 'Clear Mood Filter'}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedMood('All')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
              selectedMood === 'All'
                ? 'bg-[#b42323] text-white border-[#b42323] shadow-xs'
                : 'bg-white dark:bg-[#1a1613] text-[#665a54] dark:text-[#a89e95] border-[#eee8e1] dark:border-[#2f2720] hover:border-[#b42323]'
            )}
          >
            {isBn ? 'সকল মুড' : 'All Moods'}
          </button>
          {PUJA_MOODS_LIST.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMood(m.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                selectedMood === m.id
                  ? 'bg-[#b42323] text-white border-[#b42323] shadow-xs'
                  : 'bg-white dark:bg-[#1a1613] text-[#665a54] dark:text-[#a89e95] border-[#eee8e1] dark:border-[#2f2720] hover:border-[#b42323]'
              )}
            >
              {isBn ? m.labelBn : m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#776d65]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'গান, শিল্পী বা বোল খুঁজুন...' : 'Search tracks, artists, rhythms...'}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-[#eee8e1] dark:border-[#2f2720] bg-white dark:bg-[#1a1613] text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] focus:outline-hidden focus:border-[#b42323]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#776d65] hover:text-[#242424] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* User Playlist Action */}
          {viewTab === 'playlist' && userPlaylistTracks.length > 0 && (
            <button
              type="button"
              onClick={handlePlayUserPlaylist}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b42323] hover:bg-[#971c1c] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isBn ? 'পুরো প্লেলিস্ট চালান' : 'Play Full Playlist'}</span>
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer shrink-0',
              selectedCategory === 'All'
                ? 'bg-[#242424] dark:bg-[#ede5dc] text-white dark:text-[#1a1613] border-[#242424] dark:border-[#ede5dc]'
                : 'bg-white dark:bg-[#1a1613] text-[#665a54] dark:text-[#a89e95] border-[#eee8e1] dark:border-[#2f2720] hover:border-[#b42323]'
            )}
          >
            {isBn ? 'সকল ক্যাটেগরি' : 'All Categories'}
          </button>
          {MUSIC_CATEGORIES_META.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer shrink-0',
                selectedCategory === cat.id
                  ? 'bg-[#242424] dark:bg-[#ede5dc] text-white dark:text-[#1a1613] border-[#242424] dark:border-[#ede5dc]'
                  : 'bg-white dark:bg-[#1a1613] text-[#665a54] dark:text-[#a89e95] border-[#eee8e1] dark:border-[#2f2720] hover:border-[#b42323]'
              )}
            >
              {isBn ? cat.nameBn : cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-[#242424] dark:text-[#ede5dc]">
            {viewTab === 'playlist'
              ? (isBn ? `আমার সংরক্ষিত প্লেলিস্ট (${filteredTracks.length} টি)` : `My Curated Playlist (${filteredTracks.length})`)
              : (isBn ? `শারদীয়া সুরের সম্ভার (${filteredTracks.length} টি)` : `Curated Audio Library (${filteredTracks.length})`)}
          </h3>
          <span className="text-xs text-[#776d65] dark:text-[#a89e95]">
            {isBn ? 'যাচাইকৃত লাইসেন্স ও সোর্স' : 'Verified Licences & Authorized Streams'}
          </span>
        </div>

        {filteredTracks.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-[#eee8e1] dark:border-[#2f2720] text-center space-y-3 bg-[#fcfaf7] dark:bg-[#15120f]">
            <Music2 className="w-10 h-10 text-[#776d65] mx-auto opacity-30" />
            <h4 className="text-sm font-bold text-[#242424] dark:text-[#ede5dc]">
              {viewTab === 'playlist'
                ? (isBn ? 'আপনার প্লেলিস্টে কোনো গান নেই।' : 'No tracks saved in your playlist yet.')
                : (isBn ? 'কোনো গান বা বোল পাওয়া যায়নি।' : 'No matching tracks found.')}
            </h4>
            <p className="text-xs text-[#776d65] dark:text-[#a89e95] max-w-md mx-auto">
              {viewTab === 'playlist'
                ? (isBn ? 'যেকোনো গানের পাশের বুকমার্ক আইকনটিতে ক্লিক করে আপনার নিজস্ব শারদীয়া প্লেলিস্ট তৈরি করুন।' : 'Click the bookmark icon on any track to assemble your custom Puja hopping playlist.')
                : (isBn ? 'অন্য ক্যাটেগরি বা মুড নির্বাচন করে অনুসন্ধান করুন।' : 'Try resetting your mood filter or search query.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTracks.map((track) => {
              const isSelected = currentTrack?.id === track.id;
              const inPlaylist = isInPlaylist(track.id);
              const tTitle = isBn ? track.titleBn || track.title : track.title;
              const tArtist = isBn ? track.artistBn || track.artist : track.artist;

              return (
                <div
                  key={track.id}
                  onClick={() => (isSelected ? togglePlay() : playTrack(track))}
                  className={cn(
                    'p-4 sm:p-5 rounded-2xl border flex flex-col justify-between gap-3 cursor-pointer transition-all duration-150 shadow-sm relative group',
                    isSelected
                      ? 'bg-[#fdeeee] dark:bg-[#341b18] border-[#f6ceca] dark:border-[#4a2420] text-[#d52f2f]'
                      : 'bg-white dark:bg-[#1a1613] border-[#eee8e1] dark:border-[#2f2720] hover:bg-[#fcfaf7] dark:hover:bg-[#221c17] text-[#4a423d] dark:text-[#c4b9ae]'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={cn(
                          'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm mt-0.5',
                          isSelected
                            ? 'bg-[#b42323] text-white border-[#b42323]'
                            : 'bg-[#fcfaf7] dark:bg-[#201c18] text-[#b42323] border-[#eee8e1] dark:border-[#2f2720]'
                        )}
                      >
                        {isSelected && isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isSelected && isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : track.playbackMethod === 'external_listen_link' ? (
                          <ExternalLink className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold truncate text-[#242424] dark:text-[#ede5dc]">
                            {tTitle}
                          </h4>
                        </div>
                        <p className="text-xs text-[#776d65] dark:text-[#a89e95] truncate mt-0.5">
                          {tArtist} • <span className="font-semibold text-[#b42323]">{track.category}</span>
                        </p>
                        <p className="text-[11px] text-[#8d8278] dark:text-[#7d736a] line-clamp-2 mt-1">
                          {isBn ? track.descriptionBn : track.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs font-sans text-[#b42323] font-bold">
                        {formatSeconds(track.durationSeconds)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlaylistTrack(track.id);
                        }}
                        aria-label={inPlaylist ? 'Remove from playlist' : 'Add to playlist'}
                        className="p-1.5 rounded-lg text-[#776d65] hover:text-[#b42323] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        {inPlaylist ? (
                          <BookmarkCheck className="w-4 h-4 text-[#b42323] fill-current" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Cultural Context / License Details Footer */}
                  <div className="pt-2.5 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#776d65] dark:text-[#a89e95]">
                    <span className="truncate max-w-[220px] sm:max-w-xs">{track.licenseType}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      {track.playbackMethod === 'external_listen_link' && (
                        <span className="text-[#b42323] font-bold flex items-center gap-1">
                          <span>{isBn ? 'অফিসিয়াল স্ট্রিম' : 'Official Stream'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                      <a
                        href={track.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#b42323] underline font-medium"
                      >
                        {isBn ? 'সোর্স' : 'Source'}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
