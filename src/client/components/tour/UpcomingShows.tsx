import React from 'react';
import { useSite } from '../../context/SiteContext';
import { useAdmin } from '../../context/AdminContext';
import { Calendar, MapPin, Ticket, ArrowRight, Edit3, Clock, AlertCircle } from 'lucide-react';
import { Show } from '../../../shared/types';

type TourProps = {
  navigate: (path: string) => void;
  limit?: number;
};

export const UpcomingShows: React.FC<TourProps> = ({ navigate, limit }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();

  const parseShowDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = isNaN(d.getDate()) ? '??' : d.getDate().toString().padStart(2, '0');
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
    const month = isNaN(d.getMonth()) ? '???' : months[d.getMonth()];
    const year = isNaN(d.getFullYear()) ? '2026' : d.getFullYear();
    const time = isNaN(d.getHours())
      ? ''
      : `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} WIB`;
    return { day, month, year, time };
  };

  // Sort upcoming first, then past
  const sortedShows = [...content.shows].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const displayedShows = limit ? sortedShows.slice(0, limit) : sortedShows;

  const getStatusBadge = (status: Show['status']) => {
    switch (status) {
      case 'sold_out':
        return <span className="bg-red-900/80 text-red-200 border border-red-600 text-xs font-heading font-bold px-2.5 py-1">SOLD OUT</span>;
      case 'cancelled':
        return <span className="bg-zinc-800 text-zinc-400 border border-zinc-600 text-xs font-heading font-bold px-2.5 py-1">BATAL</span>;
      case 'past':
        return <span className="bg-zinc-900 text-zinc-500 border border-zinc-700 text-xs font-heading font-bold px-2.5 py-1">SELESAI</span>;
      default:
        return <span className="bg-emerald-950 text-emerald-400 border border-emerald-600 text-xs font-heading font-bold px-2.5 py-1">TERJADWAL</span>;
    }
  };

  return (
    <section className="py-20 bg-surface border-b-2 border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-block mb-2">
              <span className="tape-badge-red text-xs">LIVE TOUR 2026</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-wordmark text-text tracking-wider">
              JADWAL TUR & GIGS
            </h2>
            <p className="text-muted text-sm sm:text-base mt-1">
              Rasakan gemuruh distorsi live di kotamu. Amankan tiketmu sekarang!
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && !isPreviewMode && (
              <button
                onClick={() => openDrawer('shows')}
                className="flex items-center space-x-1.5 bg-surface-subtle text-accent border border-accent hover:bg-accent hover:text-white px-3 py-1.5 font-heading text-xs font-bold uppercase transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Kelola Tur ({content.shows.length})</span>
              </button>
            )}

            {limit && content.shows.length > limit && (
              <button
                onClick={() => navigate('/tour')}
                className="inline-flex items-center space-x-2 text-accent font-heading font-bold hover:underline tracking-wider"
              >
                <span>LIHAT SEMUA KOTA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Shows List */}
        {displayedShows.length === 0 ? (
          <div className="text-center py-16 bg-surface-subtle border border-border">
            <AlertCircle className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-text font-bold text-lg font-heading">BELUM ADA JADWAL ACARA TERBARU</p>
            <p className="text-muted text-sm mt-1">Nantikan pengumuman panggung berikutnya.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedShows.map((show) => {
              const { day, month, year, time } = parseShowDate(show.date);
              return (
                <div
                  key={show.id}
                  className="bg-bg border-2 border-border hover:border-accent p-4 sm:p-6 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-punk group"
                >
                  {/* Date Stub */}
                  <div className="flex items-center space-x-5 min-w-[220px]">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-subtle border-2 border-border group-hover:border-accent flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-accent font-heading tracking-widest">{month}</span>
                      <span className="text-2xl sm:text-3xl font-black font-wordmark text-text leading-none">{day}</span>
                      <span className="text-[10px] text-muted font-heading">{year}</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(show.status)}
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-muted mt-2">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span>{time || 'Mulai 19:00 WIB'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Event & Venue Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => navigate(`/tour/${show.slug}`)}
                      className="text-xl sm:text-2xl font-wordmark text-text tracking-wide group-hover:text-accent transition-colors cursor-pointer truncate"
                    >
                      {show.eventName}
                    </h3>
                    <div className="flex items-center space-x-2 text-muted text-sm mt-1">
                      <MapPin className="w-4 h-4 text-accent shrink-0" />
                      <span className="font-semibold text-text">{show.city}</span>
                      <span>•</span>
                      <span className="truncate">{show.venue}</span>
                    </div>
                    {show.description && (
                      <p className="text-xs text-muted/80 mt-2 line-clamp-1">
                        {show.description}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border">
                    <button
                      onClick={() => navigate(`/tour/${show.slug}`)}
                      className="px-4 py-2 text-sm font-heading font-bold text-text bg-surface-subtle hover:bg-surface border border-border hover:border-accent transition-colors"
                    >
                      DETAIL
                    </button>

                    {show.ticketUrl && show.status === 'scheduled' && (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 text-sm font-heading font-bold bg-accent text-white hover:bg-accent-hover transition-all shadow-punk flex items-center space-x-1.5"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>TIKET</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
