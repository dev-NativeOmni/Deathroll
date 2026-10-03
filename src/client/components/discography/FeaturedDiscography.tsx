import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { useAdmin } from '../../context/AdminContext';
import { formatImageUrl } from '../../utils/imageUtils';
import { Disc, Play, ExternalLink, Edit3, ArrowRight, Music, Radio } from 'lucide-react';
import { Release } from '../../../shared/types';

type DiscographyProps = {
  navigate: (path: string) => void;
  limit?: number;
};

export const FeaturedDiscography: React.FC<DiscographyProps> = ({ navigate, limit }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();
  const [filterType, setFilterType] = useState<'all' | 'album' | 'ep' | 'single'>('all');

  const filteredReleases = content.releases.filter((r) => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  const displayedReleases = limit ? filteredReleases.slice(0, limit) : filteredReleases;

  const getTypeBadge = (type: Release['type']) => {
    switch (type) {
      case 'album':
        return <span className="bg-accent text-white px-2 py-0.5 text-xs font-heading font-bold">FULL ALBUM</span>;
      case 'ep':
        return <span className="bg-warning text-black px-2 py-0.5 text-xs font-heading font-bold">MINI ALBUM / EP</span>;
      case 'single':
        return <span className="bg-surface-subtle text-text border border-border px-2 py-0.5 text-xs font-heading font-bold">SINGLE</span>;
      default:
        return <span className="bg-muted text-black px-2 py-0.5 text-xs font-heading font-bold">LIVE</span>;
    }
  };

  return (
    <section className="py-20 bg-bg border-b-2 border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-block mb-2">
              <span className="tape-badge text-xs">OFFICIAL DISCOGRAPHY</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-wordmark text-text tracking-wider">
              DISKOGRAFI & RILISAN
            </h2>
            <p className="text-muted text-sm sm:text-base mt-1">
              Distorsi murni dan lirik perlawanan dalam format Vinyl, CD, dan Digital.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && !isPreviewMode && (
              <button
                onClick={() => openDrawer('releases')}
                className="flex items-center space-x-1.5 bg-surface-subtle text-accent border border-accent hover:bg-accent hover:text-white px-3 py-1.5 font-heading text-xs font-bold uppercase transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Kelola Rilisan ({content.releases.length})</span>
              </button>
            )}

            {limit && content.releases.length > limit && (
              <button
                onClick={() => navigate('/discography')}
                className="inline-flex items-center space-x-2 text-accent font-heading font-bold hover:underline tracking-wider"
              >
                <span>LIHAT SEMUA ({content.releases.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['all', 'album', 'ep', 'single'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 text-xs font-heading font-bold uppercase tracking-wider transition-all border ${
                filterType === type
                  ? 'bg-accent text-white border-accent shadow-punk'
                  : 'bg-surface text-muted border-border hover:text-text hover:border-muted'
              }`}
            >
              {type === 'all' ? 'SEMUA RILISAN' : type}
            </button>
          ))}
        </div>

        {/* Releases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedReleases.map((release) => (
            <div
              key={release.id}
              className="bg-surface border-2 border-border hover:border-accent transition-all duration-200 p-4 flex flex-col justify-between group shadow-punk"
            >
              <div>
                {/* 1:1 Album Cover */}
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
                  {/* Overlay Vinyl Texture Badge */}
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

              {/* Streaming Links & Actions */}
              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {release.links.spotify && (
                    <a
                      href={release.links.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-surface-subtle hover:bg-[#1DB954] hover:text-black text-muted transition-colors rounded border border-border"
                      title="Dengarkan di Spotify"
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
                      title="Dengarkan di Apple Music"
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
                      title="Tonton di YouTube"
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
    </section>
  );
};
