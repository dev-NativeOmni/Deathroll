import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useAdmin } from '../context/AdminContext';
import { Calendar, ArrowRight, Edit3, Search, AlertCircle } from 'lucide-react';

type NewsPageProps = {
  navigate: (path: string) => void;
};

export const NewsPage: React.FC<NewsPageProps> = ({ navigate }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');

  const publishedPosts = content.posts.filter((p) => {
    if (!isAdmin && p.status !== 'published') return false;
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b-2 border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="tape-badge-red text-xs mb-2">OFFICIAL DISPATCH</span>
              <h1 className="text-4xl sm:text-6xl font-wordmark text-text tracking-wider mt-1">
                BERITA & PENGUMUMAN
              </h1>
              <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
                Kabar resmi, dokumentasi tur, catatan studio, dan aksi sosial DEATHROLL.
              </p>
            </div>

            {isAdmin && !isPreviewMode && (
              <button
                onClick={() => openDrawer('posts')}
                className="inline-flex items-center space-x-2 bg-accent text-white px-4 py-2 font-heading font-bold text-sm tracking-wider shadow-punk self-start"
              >
                <Edit3 className="w-4 h-4" />
                <span>KELOLA BERITA</span>
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel berita..."
              className="w-full bg-surface border border-border focus:border-accent text-text pl-9 pr-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* News Grid */}
        {publishedPosts.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border">
            <AlertCircle className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-lg font-wordmark text-text tracking-wider">TIDAK ADA BERITA DITEMUKAN</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-surface border-2 border-border hover:border-accent transition-all duration-200 flex flex-col justify-between shadow-punk group"
              >
                <div>
                  {post.imageUrl && (
                    <div
                      onClick={() => navigate(`/news/${post.slug}`)}
                      className="relative aspect-video overflow-hidden bg-surface-subtle cursor-pointer border-b border-border"
                    >
                      <img
                        src={post.imageUrl}
                        alt={post.imageAlt || post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-accent font-heading font-bold mb-2">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      {post.status === 'draft' && (
                        <span className="bg-amber-950 text-amber-300 px-1.5 py-0.5 border border-amber-700">
                          DRAFT
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => navigate(`/news/${post.slug}`)}
                      className="text-xl font-wordmark text-text tracking-wide group-hover:text-accent transition-colors cursor-pointer line-clamp-2 leading-tight"
                    >
                      {post.title}
                    </h3>

                    <p className="text-muted text-sm mt-3 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => navigate(`/news/${post.slug}`)}
                    className="w-full py-2.5 bg-surface-subtle group-hover:bg-accent group-hover:text-white text-text font-heading text-sm font-bold tracking-wider border border-border group-hover:border-accent transition-all flex items-center justify-center space-x-2"
                  >
                    <span>BACA SELENGKAPNYA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
