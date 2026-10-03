import React, { useState, useEffect } from 'react';
import { useSite } from './context/SiteContext';
import { useAdmin } from './context/AdminContext';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { AudioPlayerBar } from './components/layout/AudioPlayerBar';
import { AdminToolbar } from './components/admin/AdminToolbar';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { SectionDrawerEditor } from './components/admin/SectionDrawerEditor';
import { ConflictModal } from './components/admin/ConflictModal';

import { HomePage } from './routes/HomePage';
import { TourPage } from './routes/TourPage';
import { TourDetailPage } from './routes/TourDetailPage';
import { DiscographyPage } from './routes/DiscographyPage';
import { ReleaseDetailPage } from './routes/ReleaseDetailPage';
import { NewsPage } from './routes/NewsPage';
import { NewsDetailPage } from './routes/NewsDetailPage';
import { BiographyPage } from './routes/BiographyPage';
import { PrivacyPage } from './routes/PrivacyPage';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const { isLoading } = useSite();
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  // Push state router simulation / history synchronization
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-text space-y-4">
        <div className="w-12 h-12 bg-accent text-white flex items-center justify-center font-wordmark text-2xl border-2 border-text shadow-punk animate-bounce">
          DR
        </div>
        <div className="flex items-center space-x-2 text-muted font-heading text-sm uppercase tracking-widest">
          <Loader2 className="w-4 h-4 animate-spin text-accent" />
          <span>MEMUAT KONTEN DEATHROLL...</span>
        </div>
      </div>
    );
  }

  // Routing resolver
  const renderCurrentRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} />;
    }
    if (currentPath === '/tour') {
      return <TourPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/tour/')) {
      const slug = currentPath.replace('/tour/', '');
      return <TourDetailPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/discography') {
      return <DiscographyPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/discography/')) {
      const slug = currentPath.replace('/discography/', '');
      return <ReleaseDetailPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/news') {
      return <NewsPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/news/')) {
      const slug = currentPath.replace('/news/', '');
      return <NewsDetailPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/biography') {
      return <BiographyPage navigate={navigate} />;
    }
    if (currentPath === '/privacy') {
      return <PrivacyPage navigate={navigate} />;
    }

    // Default Fallback to 404 / Home
    return (
      <div className="py-28 text-center space-y-4">
        <h2 className="text-5xl font-wordmark text-accent tracking-wider">404 — HALAMAN TIDAK DITEMUKAN</h2>
        <p className="text-muted">Halaman yang Anda cari tidak tersedia.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-accent text-white font-heading font-bold uppercase shadow-punk"
        >
          KEMBALI KE BERANDA
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col justify-between selection:bg-accent selection:text-white pb-24 sm:pb-20">
      {/* 1. Admin Live Editing Toolbar (Sticky on top) */}
      <AdminToolbar />

      {/* 2. Main Site Navigation */}
      <SiteHeader currentPath={currentPath} navigate={navigate} />

      {/* 3. Main Route Content */}
      <main className="flex-grow">
        {renderCurrentRoute()}
      </main>

      {/* 4. Global Footer with discreet Admin trigger */}
      <SiteFooter navigate={navigate} />

      {/* 5. Sticky Punk Audio Player Bar */}
      <AudioPlayerBar />

      {/* 6. Admin Dialogs & Drawers */}
      <AdminAuthModal />
      <SectionDrawerEditor />
      <ConflictModal />
    </div>
  );
};
