import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useAdmin } from '../context/AdminContext';
import { Disc, Play, Radio, ArrowRight, Edit3, Search } from 'lucide-react';
import { Release } from '../../shared/types';
import { formatImageUrl } from '../utils/imageUtils';

type DiscographyPageProps = {
  navigate: (path: string) => void;
};

export const DiscographyPage: React.FC<DiscographyPageProps> = ({ navigate }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();
  const [filterType, setFilterType] = useState<'all' | 'album' | 'ep' | 'single'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReleases = content.releases.filter((release) => {
    const matchesType = filterType === 'all' ? true : release.type === filterType;
    const matchesSearch =
      release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (release.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeBadge = (type: Release['type']) => {
    switch (type) {
      case 'album':
        return <span className="bg-accent text-white px-2 py-0.5 text-xs font-heading font-bold">FULL ALBUM</span>;
      case 'ep':
        return <span className="bg-warning text-black px-2 py-0.5 text-xs font-heading font-bold">EP</span>;
      case 'single':
        return <span className="bg-surface-subtle text-text border border-border px-2 py-0.5 text-xs font-heading font-bold">SINGLE</span>;
      default:
        return <span className="bg-muted text-black px-2 py-0.5 text-xs font-heading font-bold">LIVE</span>;
    }
  };

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b-2 border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="tape-badge text-xs mb-2">COMPLETE DISCOGRAPHY</span>
              <h1 className="text-4xl sm:text-6xl font-wordmark text-text tracking-wider mt-1">
                DISKOGRAFI LENGKAP
              </h1>
              <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
                Karya-karya studio, mini album, rekaman live, dan single perlawanan dari DEATHROLL.
              </p>
            </div>

            {isAdmin && !isPreviewMode && (
              <button
                onClick={() => openDrawer('releases')}
                className="inline-flex items-center space-x-2 bg-accent text-white px-4 py-2 font-heading font-bold text-sm tracking-wider shadow-punk self-start"
              >
                <Edit3 className="w-4 h-4" />
                <span>KELOLA DISKOGRAFI</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {(['all', 'album', 'ep', 'single'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider border transition-all ${
                  filterType === type
                    ? 'bg-accent text-white border-accent shadow-punk'
                    : 'bg-surface text-muted border-border hover:text-text'
                }`}
              >
                {type === 'all' ? 'SEMUA RILISAN' : type}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul album, lagu..."
              className="w-full bg-surface border border-border focus:border-accent text-text pl-9 pr-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Releases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReleases.map((release) => (
            <div
              key={release.id}
              className="bg-surface border-2 border-border hover:border-accent transition-all duration-200 p-4 flex flex-col justify-between group shadow-punk"
            >
              <div>
                <div
                  onClick={() => navigate(`/discography/${release.slug}`)}
                  className="relative aspect-square overflow-hidden bg-surface-subtle border border-border cursor-pointer mb-4"
                >
                  <img
                    src={formatImageUrl(release.coverUrl)}
                    alt={release.coverAlt || release.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 z-10">
                    {getTypeBadge(release.type)}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/80 text-text font-heading text-xs font-bold px-2 py-0.5 border border-border">
                    {release.releaseDate.split('-')[0]}
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-accent text-white px-3 py-1.5 font-heading text-sm font-bold tracking-wider shadow-punk flex items-center space-x-1.5">
                      <Disc className="w-4 h-4 animate-spin" />
                      <span>DETAIL RILISAN</span>
                    </span>
                  </div>
                </div>

                <h3
                  onClick={() => navigate(`/discography/${release.slug}`)}
                  className="font-wordmark text-2xl text-text tracking-wide group-hover:text-accent transition-colors cursor-pointer line-clamp-1"
                >
                  {release.title}
                </h3>

                {release.description && (
                  <p className="text-xs text-muted/80 mt-1.5 line-clamp-2 leading-relaxed">
                    {release.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {release.links.spotify && (
                    <a
                      href={release.links.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-surface-subtle hover:bg-[#1DB954] hover:text-black text-muted transition-colors rounded border border-border"
                      title="Spotify"
                    >
                      <Disc className="w-4 h-4" />
                    </a>
                  )}
                  {release.links.appleMusic && (
                    <a
                      href={release.links.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-surface-subtle hover:bg-[#FA2D48] hover:text-white text-muted transition-colors rounded border border-border"
                      title="Apple Music"
                    >
                      <Radio className="w-4 h-4" />
                    </a>
                  )}
                  {release.links.youtube && (
                    <a
                      href={release.links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-surface-subtle hover:bg-[#FF0000] hover:text-white text-muted transition-colors rounded border border-border"
                      title="YouTube"
                    >
                      <Play className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/discography/${release.slug}`)}
                  className="text-xs font-heading font-bold text-accent hover:underline flex items-center space-x-1"
                >
                  <span>TRACKLIST</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
