import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useSite } from '../../context/SiteContext';
import {
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  LogOut,
  Sliders,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Calendar,
  Disc,
  Newspaper,
  BookOpen,
  Link2,
  Settings,
  Code,
} from 'lucide-react';

export const AdminToolbar: React.FC = () => {
  const { isAdmin, isPreviewMode, togglePreviewMode, logout } = useAdmin();
  const {
    isDirty,
    isSaving,
    saveStatus,
    statusMessage,
    saveChanges,
    discardChanges,
    openDrawer,
    revision,
  } = useSite();

  if (!isAdmin) return null;

  return (
    <div className="sticky top-0 z-50 bg-[#121212] border-b-2 border-accent text-text px-4 py-2.5 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Admin Status & Section Quick Launchers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-2 bg-black px-2.5 py-1 border border-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
            <span className="font-heading font-black text-xs text-accent uppercase tracking-widest">
              CMS ADMIN (REV {revision})
            </span>
          </div>

          {/* Unsaved / Saved Badge */}
          {isDirty ? (
            <div className="flex items-center space-x-1.5 bg-amber-950/80 text-amber-300 border border-amber-600 px-2.5 py-1 text-xs font-heading font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>DRAFT BELUM TERSIMPAN</span>
            </div>
          ) : saveStatus === 'saved' ? (
            <div className="flex items-center space-x-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-600 px-2.5 py-1 text-xs font-heading font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>TERSIMPAN</span>
            </div>
          ) : null}

          {/* Quick Edit Section Buttons (Hidden in preview mode) */}
          {!isPreviewMode && (
            <div className="hidden lg:flex items-center space-x-1 pl-2 border-l border-border">
              <button
                onClick={() => openDrawer('hero')}
                className="px-2 py-1 text-xs font-heading font-semibold hover:bg-surface border border-transparent hover:border-border text-muted hover:text-text flex items-center space-x-1"
                title="Edit Hero Carousel"
              >
                <Sliders className="w-3 h-3 text-accent" />
                <span>Hero</span>
              </button>
              <button
                onClick={() => openDrawer('shows')}
                className="px-2 py-1 text-xs font-heading font-semibold hover:bg-surface border border-transparent hover:border-border text-muted hover:text-text flex items-center space-x-1"
                title="Edit Jadwal Tur"
              >
                <Calendar className="w-3 h-3 text-accent" />
                <span>Tur</span>
              </button>
              <button
                onClick={() => openDrawer('releases')}
                className="px-2 py-1 text-xs font-heading font-semibold hover:bg-surface border border-transparent hover:border-border text-muted hover:text-text flex items-center space-x-1"
                title="Edit Diskografi"
              >
                <Disc className="w-3 h-3 text-accent" />
                <span>Rilisan</span>
              </button>
              <button
                onClick={() => openDrawer('merch')}
                className="px-2 py-1 text-xs font-heading font-semibold hover:bg-surface border border-transparent hover:border-border text-muted hover:text-text flex items-center space-x-1"
                title="Edit Merchandise Katalog"
              >
                <Sliders className="w-3 h-3 text-accent" />
                <span>Merch</span>
              </button>
              <button
                onClick={() => openDrawer('videos')}
                className="px-2 py-1 text-xs font-heading font-semibold hover:bg-surface border border-transparent hover:border-border text-muted hover:text-text flex items-center space-x-1"
                title="Edit Video Klip YouTube"
              >
                <Disc className="w-3 h-3 text-accent" />
                <span>Video</span>
              </button>
              <button
                onClick={() => openDrawer('posts')}
                className="px-2 py-1 text-xs font-heading font-semibold hover:bg-surface border border-transparent hover:border-border text-muted hover:text-text flex items-center space-x-1"
                title="Edit Berita"
              >
                <Newspaper className="w-3 h-3 text-accent" />
                <span>Berita</span>
              </button>
              <button
                onClick={() => openDrawer('biography')}
                className="px-2 py-1 text-xs font-heading font-semibold hover:bg-surface border border-transparent hover:border-border text-muted hover:text-text flex items-center space-x-1"
                title="Edit Biografi & Personil"
              >
                <BookOpen className="w-3 h-3 text-accent" />
                <span>Bio</span>
              </button>
              <button
                onClick={() => openDrawer('links')}
                className="px-2 py-1 text-xs font-heading font-semibold hover:bg-surface border border-transparent hover:border-border text-muted hover:text-text flex items-center space-x-1"
                title="Edit Link Sosial & Kontak"
              >
                <Link2 className="w-3 h-3 text-accent" />
                <span>Links</span>
              </button>
              <button
                onClick={() => openDrawer('site')}
                className="px-2 py-1 text-xs font-heading font-semibold hover:bg-surface border border-transparent hover:border-border text-muted hover:text-text flex items-center space-x-1"
                title="Edit Brand & Setting Situs"
              >
                <Settings className="w-3 h-3 text-accent" />
                <span>Brand</span>
              </button>
              <button
                onClick={() => openDrawer('json')}
                className="px-2 py-1 text-xs font-heading font-semibold hover:bg-surface border border-transparent hover:border-border text-muted hover:text-text flex items-center space-x-1"
                title="Lihat Raw JSON Data"
              >
                <Code className="w-3 h-3 text-accent" />
                <span>JSON</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Actions (Save, Discard, Preview Toggle, Logout) */}
        <div className="flex items-center space-x-2">
          {/* Mobile section picker */}
          <button
            onClick={() => openDrawer('site')}
            className="lg:hidden px-2.5 py-1.5 bg-surface text-xs font-heading font-bold border border-border text-text"
          >
            EDIT KONTEN...
          </button>

          {/* Preview as Viewer Toggle */}
          <button
            onClick={togglePreviewMode}
            className={`px-3 py-1.5 text-xs font-heading font-bold flex items-center space-x-1.5 border transition-colors ${
              isPreviewMode
                ? 'bg-accent text-white border-accent'
                : 'bg-surface text-muted border-border hover:text-text'
            }`}
            title="Sembunyikan/Tampilkan tombol edit untuk preview tampilan publik"
          >
            {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {isPreviewMode ? 'Keluar Preview' : 'Preview Pengunjung'}
            </span>
          </button>

          {/* Discard changes if dirty */}
          {isDirty && (
            <button
              onClick={discardChanges}
              className="px-3 py-1.5 bg-surface-subtle hover:bg-red-950 text-red-300 border border-red-700 text-xs font-heading font-bold flex items-center space-x-1 transition-colors"
              title="Batalkan draft dan kembalikan ke versi server"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Batal Draft</span>
            </button>
          )}

          {/* Save Changes Button */}
          <button
            onClick={saveChanges}
            disabled={!isDirty || isSaving}
            className={`px-4 py-1.5 text-xs font-heading font-bold tracking-wider uppercase flex items-center space-x-1.5 shadow-punk transition-all ${
              isDirty
                ? 'bg-accent hover:bg-accent-hover text-white cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-1.5 text-muted hover:text-accent hover:bg-surface border border-transparent hover:border-border transition-colors"
            title="Keluar dari mode admin"
            aria-label="Logout admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Temporary feedback banner if any */}
      {statusMessage && (
        <div
          className={`text-center py-1 text-xs font-bold font-heading tracking-wide mt-1.5 border ${
            saveStatus === 'saved'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
              : saveStatus === 'error' || saveStatus === 'conflict'
              ? 'bg-red-950 text-red-300 border-red-700'
              : 'bg-surface text-muted border-border'
          }`}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
};
