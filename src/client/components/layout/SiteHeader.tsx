import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { useAdmin } from '../../context/AdminContext';
import { Menu, X, Music, Radio, Edit3, ShoppingBag } from 'lucide-react';

type HeaderProps = {
  currentPath: string;
  navigate: (path: string) => void;
};

export const SiteHeader: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'BERANDA', path: '/' },
    { label: 'JADWAL TUR', path: '/tour' },
    { label: 'DISKOGRAFI', path: '/discography' },
    { label: 'BERITA', path: '/news' },
    { label: 'BIOGRAFI', path: '/biography' },
  ];

  const merchLink = content.links.find((l) => l.kind === 'merch');

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur-md border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Wordmark */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleNavClick('/')}
              className="text-left group flex items-center space-x-2.5 focus:outline-none"
            >
              <div className="w-10 h-10 bg-accent text-white flex items-center justify-center font-wordmark text-2xl font-black transform -rotate-3 border-2 border-text shadow-punk transition-transform group-hover:rotate-0">
                DR
              </div>
              <div>
                <span className="font-wordmark italic text-[clamp(1.4rem,5.2vw,2.3rem)] text-text tracking-wider block leading-none group-hover:text-accent transition-colors transform -skew-x-6 inline-block">
                  {content.site.bandName || 'DEATHROLL'}
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-widest text-muted font-heading uppercase block mt-0.5">
                  INDONESIAN PUNK ROCK
                </span>
              </div>
            </button>

            {isAdmin && !isPreviewMode && (
              <button
                onClick={() => openDrawer('site')}
                className="hidden sm:inline-flex items-center space-x-1 text-xs bg-surface-subtle hover:bg-accent hover:text-white text-muted px-2 py-1 rounded border border-border transition-colors"
                title="Edit Pengaturan Situs & Brand"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Brand</span>
              </button>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3 py-1.5 font-heading text-base font-bold tracking-wider transition-all duration-150 border-b-2 ${
                    isActive
                      ? 'text-accent border-accent bg-surface/50'
                      : 'text-text hover:text-accent border-transparent hover:border-accent/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {merchLink && (
              <a
                href={merchLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-accent text-white font-heading font-bold text-base tracking-wider hover:bg-accent-hover transform hover:-translate-y-0.5 transition-all shadow-punk"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>MERCH</span>
              </a>
            )}
          </nav>

          {/* Right Action: Live Gigs Indicator & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleNavClick('/tour')}
              className="hidden sm:flex items-center space-x-2 bg-surface px-3 py-1.5 border border-border hover:border-accent transition-colors"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
              </span>
              <span className="text-xs font-heading font-bold tracking-wider text-text">ON TOUR 2026</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text hover:text-accent hover:bg-surface border border-border"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b-2 border-accent px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left py-2 px-3 font-heading text-lg font-bold tracking-wider flex items-center justify-between border-l-4 ${
                  isActive
                    ? 'border-accent bg-surface-subtle text-accent'
                    : 'border-transparent text-text hover:border-accent hover:bg-surface-subtle'
                }`}
              >
                <span>{link.label}</span>
              </button>
            );
          })}

          {merchLink && (
            <a
              href={merchLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-accent text-white font-heading font-bold text-lg tracking-wider"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>OFFICIAL MERCHANDISE</span>
            </a>
          )}
        </div>
      )}
    </header>
  );
};
