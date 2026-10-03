import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { useAdmin } from '../../context/AdminContext';
import { Play, Film, X, ExternalLink, Edit3, Youtube } from 'lucide-react';
import { VideoClip } from '../../../shared/types';
import { formatImageUrl } from '../../utils/imageUtils';

export const VideoGallery: React.FC = () => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();
  const [selectedVideo, setSelectedVideo] = useState<VideoClip | null>(null);

  const videoList = content.videos || [];

  return (
    <section className="py-20 bg-surface border-b-2 border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-block mb-2">
              <span className="tape-badge text-xs">VISUAL NOISE & LIVE FOOTAGE</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-wordmark text-text tracking-wider">
              VIDEO KLIP & AKSI PANGGUNG
            </h2>
            <p className="text-muted text-sm sm:text-base mt-1">
              Dokumentasi panggung berenergi tinggi, video klip resmi, dan rekaman circle pit.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && !isPreviewMode && (
              <button
                onClick={() => openDrawer('videos')}
                className="flex items-center space-x-1.5 bg-surface-subtle text-accent border border-accent hover:bg-accent hover:text-white px-3 py-1.5 font-heading text-xs font-bold uppercase transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Kelola Video ({videoList.length})</span>
              </button>
            )}

            <a
              href="https://youtube.com/@deathrollofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-accent font-heading font-bold hover:underline tracking-wider text-sm"
            >
              <Youtube className="w-4 h-4" />
              <span>CHANNEL YOUTUBE</span>
            </a>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videoList.map((vid) => (
            <div
              key={vid.id}
              className="bg-bg border-2 border-border hover:border-accent transition-all duration-300 flex flex-col justify-between group shadow-punk"
            >
              <div>
                {/* Thumbnail Box */}
                <div
                  onClick={() => setSelectedVideo(vid)}
                  className="relative aspect-video overflow-hidden bg-surface-subtle cursor-pointer border-b border-border"
                >
                  <img
                    src={formatImageUrl(vid.thumbnailUrl)}
                    alt={vid.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    loading="lazy"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-punk group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-text font-mono text-[11px] px-2 py-0.5 border border-border">
                    {vid.duration}
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-heading font-bold text-accent uppercase tracking-widest block mb-1">
                    {vid.category === 'music_video'
                      ? 'OFFICIAL MUSIC VIDEO'
                      : vid.category === 'live_concert'
                      ? 'LIVE STAGE FOOTAGE'
                      : 'MINI DOCUMENTARY'}
                  </span>
                  <h3
                    onClick={() => setSelectedVideo(vid)}
                    className="font-wordmark text-xl text-text tracking-wide group-hover:text-accent transition-colors cursor-pointer line-clamp-2 leading-tight"
                  >
                    {vid.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedVideo(vid)}
                  className="w-full py-2 bg-surface-subtle group-hover:bg-accent group-hover:text-white text-text font-heading text-xs font-bold uppercase tracking-wider border border-border transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>PUTAR VIDEO</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-surface border-2 border-accent w-full max-w-4xl shadow-2xl relative">
            <div className="p-4 bg-bg border-b border-border flex items-center justify-between">
              <h3 className="font-wordmark text-lg text-text truncate pr-4">
                {selectedVideo.title}
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1 text-muted hover:text-text"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId.replace(/.*(watch\?v=|\/embed\/)/, '')}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
