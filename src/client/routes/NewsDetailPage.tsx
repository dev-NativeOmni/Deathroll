import React from 'react';
import { useSite } from '../context/SiteContext';
import { useAdmin } from '../context/AdminContext';
import { renderMarkdown } from '../utils/markdown';
import { ArrowLeft, Calendar, Share2, Edit3, ArrowRight } from 'lucide-react';

type NewsDetailProps = {
  slug: string;
  navigate: (path: string) => void;
};

export const NewsDetailPage: React.FC<NewsDetailProps> = ({ slug, navigate }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();

  const post = content.posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-3xl font-wordmark text-text">BERITA TIDAK DITEMUKAN</h2>
        <p className="text-muted mt-2">Artikel ini mungkin telah dihapus atau URL tidak tepat.</p>
        <button
          onClick={() => navigate('/news')}
          className="mt-6 px-6 py-2.5 bg-accent text-white font-heading font-bold"
        >
          KEMBALI KE BERITA
        </button>
      </div>
    );
  }

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  const otherPosts = content.posts
    .filter((p) => p.id !== post.id && p.status === 'published')
    .slice(0, 2);

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => navigate('/news')}
          className="inline-flex items-center space-x-2 text-muted hover:text-accent font-heading font-bold text-sm tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE BERITA</span>
        </button>

        {/* Article Container */}
        <article className="bg-surface border-2 border-border p-6 sm:p-10 shadow-punk-lg space-y-6">
          <div className="space-y-3 pb-6 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="tape-badge-red text-xs">OFFICIAL RELEASE</span>

              {isAdmin && !isPreviewMode && (
                <button
                  onClick={() => openDrawer('posts')}
                  className="flex items-center space-x-1.5 bg-surface-subtle border border-accent text-accent px-3 py-1 text-xs font-heading font-bold hover:bg-accent hover:text-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Artikel Ini</span>
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-wordmark text-text tracking-wider leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center space-x-2 text-xs text-accent font-heading font-bold">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>

          {/* Article Main Image */}
          {post.imageUrl && (
            <div className="aspect-video w-full overflow-hidden bg-surface-subtle border-2 border-border shadow-punk">
              <img
                src={post.imageUrl}
                alt={post.imageAlt || post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Lead Excerpt */}
          <div className="p-4 bg-bg border-l-4 border-accent text-text font-medium text-base sm:text-lg italic leading-relaxed">
            {post.excerpt}
          </div>

          {/* Body Markdown Content */}
          <div className="pt-4 text-text leading-relaxed space-y-4">
            {renderMarkdown(post.bodyMarkdown)}
          </div>
        </article>

        {/* Other Related News */}
        {otherPosts.length > 0 && (
          <div className="pt-8 border-t-2 border-border space-y-4">
            <h3 className="font-wordmark text-2xl text-text tracking-wider">
              BERITA LAINNYA
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherPosts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/news/${p.slug}`)}
                  className="p-4 bg-surface border border-border hover:border-accent cursor-pointer group shadow-punk"
                >
                  <span className="text-xs text-accent font-heading font-bold">
                    {formatDate(p.publishedAt)}
                  </span>
                  <h4 className="font-wordmark text-lg text-text group-hover:text-accent transition-colors mt-1 line-clamp-1">
                    {p.title}
                  </h4>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{p.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
