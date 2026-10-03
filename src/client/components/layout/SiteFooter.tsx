import React from 'react';
import { useSite } from '../../context/SiteContext';
import { useAdmin } from '../../context/AdminContext';
import {
  Instagram,
  Youtube,
  Music2,
  Lock,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Disc,
} from 'lucide-react';

type FooterProps = {
  navigate: (path: string) => void;
};

export const SiteFooter: React.FC<FooterProps> = ({ navigate }) => {
  const { content } = useSite();
  const { isAdmin, openLoginModal } = useAdmin();

  const getSocialIcon = (kind: string) => {
    switch (kind) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      case 'spotify':
      case 'apple_music':
        return <Disc className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <footer className="bg-surface border-t-4 border-border mt-20 pt-16 pb-12 text-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/60">
          {/* Col 1: Band Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-accent text-white flex items-center justify-center font-wordmark text-xl font-black transform -rotate-3 border border-text shadow-punk">
                DR
              </span>
              <span className="font-wordmark italic text-3xl text-text tracking-wider transform -skew-x-6 inline-block">
                {content.site.bandName}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted/90">
              {content.site.tagline}
            </p>
            <div className="pt-2">
              <span className="tape-badge-red text-xs">PUNK ROCK MERDEKA</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold text-text tracking-wider mb-4 border-l-2 border-accent pl-2">
              NAVIGASI
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => {
                    navigate('/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-accent transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/tour');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-accent transition-colors"
                >
                  Jadwal Tur & Acara
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/discography');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-accent transition-colors"
                >
                  Koleksi Diskografi
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/news');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-accent transition-colors"
                >
                  Berita & Pengumuman
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/biography');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-accent transition-colors"
                >
                  Sejarah & Anggota Band
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-accent transition-colors text-xs text-muted/70 flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Kebijakan Privasi</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Social & Streaming */}
          <div>
            <h3 className="font-heading text-lg font-bold text-text tracking-wider mb-4 border-l-2 border-accent pl-2">
              TERHUBUNG
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {content.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2 bg-surface-subtle hover:bg-accent hover:text-white border border-border transition-all text-text group"
                >
                  <span className="text-muted group-hover:text-white transition-colors">
                    {getSocialIcon(link.kind)}
                  </span>
                  <span className="font-medium text-xs truncate">{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 4: Booking & Contact */}
          <div>
            <h3 className="font-heading text-lg font-bold text-text tracking-wider mb-4 border-l-2 border-accent pl-2">
              BOOKING & KONTAK
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              {content.contact.email && (
                <li className="flex items-start space-x-2">
                  <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${content.contact.email}`}
                    className="hover:text-accent transition-colors break-all"
                  >
                    {content.contact.email}
                  </a>
                </li>
              )}
              {content.contact.whatsapp && (
                <li className="flex items-start space-x-2">
                  <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <a
                    href={`https://wa.me/${content.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    WhatsApp: {content.contact.whatsapp}
                  </a>
                </li>
              )}
              {content.contact.address && (
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-muted/80">{content.contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Discreet Admin Access Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted/60 space-y-4 sm:space-y-0">
          <div>
            <p>{content.site.copyrightText}</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Discreet Admin Trigger */}
            <button
              onClick={openLoginModal}
              className="text-muted/40 hover:text-muted focus:text-accent focus:outline-none flex items-center space-x-1.5 py-1 px-2 rounded border border-transparent hover:border-border transition-colors text-[11px]"
              aria-label="Admin access"
              title="Admin access"
            >
              <Lock className="w-3 h-3" />
              <span>{isAdmin ? 'Admin aktif' : 'Admin access'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
