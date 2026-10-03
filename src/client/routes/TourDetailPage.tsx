import React from 'react';
import { useSite } from '../context/SiteContext';
import { useAdmin } from '../context/AdminContext';
import { ArrowLeft, Calendar, MapPin, Ticket, Clock, Share2, Edit3 } from 'lucide-react';

type TourDetailProps = {
  slug: string;
  navigate: (path: string) => void;
};

export const TourDetailPage: React.FC<TourDetailProps> = ({ slug, navigate }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();

  const show = content.shows.find((s) => s.slug === slug);

  if (!show) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-3xl font-wordmark text-text">ACARA TIDAK DITEMUKAN</h2>
        <p className="text-muted mt-2">Jadwal acara ini mungkin telah dipindahkan atau dihapus.</p>
        <button
          onClick={() => navigate('/tour')}
          className="mt-6 px-6 py-2.5 bg-accent text-white font-heading font-bold"
        >
          KEMBALI KE JADWAL TUR
        </button>
      </div>
    );
  }

  const parseShowDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        formattedDate: d.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        formattedTime: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} WIB`,
      };
    } catch {
      return { formattedDate: dateStr, formattedTime: '19:00 WIB' };
    }
  };

  const { formattedDate, formattedTime } = parseShowDate(show.date);

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/tour')}
          className="inline-flex items-center space-x-2 text-muted hover:text-accent font-heading font-bold text-sm tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE SEMUA ACARA</span>
        </button>

        {/* Main Event Box */}
        <div className="bg-surface border-2 border-border p-6 sm:p-10 shadow-punk-lg space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="tape-badge-red text-xs mb-3">KONSER RESMI DEATHROLL</span>
              <h1 className="text-3xl sm:text-5xl font-wordmark text-text tracking-wider mt-2">
                {show.eventName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted text-sm mt-3">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-text font-bold">{show.city}</span>, {show.venue}
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>{formattedTime}</span>
                </div>
              </div>
            </div>

            {isAdmin && !isPreviewMode && (
              <button
                onClick={() => openDrawer('shows')}
                className="self-start flex items-center space-x-1.5 bg-surface-subtle border border-accent text-accent px-3 py-1 text-xs font-heading font-bold hover:bg-accent hover:text-white"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Acara Ini</span>
              </button>
            )}
          </div>

          {/* Event Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-6">
              <div>
                <h3 className="text-lg font-heading font-bold text-text uppercase tracking-wider mb-2">
                  TENTANG ACARA INI
                </h3>
                <p className="text-text/90 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {show.description || 'Tidak ada deskripsi tambahan untuk acara ini.'}
                </p>
              </div>

              <div className="p-4 bg-bg border border-border space-y-2">
                <h4 className="text-xs font-heading font-bold text-accent uppercase tracking-wider">
                  PANDUAN & KETENTUAN GIGS
                </h4>
                <ul className="text-xs text-muted space-y-1 list-disc list-inside">
                  <li>Harap tunjukkan e-tiket atau bukti pembelian di gerbang masuk.</li>
                  <li>Dilarang membawa senjata tajam, obat terlarang, dan flare.</li>
                  <li>Jaga persaudaraan di arena moshpit. Respect each other!</li>
                </ul>
              </div>
            </div>

            {/* Right Card / Ticket Stub */}
            <div className="md:col-span-5 bg-bg border-2 border-border p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-heading font-bold uppercase tracking-wider text-muted">
                  STATUS TIKET
                </div>
                <div className="text-2xl font-wordmark text-text tracking-wider">
                  {show.status === 'sold_out'
                    ? 'TIKET HABIS (SOLD OUT)'
                    : show.status === 'past'
                    ? 'ACARA SELESAI'
                    : 'TIKET TERSEDIA'}
                </div>
                <p className="text-xs text-muted">
                  Venue: <strong className="text-text">{show.venue}</strong>, {show.city}
                </p>
              </div>

              {show.ticketUrl && show.status === 'scheduled' && (
                <a
                  href={show.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-accent hover:bg-accent-hover text-white font-heading font-bold text-base tracking-wider uppercase text-center shadow-punk flex items-center justify-center space-x-2"
                >
                  <Ticket className="w-5 h-5" />
                  <span>BELI TIKET ONLINE</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
