import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useSite } from '../../context/SiteContext';
import { MessageSquare, Send, MapPin, Music, Trash2, CheckCircle2, Flame, Loader2 } from 'lucide-react';
import { ShoutboxMessage } from '../../../shared/types';
import { INITIAL_SHOUTBOX_MESSAGES } from '../../../shared/constants/initialData';

export const RebelShoutbox: React.FC = () => {
  const { isAdmin } = useAdmin();
  const { content } = useSite();
  const [messages, setMessages] = useState<ShoutboxMessage[]>(INITIAL_SHOUTBOX_MESSAGES);
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [favoriteTrack, setFavoriteTrack] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fetchShouts = async () => {
    // 1. Load from localStorage if present
    try {
      const cached = localStorage.getItem('deathroll_shoutbox');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {}

    // 2. Try fetching from server API
    try {
      const res = await fetch('/api/shoutbox');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data);
          try { localStorage.setItem('deathroll_shoutbox', JSON.stringify(data)); } catch (e) {}
        }
      }
    } catch (e) {
      // Static mode
    }
  };

  useEffect(() => {
    fetchShouts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (!authorName.trim() || !city.trim() || !message.trim()) {
      setErrorNotice('Nama, kota, dan pesan wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    const newShout: ShoutboxMessage = {
      id: `shout-${Date.now()}`,
      authorName: authorName.trim(),
      city: city.trim(),
      message: message.trim(),
      favoriteTrack: favoriteTrack || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      // Try API if available
      try {
        const res = await fetch('/api/shoutbox', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authorName: authorName.trim(),
            city: city.trim(),
            message: message.trim(),
            favoriteTrack: favoriteTrack || undefined,
          }),
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const serverShout = await res.json();
          if (serverShout && serverShout.id) {
            newShout.id = serverShout.id;
          }
        }
      } catch (netErr) {
        // Static hosting mode
      }

      setMessages((prev) => {
        const updated = [newShout, ...prev];
        try { localStorage.setItem('deathroll_shoutbox', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });

      setAuthorName('');
      setCity('');
      setMessage('');
      setFavoriteTrack('');
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    } catch (err) {
      setErrorNotice('Gagal mengirim pesan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus pesan shoutbox ini?')) return;
    try {
      await fetch(`/api/admin/shoutbox/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try { localStorage.setItem('deathroll_shoutbox', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const formatShoutDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="py-20 bg-bg border-b-2 border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-block mb-2">
              <span className="tape-badge-red text-xs">COMMUNITY & REBEL VOICES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-wordmark text-text tracking-wider">
              REBEL SHOUTBOX & GUESTBOOK
            </h2>
            <p className="text-muted text-sm sm:text-base mt-1">
              Tinggalkan pesan, salam dari kotamu, atau bakar semangat sesama kawan seperjuangan!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-surface border-2 border-border p-6 shadow-punk space-y-4">
            <div className="flex items-center space-x-2 border-b border-border pb-3">
              <Flame className="w-5 h-5 text-accent animate-pulse" />
              <h3 className="font-wordmark text-xl text-text tracking-wider">
                KIRIM PESAN SHOUTBOX
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                  Nama / Nickname
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Misal: Rian CirclePit"
                  maxLength={30}
                  className="w-full bg-bg border border-border focus:border-accent text-text p-2.5 text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                  Kota / Wilayah
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Misal: Bandung, Denpasar, dsb"
                  maxLength={30}
                  className="w-full bg-bg border border-border focus:border-accent text-text p-2.5 text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                  Lagu Favorit DEATHROLL (Opsional)
                </label>
                <select
                  value={favoriteTrack}
                  onChange={(e) => setFavoriteTrack(e.target.value)}
                  className="w-full bg-bg border border-border focus:border-accent text-text p-2.5 text-sm focus:outline-none"
                >
                  <option value="">-- Pilih Lagu Favorit --</option>
                  <option value="Pembakar Api Perlawanan">Pembakar Api Perlawanan</option>
                  <option value="Suara Dari Jalanan">Suara Dari Jalanan</option>
                  <option value="Rebel Soul">Rebel Soul</option>
                  <option value="Tanah Merdeka">Tanah Merdeka</option>
                  <option value="Laskar Berbisa">Laskar Berbisa</option>
                  <option value="Menolak Lupa">Menolak Lupa</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold text-muted uppercase mb-1">
                  Pesan / Teriakan
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan teriakan atau salam persaudaraan..."
                  maxLength={280}
                  rows={3}
                  className="w-full bg-bg border border-border focus:border-accent text-text p-2.5 text-sm focus:outline-none resize-none"
                  required
                />
              </div>

              {errorNotice && (
                <p className="text-xs text-red-400 bg-red-950/80 p-2 border border-red-700">
                  {errorNotice}
                </p>
              )}

              {successNotice && (
                <div className="bg-emerald-950 text-emerald-300 p-2 text-xs flex items-center space-x-1.5 border border-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pesan berhasil terkirim ke dinding shoutbox!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white font-heading font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-punk transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>LEMPARKAN PESAN</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Feed (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-heading font-bold uppercase text-muted tracking-wider">
                PESAN TERBARU DARI SELURUH INDONESIA ({messages.length})
              </span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {messages.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-surface border border-border hover:border-accent transition-all shadow-punk space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-wordmark text-base text-text tracking-wide">
                        {item.authorName}
                      </span>
                      <span className="text-[11px] bg-surface-subtle text-accent border border-accent/40 font-heading font-bold px-1.5 py-0.5 flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.city}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-muted font-mono">
                        {formatShoutDate(item.createdAt)}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Hapus pesan ini (Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-text/90 leading-relaxed font-normal">
                    {item.message}
                  </p>

                  {item.favoriteTrack && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-muted pt-1">
                      <Music className="w-3 h-3 text-accent" />
                      <span>Track: <strong className="text-text">{item.favoriteTrack}</strong></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
