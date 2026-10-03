import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useAdmin } from '../context/AdminContext';
import { Calendar, MapPin, Ticket, Search, Edit3, Clock, AlertCircle } from 'lucide-react';
import { Show } from '../../shared/types';

type TourPageProps = {
  navigate: (path: string) => void;
};

export const TourPage: React.FC<TourPageProps> = ({ navigate }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredShows = content.shows.filter((show) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'upcoming'
        ? show.status !== 'past'
        : show.status === 'past';

    const matchesSearch =
      show.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.venue.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

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
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b-2 border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="tape-badge-red text-xs mb-2">LIVE EXPERIENCE</span>
              <h1 className="text-4xl sm:text-6xl font-wordmark text-text tracking-wider mt-1">
                JADWAL TUR & KONSER
              </h1>
              <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
                Daftar lengkap panggung DEATHROLL di seluruh nusantara. Jangan lewatkan energi liar circle pit di kotamu!
              </p>
            </div>

            {isAdmin && !isPreviewMode && (
              <button
                onClick={() => openDrawer('shows')}
                className="inline-flex items-center space-x-2 bg-accent text-white px-4 py-2 font-heading font-bold text-sm tracking-wider shadow-punk self-start"
              >
                <Edit3 className="w-4 h-4" />
                <span>KELOLA ACARA TUR</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <button
              onClick={() => setFilter('upcoming')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider border transition-all ${
                filter === 'upcoming'
                  ? 'bg-accent text-white border-accent shadow-punk'
                  : 'bg-surface text-muted border-border hover:text-text'
              }`}
            >
              MENDATANG
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider border transition-all ${
                filter === 'past'
                  ? 'bg-accent text-white border-accent shadow-punk'
                  : 'bg-surface text-muted border-border hover:text-text'
              }`}
            >
              ACARA LALU
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider border transition-all ${
                filter === 'all'
                  ? 'bg-accent text-white border-accent shadow-punk'
                  : 'bg-surface text-muted border-border hover:text-text'
              }`}
            >
              SEMUA ({content.shows.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kota, venue, festival..."
              className="w-full bg-surface border border-border focus:border-accent text-text pl-9 pr-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Shows Table / Cards */}
        {filteredShows.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border">
            <AlertCircle className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-lg font-wordmark text-text tracking-wider">TIDAK ADA ACARA YANG DITEMUKAN</p>
            <p className="text-sm text-muted mt-1">Coba ganti filter atau kata kunci pencarian.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredShows.map((show) => {
              const { day, month, year, time } = parseShowDate(show.date);
              return (
                <div
                  key={show.id}
                  className="bg-surface border-2 border-border hover:border-accent p-4 sm:p-6 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-punk group"
                >
                  <div className="flex items-center space-x-5 min-w-[220px]">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-subtle border-2 border-border group-hover:border-accent flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-accent font-heading tracking-widest">{month}</span>
                      <span className="text-2xl sm:text-3xl font-black font-wordmark text-text leading-none">{day}</span>
                      <span className="text-[10px] text-muted font-heading">{year}</span>
                    </div>

                    <div>
                      {getStatusBadge(show.status)}
                      <div className="flex items-center space-x-1.5 text-xs text-muted mt-2">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        <span>{time || '19:00 WIB'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => navigate(`/tour/${show.slug}`)}
                      className="text-2xl font-wordmark text-text tracking-wide group-hover:text-accent transition-colors cursor-pointer truncate"
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
                      <p className="text-xs text-muted/80 mt-2 line-clamp-2">
                        {show.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border">
                    <button
                      onClick={() => navigate(`/tour/${show.slug}`)}
                      className="px-4 py-2 text-sm font-heading font-bold text-text bg-surface-subtle hover:bg-surface border border-border hover:border-accent transition-colors"
                    >
                      INFO DETAIL
                    </button>

                    {show.ticketUrl && show.status === 'scheduled' && (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 text-sm font-heading font-bold bg-accent text-white hover:bg-accent-hover transition-all shadow-punk flex items-center space-x-1.5"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>BELI TIKET</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
