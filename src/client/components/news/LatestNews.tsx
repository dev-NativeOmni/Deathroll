import React from 'react';
import { useSite } from '../../context/SiteContext';
import { useAdmin } from '../../context/AdminContext';
import { Calendar, ArrowRight, Edit3, Newspaper } from 'lucide-react';

type NewsProps = {
  navigate: (path: string) => void;
  limit?: number;
};

export const LatestNews: React.FC<NewsProps> = ({ navigate, limit }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();

  const publishedPosts = content.posts.filter((p) => p.status === 'published');
  const displayedPosts = limit ? publishedPosts.slice(0, limit) : publishedPosts;

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
    <section className="py-20 bg-surface border-b-2 border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-block mb-2">
              <span className="tape-badge-red text-xs">PUNK ZINE DISPATCH</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-wordmark text-text tracking-wider">
              BERITA & KABAR TERBARU
            </h2>
            <p className="text-muted text-sm sm:text-base mt-1">
              Jurnal perjalanan, siaran pers, dan suara langsung dari balik panggung.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && !isPreviewMode && (
              <button
                onClick={() => openDrawer('posts')}
                className="flex items-center space-x-1.5 bg-surface-subtle text-accent border border-accent hover:bg-accent hover:text-white px-3 py-1.5 font-heading text-xs font-bold uppercase transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Kelola Berita ({content.posts.length})</span>
              </button>
            )}

            {limit && publishedPosts.length > limit && (
              <button
                onClick={() => navigate('/news')}
                className="inline-flex items-center space-x-2 text-accent font-heading font-bold hover:underline tracking-wider"
              >
                <span>LIHAT SEMUA BERITA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedPosts.map((post) => (
            <article
              key={post.id}
              className="bg-bg border-2 border-border hover:border-accent transition-all duration-200 flex flex-col justify-between shadow-punk group"
            >
              <div>
                {/* Article Image */}
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
                  <div className="flex items-center space-x-2 text-xs text-accent font-heading font-bold mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(post.publishedAt)}</span>
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
      </div>
    </section>
  );
};
