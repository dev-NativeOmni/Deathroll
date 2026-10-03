import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useAdmin } from '../context/AdminContext';
import { ArrowLeft, Disc, Play, Radio, Calendar, Music, Edit3, Copy, Check, Guitar } from 'lucide-react';

type ReleaseDetailProps = {
  slug: string;
  navigate: (path: string) => void;
};

export const ReleaseDetailPage: React.FC<ReleaseDetailProps> = ({ slug, navigate }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();
  const [activeTab, setActiveTab] = useState<'tracklist' | 'chords'>('tracklist');
  const [copiedChords, setCopiedChords] = useState(false);

  const release = content.releases.find((r) => r.slug === slug);

  if (!release) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-3xl font-wordmark text-text">RILISAN TIDAK DITEMUKAN</h2>
        <p className="text-muted mt-2">Album atau single ini mungkin telah dihapus atau URL tidak tepat.</p>
        <button
          onClick={() => navigate('/discography')}
          className="mt-6 px-6 py-2.5 bg-accent text-white font-heading font-bold"
        >
          KEMBALI KE DISKOGRAFI
        </button>
      </div>
    );
  }

  const handleCopyChords = () => {
    if (release.chordsLyrics) {
      navigator.clipboard.writeText(release.chordsLyrics);
      setCopiedChords(true);
      setTimeout(() => setCopiedChords(false), 3000);
    }
  };

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => navigate('/discography')}
          className="inline-flex items-center space-x-2 text-muted hover:text-accent font-heading font-bold text-sm tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE DISKOGRAFI</span>
        </button>

        {/* Album Showcase Box */}
        <div className="bg-surface border-2 border-border p-6 sm:p-10 shadow-punk-lg relative">
          <div className="duct-tape-corner"></div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Col: Album Vinyl Cover */}
            <div className="md:col-span-5 relative group">
              <div className="aspect-square bg-surface-subtle border-4 border-text shadow-punk overflow-hidden">
                <img
                  src={release.coverUrl}
                  alt={release.coverAlt || release.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-3 -left-3">
                <span className="tape-badge-red text-xs uppercase font-bold">
                  {release.type} • {release.releaseDate.split('-')[0]}
                </span>
              </div>
            </div>

            {/* Right Col: Album Info & Streaming */}
            <div className="md:col-span-7 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-5xl font-wordmark text-text tracking-wider">
                    {release.title}
                  </h1>
                  <p className="text-accent font-heading font-bold text-sm mt-1">
                    DEATHROLL • RILIS RESMI {release.releaseDate}
                  </p>
                </div>

                {isAdmin && !isPreviewMode && (
                  <button
                    onClick={() => openDrawer('releases')}
                    className="flex items-center space-x-1.5 bg-surface-subtle border border-accent text-accent px-3 py-1 text-xs font-heading font-bold hover:bg-accent hover:text-white shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Rilisan</span>
                  </button>
                )}
              </div>

              {release.description && (
                <p className="text-text/90 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {release.description}
                </p>
              )}

              {/* Streaming CTAs */}
              <div className="pt-2 space-y-2">
                <span className="block text-xs font-heading font-bold text-muted uppercase tracking-wider">
                  DENGARKAN DI PLATFORM RESMI:
                </span>
                <div className="flex flex-wrap gap-2">
                  {release.links.spotify && (
                    <a
                      href={release.links.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-punk"
                    >
                      <Disc className="w-4 h-4" />
                      <span>SPOTIFY</span>
                    </a>
                  )}
                  {release.links.appleMusic && (
                    <a
                      href={release.links.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#FA2D48] hover:bg-[#fb526a] text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-punk"
                    >
                      <Radio className="w-4 h-4" />
                      <span>APPLE MUSIC</span>
                    </a>
                  )}
                  {release.links.youtube && (
                    <a
                      href={release.links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#FF0000] hover:bg-[#cc0000] text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-punk"
                    >
                      <Play className="w-4 h-4" />
                      <span>YOUTUBE</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Tracklist vs Chords */}
          <div className="mt-12 pt-8 border-t-2 border-border space-y-4">
            <div className="flex items-center space-x-3 border-b border-border pb-3">
              <button
                onClick={() => setActiveTab('tracklist')}
                className={`px-4 py-2 font-heading font-bold text-sm tracking-wider uppercase border transition-all ${
                  activeTab === 'tracklist'
                    ? 'bg-accent text-white border-accent shadow-punk'
                    : 'bg-bg text-muted border-border hover:text-text'
                }`}
              >
                DAFTAR LAGU (TRACKLIST)
              </button>

              <button
                onClick={() => setActiveTab('chords')}
                className={`px-4 py-2 font-heading font-bold text-sm tracking-wider uppercase border transition-all flex items-center space-x-1.5 ${
                  activeTab === 'chords'
                    ? 'bg-accent text-white border-accent shadow-punk'
                    : 'bg-bg text-muted border-border hover:text-text'
                }`}
              >
                <Guitar className="w-4 h-4 text-accent" />
                <span>KUNCI GITAR & LIRIK (CHORDS)</span>
              </button>
            </div>

            {activeTab === 'tracklist' ? (
              <div className="bg-bg border border-border divide-y divide-border">
                {release.tracklist && release.tracklist.length > 0 ? (
                  release.tracklist.map((track, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 flex items-center justify-between hover:bg-surface transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Music className="w-4 h-4 text-accent" />
                        <span className="font-medium text-sm text-text">{track}</span>
                      </div>
                      <span className="text-xs text-muted font-mono">DEATHROLL AUDIO</span>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-muted text-sm">Tracklist belum tersedia.</p>
                )}
              </div>
            ) : (
              <div className="bg-bg border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-heading font-bold text-accent uppercase">
                    <Guitar className="w-4 h-4" />
                    <span>STANDARD GUITAR TUNING (E A D G B E)</span>
                  </div>

                  <button
                    onClick={handleCopyChords}
                    className="px-3 py-1 bg-surface-subtle hover:bg-surface border border-border text-text font-heading text-xs font-bold flex items-center space-x-1"
                  >
                    {copiedChords ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedChords ? 'Tersalin!' : 'Salin Kunci Gitar'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-surface border border-border text-sm font-mono text-text/95 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {release.chordsLyrics || `[Intro]\nEm  C  G  D  (x4)\n\n[Verse 1]\nEm            C\nDi bawah langit abu-abu kota ini\nG             D\nLangkah kakiku menolak tuk berhenti\n\n[Chorus]\nEm          C          G          D\nBakar api perlawanan! Suara dari jalanan!`}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
