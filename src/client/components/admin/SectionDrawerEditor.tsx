import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { MarkdownEditor } from './MarkdownEditor';
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Check,
  Calendar,
  Disc,
  Newspaper,
  BookOpen,
  Link2,
  Code,
  Eye,
  Upload,
  Music,
} from 'lucide-react';
import { HeroSlide, Show, Release, Post, ExternalLink } from '../../../shared/types';
import { formatAudioUrl } from '../../utils/imageUtils';

export const SectionDrawerEditor: React.FC = () => {
  const { content, activeDrawer, closeDrawer, updateDraft } = useSite();
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  if (!activeDrawer) return null;

  const getDrawerTitle = () => {
    switch (activeDrawer) {
      case 'hero':
        return 'EDITOR HERO SLIDER';
      case 'shows':
        return 'EDITOR JADWAL TUR & GIGS';
      case 'releases':
        return 'EDITOR DISKOGRAFI & RILISAN';
      case 'merch':
        return 'EDITOR MERCHANDISE RESMI';
      case 'videos':
        return 'EDITOR VIDEO KLIP & FOOTAGE';
      case 'posts':
        return 'EDITOR BERITA & ARTIKEL';
      case 'biography':
        return 'EDITOR BIOGRAFI & PERSONIL';
      case 'links':
        return 'EDITOR LINK SOSIAL & STREAMING';
      case 'audio':
        return 'EDITOR PREVIEW TRACK & AUDIO PLAYER';
      case 'site':
      case 'contact':
        return 'PENGATURAN BRAND & KONTAK';
      case 'json':
        return 'RAW JSON INSPECTOR';
      default:
        return 'EDITOR KONTEN';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full justify-end">
        <div className="w-full sm:max-w-2xl bg-surface border-l-0 sm:border-l-4 border-accent text-text flex flex-col shadow-2xl h-full">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 bg-bg border-b-2 border-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-accent rounded-none"></span>
              <h2 className="text-xl font-wordmark text-text tracking-wider">
                {getDrawerTitle()}
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-muted hover:text-text hover:bg-surface-subtle transition-colors"
              aria-label="Tutup Editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* HERO SLIDES EDITOR */}
            {activeDrawer === 'hero' && (
              <HeroSlidesEditor
                slides={content.heroSlides}
                onChange={(newSlides) =>
                  updateDraft((prev) => ({ ...prev, heroSlides: newSlides }))
                }
              />
            )}

            {/* SHOWS EDITOR */}
            {activeDrawer === 'shows' && (
              <ShowsEditor
                shows={content.shows}
                onChange={(newShows) =>
                  updateDraft((prev) => ({ ...prev, shows: newShows }))
                }
              />
            )}

            {/* RELEASES EDITOR */}
            {activeDrawer === 'releases' && (
              <ReleasesEditor
                releases={content.releases}
                onChange={(newReleases) =>
                  updateDraft((prev) => ({ ...prev, releases: newReleases }))
                }
              />
            )}

            {/* MERCHANDISE EDITOR */}
            {activeDrawer === 'merch' && (
              <MerchandiseEditor
                merchandise={content.merchandise || []}
                onChange={(newMerch) =>
                  updateDraft((prev) => ({ ...prev, merchandise: newMerch }))
                }
              />
            )}

            {/* VIDEOS EDITOR */}
            {activeDrawer === 'videos' && (
              <VideosEditor
                videos={content.videos || []}
                onChange={(newVideos) =>
                  updateDraft((prev) => ({ ...prev, videos: newVideos }))
                }
              />
            )}

            {/* POSTS EDITOR */}
            {activeDrawer === 'posts' && (
              <PostsEditor
                posts={content.posts}
                onChange={(newPosts) =>
                  updateDraft((prev) => ({ ...prev, posts: newPosts }))
                }
              />
            )}

            {/* BIOGRAPHY EDITOR */}
            {activeDrawer === 'biography' && (
              <BiographyEditor
                biography={content.biography}
                onChange={(newBio) =>
                  updateDraft((prev) => ({ ...prev, biography: newBio }))
                }
              />
            )}

            {/* LINKS EDITOR */}
            {activeDrawer === 'links' && (
              <LinksEditor
                links={content.links}
                onChange={(newLinks) =>
                  updateDraft((prev) => ({ ...prev, links: newLinks }))
                }
              />
            )}

            {/* AUDIO PLAYER EDITOR */}
            {activeDrawer === 'audio' && (
              <AudioPlayerEditor
                audioPlayer={content.audioPlayer || { enabled: true, tracks: [] }}
                onChange={(newAudio) =>
                  updateDraft((prev) => ({ ...prev, audioPlayer: newAudio }))
                }
              />
            )}

            {/* SITE & CONTACT SETTINGS */}
            {(activeDrawer === 'site' || activeDrawer === 'contact') && (
              <SiteSettingsEditor
                site={content.site}
                contact={content.contact}
                onSiteChange={(newSite) =>
                  updateDraft((prev) => ({ ...prev, site: newSite }))
                }
                onContactChange={(newContact) =>
                  updateDraft((prev) => ({ ...prev, contact: newContact }))
                }
              />
            )}

            {/* RAW JSON INSPECTOR */}
            {activeDrawer === 'json' && (
              <div className="space-y-4">
                <p className="text-xs text-muted">
                  Dokumen JSON yang aktif dalam state draft saat ini.
                </p>
                <pre className="bg-bg p-4 text-xs font-mono text-emerald-400 overflow-x-auto border border-border max-h-[600px]">
                  {JSON.stringify(content, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Drawer Footer with close button */}
          <div className="p-4 bg-bg border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted">
              Perubahan tersimpan di draft lokal. Tekan 'Simpan Perubahan' pada toolbar atas untuk menyimpan permanen ke server.
            </span>
            <button
              onClick={closeDrawer}
              className="px-4 py-2 bg-accent text-white font-heading font-bold text-sm tracking-wider hover:bg-accent-hover uppercase shadow-punk"
            >
              SELESAI EDIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   1. HERO SLIDES EDITOR COMPONENT
   ========================================================= */
const HeroSlidesEditor: React.FC<{
  slides: HeroSlide[];
  onChange: (slides: HeroSlide[]) => void;
}> = ({ slides, onChange }) => {
  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: `hero-${Date.now()}`,
      title: 'JUDUL SLIDE BARU',
      subtitle: 'SUBTITLE / TAGLINE SLIDE',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920&auto=format&fit=crop',
      imageAlt: 'Foto Konser DEATHROLL',
      ctaLabel: 'LIHAT DETAIL',
      ctaHref: '/tour',
      position: slides.length,
      published: true,
    };
    onChange([...slides, newSlide]);
  };

  const updateSlide = (index: number, updated: Partial<HeroSlide>) => {
    const next = [...slides];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const deleteSlide = (index: number) => {
    if (window.confirm('Hapus slide hero ini?')) {
      onChange(slides.filter((_, i) => i !== index));
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const next = [...slides];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    onChange(next.map((s, i) => ({ ...s, position: i })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted uppercase font-heading font-bold">
          Daftar Slide ({slides.length})
        </span>
        <button
          onClick={addSlide}
          className="flex items-center space-x-1 px-3 py-1.5 bg-accent text-white text-xs font-heading font-bold hover:bg-accent-hover"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Slide</span>
        </button>
      </div>

      {slides.map((slide, idx) => (
        <div key={slide.id} className="p-4 bg-bg border-2 border-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <span className="bg-accent text-white px-2 py-0.5 text-xs font-bold font-heading">
                #{idx + 1}
              </span>
              <span className="font-bold text-sm truncate max-w-[200px]">{slide.title}</span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => moveSlide(idx, 'up')}
                disabled={idx === 0}
                className="p-1 text-muted hover:text-text disabled:opacity-30"
                title="Pindah ke Atas"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveSlide(idx, 'down')}
                disabled={idx === slides.length - 1}
                className="p-1 text-muted hover:text-text disabled:opacity-30"
                title="Pindah ke Bawah"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteSlide(idx)}
                className="p-1 text-red-400 hover:text-red-300"
                title="Hapus Slide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Judul Hero Slide
              </label>
              <input
                type="text"
                value={slide.title}
                onChange={(e) => updateSlide(idx, { title: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={slide.subtitle || ''}
                onChange={(e) => updateSlide(idx, { subtitle: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                URL Gambar Background (HTTPS / Google Drive Link)
              </label>
              <input
                type="text"
                value={slide.imageUrl}
                onChange={(e) => updateSlide(idx, { imageUrl: e.target.value })}
                placeholder="https://drive.google.com/file/d/... atau URL gambar"
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Label Tombol CTA
              </label>
              <input
                type="text"
                value={slide.ctaLabel || ''}
                onChange={(e) => updateSlide(idx, { ctaLabel: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Link CTA Target (/tour, /discography, dll)
              </label>
              <input
                type="text"
                value={slide.ctaHref || ''}
                onChange={(e) => updateSlide(idx, { ctaHref: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id={`pub-${slide.id}`}
                checked={slide.published}
                onChange={(e) => updateSlide(idx, { published: e.target.checked })}
                className="w-4 h-4 accent-red-600"
              />
              <label htmlFor={`pub-${slide.id}`} className="text-xs text-text font-bold">
                Tampilkan Slide (Published)
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   2. SHOWS / TOUR EDITOR COMPONENT
   ========================================================= */
const ShowsEditor: React.FC<{
  shows: Show[];
  onChange: (shows: Show[]) => void;
}> = ({ shows, onChange }) => {
  const addShow = () => {
    const slug = `show-${Date.now()}`;
    const newShow: Show = {
      id: `show-${Date.now()}`,
      slug,
      date: new Date().toISOString(),
      eventName: 'NAMA GIG / KONSER',
      venue: 'Nama Venue / Gedung',
      city: 'Jakarta',
      description: 'Deskripsi acara dan detail line-up...',
      posterUrl: '',
      ticketUrl: '',
      status: 'scheduled',
    };
    onChange([...shows, newShow]);
  };

  const updateShow = (index: number, updated: Partial<Show>) => {
    const next = [...shows];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const deleteShow = (index: number) => {
    if (window.confirm(`Hapus acara "${shows[index].eventName}"?`)) {
      onChange(shows.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted uppercase font-heading font-bold">
          Daftar Acara ({shows.length})
        </span>
        <button
          onClick={addShow}
          className="flex items-center space-x-1 px-3 py-1.5 bg-accent text-white text-xs font-heading font-bold hover:bg-accent-hover"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Acara Tur</span>
        </button>
      </div>

      {shows.map((show, idx) => (
        <div key={show.id} className="p-4 bg-bg border-2 border-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <span className="bg-accent text-white px-2 py-0.5 text-xs font-bold font-heading">
                #{idx + 1}
              </span>
              <span className="font-bold text-sm truncate max-w-[200px]">{show.eventName}</span>
            </div>

            <button
              onClick={() => deleteShow(idx)}
              className="p-1 text-red-400 hover:text-red-300"
              title="Hapus Acara"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Nama Acara / Festival
              </label>
              <input
                type="text"
                value={show.eventName}
                onChange={(e) => updateShow(idx, { eventName: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Kota
              </label>
              <input
                type="text"
                value={show.city}
                onChange={(e) => updateShow(idx, { city: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Venue / Lokasi
              </label>
              <input
                type="text"
                value={show.venue}
                onChange={(e) => updateShow(idx, { venue: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Waktu Acara (ISO / Tanggal)
              </label>
              <input
                type="text"
                value={show.date}
                onChange={(e) => updateShow(idx, { date: e.target.value })}
                placeholder="2026-11-20T19:00:00+07:00"
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Status Acara
              </label>
              <select
                value={show.status}
                onChange={(e) => updateShow(idx, { status: e.target.value as any })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              >
                <option value="scheduled">Terjadwal (Scheduled)</option>
                <option value="sold_out">Tiket Habis (Sold Out)</option>
                <option value="cancelled">Dibatalkan (Cancelled)</option>
                <option value="past">Sudah Selesai (Past)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Link Pembelian Tiket (Opsional)
              </label>
              <input
                type="text"
                value={show.ticketUrl || ''}
                onChange={(e) => updateShow(idx, { ticketUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Deskripsi Acara
              </label>
              <textarea
                value={show.description || ''}
                onChange={(e) => updateShow(idx, { description: e.target.value })}
                rows={2}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   3. RELEASES / DISCOGRAPHY EDITOR COMPONENT
   ========================================================= */
const ReleasesEditor: React.FC<{
  releases: Release[];
  onChange: (releases: Release[]) => void;
}> = ({ releases, onChange }) => {
  const addRelease = () => {
    const slug = `release-${Date.now()}`;
    const newRelease: Release = {
      id: `rel-${Date.now()}`,
      slug,
      title: 'JUDUL ALBUM / SINGLE',
      releaseDate: '2026-01-01',
      type: 'album',
      coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop',
      coverAlt: 'Cover Album',
      description: 'Deskripsi album...',
      tracklist: ['1. Track Pertama (03:00)', '2. Track Kedua (03:30)'],
      links: {
        spotify: '',
        appleMusic: '',
        youtube: '',
      },
      featured: true,
    };
    onChange([...releases, newRelease]);
  };

  const updateRelease = (index: number, updated: Partial<Release>) => {
    const next = [...releases];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const deleteRelease = (index: number) => {
    if (window.confirm(`Hapus rilisan "${releases[index].title}"?`)) {
      onChange(releases.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted uppercase font-heading font-bold">
          Daftar Rilisan ({releases.length})
        </span>
        <button
          onClick={addRelease}
          className="flex items-center space-x-1 px-3 py-1.5 bg-accent text-white text-xs font-heading font-bold hover:bg-accent-hover"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Rilisan</span>
        </button>
      </div>

      {releases.map((rel, idx) => (
        <div key={rel.id} className="p-4 bg-bg border-2 border-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <span className="bg-accent text-white px-2 py-0.5 text-xs font-bold font-heading">
                #{idx + 1}
              </span>
              <span className="font-bold text-sm truncate max-w-[200px]">{rel.title}</span>
            </div>

            <button
              onClick={() => deleteRelease(idx)}
              className="p-1 text-red-400 hover:text-red-300"
              title="Hapus Rilisan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Judul Rilisan
              </label>
              <input
                type="text"
                value={rel.title}
                onChange={(e) => updateRelease(idx, { title: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Tipe Rilisan
              </label>
              <select
                value={rel.type}
                onChange={(e) => updateRelease(idx, { type: e.target.value as any })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              >
                <option value="album">Full Album</option>
                <option value="ep">EP / Mini Album</option>
                <option value="single">Single</option>
                <option value="live">Live Album</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Tanggal Rilis (YYYY-MM-DD)
              </label>
              <input
                type="text"
                value={rel.releaseDate}
                onChange={(e) => updateRelease(idx, { releaseDate: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                URL Cover Gambar (HTTPS / Google Drive Link)
              </label>
              <input
                type="text"
                value={rel.coverUrl}
                onChange={(e) => updateRelease(idx, { coverUrl: e.target.value })}
                placeholder="https://drive.google.com/file/d/... atau URL gambar"
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Deskripsi
              </label>
              <textarea
                value={rel.description || ''}
                onChange={(e) => updateRelease(idx, { description: e.target.value })}
                rows={2}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Tracklist (Pisahkan dengan baris baru)
              </label>
              <textarea
                value={(rel.tracklist || []).join('\n')}
                onChange={(e) =>
                  updateRelease(idx, {
                    tracklist: e.target.value
                      .split('\n')
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                rows={4}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Spotify Link
              </label>
              <input
                type="text"
                value={rel.links.spotify || ''}
                onChange={(e) =>
                  updateRelease(idx, {
                    links: { ...rel.links, spotify: e.target.value },
                  })
                }
                placeholder="https://open.spotify.com/..."
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                YouTube Link
              </label>
              <input
                type="text"
                value={rel.links.youtube || ''}
                onChange={(e) =>
                  updateRelease(idx, {
                    links: { ...rel.links, youtube: e.target.value },
                  })
                }
                placeholder="https://youtube.com/..."
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   4. POSTS / NEWS EDITOR COMPONENT
   ========================================================= */
const PostsEditor: React.FC<{
  posts: Post[];
  onChange: (posts: Post[]) => void;
}> = ({ posts, onChange }) => {
  const addPost = () => {
    const slug = `berita-${Date.now()}`;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      slug,
      title: 'JUDUL BERITA TERBARU',
      excerpt: 'Ringkasan singkat berita...',
      bodyMarkdown: '## HEADER BERITA\n\nTulis isi berita punk zine lengkap di sini...',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
      imageAlt: 'Foto Berita',
      publishedAt: new Date().toISOString(),
      status: 'published',
    };
    onChange([...posts, newPost]);
  };

  const updatePost = (index: number, updated: Partial<Post>) => {
    const next = [...posts];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const deletePost = (index: number) => {
    if (window.confirm(`Hapus berita "${posts[index].title}"?`)) {
      onChange(posts.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted uppercase font-heading font-bold">
          Daftar Berita ({posts.length})
        </span>
        <button
          onClick={addPost}
          className="flex items-center space-x-1 px-3 py-1.5 bg-accent text-white text-xs font-heading font-bold hover:bg-accent-hover"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Berita Baru</span>
        </button>
      </div>

      {posts.map((post, idx) => (
        <div key={post.id} className="p-4 bg-bg border-2 border-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <span className="bg-accent text-white px-2 py-0.5 text-xs font-bold font-heading">
                #{idx + 1}
              </span>
              <span className="font-bold text-sm truncate max-w-[200px]">{post.title}</span>
            </div>

            <button
              onClick={() => deletePost(idx)}
              className="p-1 text-red-400 hover:text-red-300"
              title="Hapus Berita"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Judul Berita
              </label>
              <input
                type="text"
                value={post.title}
                onChange={(e) => updatePost(idx, { title: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                  Slug URL (huruf kecil & strip)
                </label>
                <input
                  type="text"
                  value={post.slug}
                  onChange={(e) => updatePost(idx, { slug: e.target.value })}
                  className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                  Status Publikasi
                </label>
                <select
                  value={post.status}
                  onChange={(e) => updatePost(idx, { status: e.target.value as any })}
                  className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
                >
                  <option value="published">Diterbitkan (Published)</option>
                  <option value="draft">Draft (Disembunyikan)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                URL Gambar Utama (HTTPS / Google Drive Link)
              </label>
              <input
                type="text"
                value={post.imageUrl || ''}
                onChange={(e) => updatePost(idx, { imageUrl: e.target.value })}
                placeholder="https://drive.google.com/file/d/... atau URL gambar"
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Ringkasan (Excerpt)
              </label>
              <textarea
                value={post.excerpt}
                onChange={(e) => updatePost(idx, { excerpt: e.target.value })}
                rows={2}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <MarkdownEditor
                label="Isi Artikel Berita (Markdown)"
                value={post.bodyMarkdown}
                onChange={(val) => updatePost(idx, { bodyMarkdown: val })}
                rows={6}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   5. BIOGRAPHY & MEMBERS EDITOR COMPONENT
   ========================================================= */
const BiographyEditor: React.FC<{
  biography: any;
  onChange: (bio: any) => void;
}> = ({ biography, onChange }) => {
  const updateMember = (index: number, updated: any) => {
    const members = [...(biography.members || [])];
    members[index] = { ...members[index], ...updated };
    onChange({ ...biography, members });
  };

  const addMember = () => {
    const members = [
      ...(biography.members || []),
      { name: 'Nama Personil', role: 'Instrumen', photoUrl: '' },
    ];
    onChange({ ...biography, members });
  };

  const deleteMember = (index: number) => {
    const members = (biography.members || []).filter((_: any, i: number) => i !== index);
    onChange({ ...biography, members });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
            Judul Biografi
          </label>
          <input
            type="text"
            value={biography.heading}
            onChange={(e) => onChange({ ...biography, heading: e.target.value })}
            className="w-full bg-bg border border-border p-2.5 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
            URL Foto Band (HTTPS / Google Drive Link)
          </label>
          <input
            type="text"
            value={biography.imageUrl || ''}
            onChange={(e) => onChange({ ...biography, imageUrl: e.target.value })}
            placeholder="https://drive.google.com/file/d/... atau URL gambar"
            className="w-full bg-bg border border-border p-2.5 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <MarkdownEditor
            label="Kisah & Sejarah Band (Markdown)"
            value={biography.bodyMarkdown}
            onChange={(val) => onChange({ ...biography, bodyMarkdown: val })}
            rows={8}
          />
        </div>
      </div>

      {/* Members Section */}
      <div className="pt-4 border-t border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-accent uppercase tracking-wider">
            Daftar Anggota / Personil Band
          </h3>
          <button
            onClick={addMember}
            className="flex items-center space-x-1 px-2.5 py-1 bg-accent text-white text-xs font-heading font-bold hover:bg-accent-hover"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Personil</span>
          </button>
        </div>

        {(biography.members || []).map((m: any, idx: number) => (
          <div key={idx} className="p-3 bg-bg border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-accent">Personil #{idx + 1}</span>
              <button
                onClick={() => deleteMember(idx)}
                className="p-1 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={m.name}
                onChange={(e) => updateMember(idx, { name: e.target.value })}
                placeholder="Nama Musisi"
                className="bg-surface border border-border p-1.5 text-xs text-text"
              />
              <input
                type="text"
                value={m.role}
                onChange={(e) => updateMember(idx, { role: e.target.value })}
                placeholder="Posisi / Instrumen"
                className="bg-surface border border-border p-1.5 text-xs text-text"
              />
            </div>
            <div>
              <input
                type="text"
                value={m.photoUrl || ''}
                onChange={(e) => updateMember(idx, { photoUrl: e.target.value })}
                placeholder="URL Foto Avatar (HTTPS / Google Drive)"
                className="w-full bg-surface border border-border p-1.5 text-xs text-text"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   6. EXTERNAL LINKS EDITOR COMPONENT
   ========================================================= */
const LinksEditor: React.FC<{
  links: ExternalLink[];
  onChange: (links: ExternalLink[]) => void;
}> = ({ links, onChange }) => {
  const addLink = () => {
    const newLink: ExternalLink = {
      id: `link-${Date.now()}`,
      label: 'Tautan Baru',
      url: 'https://...',
      kind: 'instagram',
      position: links.length,
    };
    onChange([...links, newLink]);
  };

  const updateLink = (index: number, updated: Partial<ExternalLink>) => {
    const next = [...links];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const deleteLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted uppercase font-heading font-bold">
          Tautan Eksternal ({links.length})
        </span>
        <button
          onClick={addLink}
          className="flex items-center space-x-1 px-3 py-1.5 bg-accent text-white text-xs font-heading font-bold hover:bg-accent-hover"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Link</span>
        </button>
      </div>

      {links.map((link, idx) => (
        <div key={link.id} className="p-3 bg-bg border border-border flex items-center gap-3">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={link.label}
              onChange={(e) => updateLink(idx, { label: e.target.value })}
              placeholder="Label"
              className="bg-surface border border-border p-1.5 text-xs text-text"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateLink(idx, { url: e.target.value })}
              placeholder="https://..."
              className="bg-surface border border-border p-1.5 text-xs text-text"
            />
            <select
              value={link.kind}
              onChange={(e) => updateLink(idx, { kind: e.target.value as any })}
              className="bg-surface border border-border p-1.5 text-xs text-text"
            >
              <option value="instagram">Instagram</option>
              <option value="spotify">Spotify</option>
              <option value="youtube">YouTube</option>
              <option value="apple_music">Apple Music</option>
              <option value="facebook">Facebook</option>
              <option value="merch">Merchandise</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
          <button
            onClick={() => deleteLink(idx)}
            className="p-1.5 text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   7. SITE & CONTACT SETTINGS COMPONENT
   ========================================================= */
const SiteSettingsEditor: React.FC<{
  site: any;
  contact: any;
  onSiteChange: (site: any) => void;
  onContactChange: (contact: any) => void;
}> = ({ site, contact, onSiteChange, onContactChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-heading font-bold text-accent uppercase tracking-wider">
          Pengaturan Brand Band
        </h3>

        <div>
          <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
            Nama Band (Wordmark)
          </label>
          <input
            type="text"
            value={site.bandName}
            onChange={(e) => onSiteChange({ ...site, bandName: e.target.value })}
            className="w-full bg-bg border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
            Tagline Utama
          </label>
          <input
            type="text"
            value={site.tagline}
            onChange={(e) => onSiteChange({ ...site, tagline: e.target.value })}
            className="w-full bg-bg border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
            Copyright Footer Text
          </label>
          <input
            type="text"
            value={site.copyrightText}
            onChange={(e) => onSiteChange({ ...site, copyrightText: e.target.value })}
            className="w-full bg-bg border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        <h3 className="text-sm font-heading font-bold text-accent uppercase tracking-wider">
          Kontak Manajemen & Booking
        </h3>

        <div>
          <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
            Email Booking
          </label>
          <input
            type="email"
            value={contact.email || ''}
            onChange={(e) => onContactChange({ ...contact, email: e.target.value })}
            className="w-full bg-bg border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
            Nomor WhatsApp Booking
          </label>
          <input
            type="text"
            value={contact.whatsapp || ''}
            onChange={(e) => onContactChange({ ...contact, whatsapp: e.target.value })}
            placeholder="+62812..."
            className="w-full bg-bg border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
            Alamat Markas / Basecamp
          </label>
          <input
            type="text"
            value={contact.address || ''}
            onChange={(e) => onContactChange({ ...contact, address: e.target.value })}
            className="w-full bg-bg border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   8. MERCHANDISE EDITOR COMPONENT
   ========================================================= */
const MerchandiseEditor: React.FC<{
  merchandise: any[];
  onChange: (merch: any[]) => void;
}> = ({ merchandise, onChange }) => {
  const addMerch = () => {
    const newItem = {
      id: `merch-${Date.now()}`,
      name: 'NAMA PRODUK MERCHANDISE',
      category: 'tshirt',
      price: 185000,
      formattedPrice: 'Rp 185.000',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      badge: 'LIMITED DROP',
      orderUrl: '',
      inStock: true,
      position: merchandise.length,
    };
    onChange([...merchandise, newItem]);
  };

  const updateItem = (index: number, updated: any) => {
    const next = [...merchandise];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const deleteItem = (index: number) => {
    if (window.confirm(`Hapus produk "${merchandise[index].name}"?`)) {
      onChange(merchandise.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted uppercase font-heading font-bold">
          Katalog Merchandise ({merchandise.length})
        </span>
        <button
          onClick={addMerch}
          className="flex items-center space-x-1 px-3 py-1.5 bg-accent text-white text-xs font-heading font-bold hover:bg-accent-hover"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Produk</span>
        </button>
      </div>

      {merchandise.map((item, idx) => (
        <div key={item.id} className="p-4 bg-bg border-2 border-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <span className="bg-accent text-white px-2 py-0.5 text-xs font-bold font-heading">
                #{idx + 1}
              </span>
              <span className="font-bold text-sm truncate max-w-[200px]">{item.name}</span>
            </div>

            <button
              onClick={() => deleteItem(idx)}
              className="p-1 text-red-400 hover:text-red-300"
              title="Hapus Produk"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(idx, { name: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Kategori
              </label>
              <select
                value={item.category}
                onChange={(e) => updateItem(idx, { category: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              >
                <option value="tshirt">Kaos / T-Shirt</option>
                <option value="vinyl">Vinyl Piringan Hitam</option>
                <option value="cassette">Kaset Pita</option>
                <option value="hoodie">Hoodie / Jaket</option>
                <option value="accessories">Topi & Aksesoris</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Harga Format Teks (cth: Rp 185.000)
              </label>
              <input
                type="text"
                value={item.formattedPrice}
                onChange={(e) => updateItem(idx, { formattedPrice: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Badge / Stempel (cth: LIMITED DROP)
              </label>
              <input
                type="text"
                value={item.badge || ''}
                onChange={(e) => updateItem(idx, { badge: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                URL Gambar Produk (HTTPS / Google Drive Link)
              </label>
              <input
                type="text"
                value={item.imageUrl}
                onChange={(e) => updateItem(idx, { imageUrl: e.target.value })}
                placeholder="https://drive.google.com/file/d/... atau URL gambar"
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id={`stock-${item.id}`}
                checked={item.inStock}
                onChange={(e) => updateItem(idx, { inStock: e.target.checked })}
                className="w-4 h-4 accent-red-600"
              />
              <label htmlFor={`stock-${item.id}`} className="text-xs text-text font-bold">
                Status Stok Tersedia (In Stock)
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   9. VIDEOS EDITOR COMPONENT
   ========================================================= */
const VideosEditor: React.FC<{
  videos: any[];
  onChange: (vids: any[]) => void;
}> = ({ videos, onChange }) => {
  const addVideo = () => {
    const newVid = {
      id: `vid-${Date.now()}`,
      title: 'JUDUL VIDEO KLIP / LIVE CONCERT',
      category: 'music_video',
      youtubeId: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
      duration: '04:00',
      publishedAt: '2026-01-01',
    };
    onChange([...videos, newVid]);
  };

  const updateVid = (index: number, updated: any) => {
    const next = [...videos];
    next[index] = { ...next[index], ...updated };
    onChange(next);
  };

  const deleteVid = (index: number) => {
    if (window.confirm(`Hapus video "${videos[index].title}"?`)) {
      onChange(videos.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted uppercase font-heading font-bold">
          Daftar Video Klip & Footage ({videos.length})
        </span>
        <button
          onClick={addVideo}
          className="flex items-center space-x-1 px-3 py-1.5 bg-accent text-white text-xs font-heading font-bold hover:bg-accent-hover"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Video</span>
        </button>
      </div>

      {videos.map((vid, idx) => (
        <div key={vid.id} className="p-4 bg-bg border-2 border-border space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <span className="bg-accent text-white px-2 py-0.5 text-xs font-bold font-heading">
                #{idx + 1}
              </span>
              <span className="font-bold text-sm truncate max-w-[200px]">{vid.title}</span>
            </div>

            <button
              onClick={() => deleteVid(idx)}
              className="p-1 text-red-400 hover:text-red-300"
              title="Hapus Video"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Judul Video
              </label>
              <input
                type="text"
                value={vid.title}
                onChange={(e) => updateVid(idx, { title: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Kategori Video
              </label>
              <select
                value={vid.category}
                onChange={(e) => updateVid(idx, { category: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              >
                <option value="music_video">Official Music Video</option>
                <option value="live_concert">Live Concert Footage</option>
                <option value="documentary">Mini Documentary / Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Durasi (cth: 03:45)
              </label>
              <input
                type="text"
                value={vid.duration}
                onChange={(e) => updateVid(idx, { duration: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Link YouTube URL atau ID Video
              </label>
              <input
                type="text"
                value={vid.youtubeId}
                onChange={(e) => updateVid(idx, { youtubeId: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                URL Gambar Thumbnail (HTTPS / Google Drive Link)
              </label>
              <input
                type="text"
                value={vid.thumbnailUrl}
                onChange={(e) => updateVid(idx, { thumbnailUrl: e.target.value })}
                placeholder="https://drive.google.com/file/d/... atau URL gambar"
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   10. AUDIO PLAYER & PREVIEW TRACKS EDITOR
   ========================================================= */
const AudioPlayerEditor: React.FC<{
  audioPlayer: { enabled: boolean; tracks: any[] };
  onChange: (audio: { enabled: boolean; tracks: any[] }) => void;
}> = ({ audioPlayer, onChange }) => {
  const tracks = audioPlayer.tracks || [];
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addTrack = () => {
    const newTrack = {
      id: `track-${Date.now()}`,
      title: 'JUDUL LAGU BARU',
      album: 'Nama Album / Single',
      audioUrl: '',
      bpm: 175,
    };
    onChange({
      ...audioPlayer,
      tracks: [...tracks, newTrack],
    });
  };

  const updateTrack = (index: number, updated: any) => {
    const next = [...tracks];
    next[index] = { ...next[index], ...updated };
    onChange({
      ...audioPlayer,
      tracks: next,
    });
  };

  const deleteTrack = (index: number) => {
    if (window.confirm(`Hapus lagu "${tracks[index]?.title}" dari player?`)) {
      onChange({
        ...audioPlayer,
        tracks: tracks.filter((_, i) => i !== index),
      });
    }
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file audio maksimal 5MB.');
      return;
    }

    setUploadingIndex(index);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateTrack(index, { audioUrl: dataUrl });
      }
      setUploadingIndex(null);
    };
    reader.onerror = () => {
      alert('Gagal membaca file audio.');
      setUploadingIndex(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Intro & Info Box */}
      <div className="p-3 bg-bg border-l-4 border-accent text-xs space-y-1.5">
        <p className="font-bold text-text flex items-center space-x-1.5">
          <Music className="w-4 h-4 text-accent" />
          <span>PANDUAN PREVIEW TRACK AUDIO PLAYER:</span>
        </p>
        <p className="text-muted">
          • <strong>Upload Langsung (Disarankan):</strong> Klik tombol <em>"Upload File Audio"</em> untuk memilih file <code>.mp3</code>, <code>.opus</code>, <code>.wav</code>, atau <code>.m4a</code> langsung dari laptop/HP kamu. File akan disimpan langsung ke database dan diputar 100% lancar!
        </p>
        <p className="text-muted">
          • <strong>Link Google Drive / URL:</strong> Masukkan direct link audio atau link Google Drive (Pastikan akses diset ke <em>"Siapa saja yang memiliki link"</em>).
        </p>
        <p className="text-muted">
          • <strong>Kosongkan:</strong> Jika audio URL kosong, player akan memutar efek distorsi riff gitar punk synth bawaan.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted uppercase font-heading font-bold">
          Daftar Lagu di Player Bar ({tracks.length})
        </span>
        <button
          onClick={addTrack}
          className="flex items-center space-x-1 px-3 py-1.5 bg-accent text-white text-xs font-heading font-bold hover:bg-accent-hover"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Lagu</span>
        </button>
      </div>

      {tracks.length === 0 && (
        <div className="text-center py-8 border border-dashed border-border p-4">
          <p className="text-muted text-xs">Belum ada daftar lagu khusus.</p>
          <button
            onClick={addTrack}
            className="mt-3 px-3 py-1.5 bg-surface text-accent border border-accent text-xs font-bold font-heading"
          >
            + Tambah Lagu Pertama
          </button>
        </div>
      )}

      {tracks.map((track, idx) => (
        <div key={track.id || idx} className="p-4 bg-bg border-2 border-border space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <span className="bg-accent text-white px-2 py-0.5 text-xs font-bold font-heading">
                Track #{idx + 1}
              </span>
              <span className="font-bold text-sm truncate max-w-[200px]">{track.title}</span>
            </div>

            <button
              onClick={() => deleteTrack(idx)}
              className="p-1 text-red-400 hover:text-red-300"
              title="Hapus Lagu"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Judul Lagu (Track Title)
              </label>
              <input
                type="text"
                value={track.title}
                onChange={(e) => updateTrack(idx, { title: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                Nama Album / Single
              </label>
              <input
                type="text"
                value={track.album}
                onChange={(e) => updateTrack(idx, { album: e.target.value })}
                className="w-full bg-surface border border-border p-2 text-sm text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-[11px] font-heading font-bold text-muted uppercase">
                Sumber File Audio (Upload Langsung / Link Drive)
              </label>

              {/* Direct File Upload Trigger */}
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 bg-accent text-white text-xs font-heading font-bold hover:bg-accent-hover shadow-punk transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadingIndex === idx ? 'Memproses Audio...' : '📁 Upload File Audio (MP3/Opus/WAV)'}
                  </span>
                  <input
                    type="file"
                    accept="audio/*,.mp3,.opus,.wav,.m4a,.ogg"
                    onChange={(e) => handleFileUpload(idx, e)}
                    className="hidden"
                    disabled={uploadingIndex === idx}
                  />
                </label>

                {track.audioUrl && (
                  <button
                    onClick={() => updateTrack(idx, { audioUrl: '' })}
                    className="px-2 py-1 bg-surface border border-red-800 text-red-400 hover:text-red-300 text-xs font-heading"
                    title="Hapus file audio kustom"
                  >
                    Hapus Audio
                  </button>
                )}
              </div>

              {/* Manual URL Input */}
              <input
                type="text"
                value={track.audioUrl?.startsWith('data:audio') ? '[File Audio Tersimpan di Database]' : (track.audioUrl || '')}
                onChange={(e) => updateTrack(idx, { audioUrl: e.target.value })}
                placeholder="Atau paste link Google Drive / URL .mp3 disini"
                className="w-full bg-surface border border-border p-2 text-xs text-text focus:border-accent focus:outline-none font-mono"
              />

              {/* Live Audio Test Player */}
              {track.audioUrl && (
                <div className="pt-2 p-2.5 bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-accent">Tes Putar Lagu:</span>
                  <audio
                    controls
                    src={formatAudioUrl(track.audioUrl)}
                    className="h-7 w-full sm:w-64 max-w-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


