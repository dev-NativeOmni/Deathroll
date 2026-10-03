import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { useAdmin } from '../../context/AdminContext';
import { ShoppingBag, Tag, Edit3, MessageCircle, ArrowRight, Check, Sparkles } from 'lucide-react';
import { MerchandiseItem } from '../../../shared/types';

export const MerchandiseShowcase: React.FC = () => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const merchList = content.merchandise || [];

  const filteredMerch = merchList.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  return (
    <section id="merch-section" className="py-20 bg-bg border-b-2 border-border relative overflow-hidden">
      {/* Background Halftone subtle pattern */}
      <div className="absolute inset-0 halftone-overlay pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-block mb-2">
              <span className="tape-badge-red text-xs">OFFICIAL STREETWEAR & GEAR</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-wordmark text-text tracking-wider">
              OFFICIAL MERCHANDISE DROP
            </h2>
            <p className="text-muted text-sm sm:text-base mt-1">
              Heavyweight cotton, vintage wash, piringan hitam, & aksesoris punk asli buatan lokal.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && !isPreviewMode && (
              <button
                onClick={() => openDrawer('merch')}
                className="flex items-center space-x-1.5 bg-surface-subtle text-accent border border-accent hover:bg-accent hover:text-white px-3 py-1.5 font-heading text-xs font-bold uppercase transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Kelola Merch ({merchList.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'all', label: 'SEMUA KATALOG' },
            { id: 'tshirt', label: 'KAOS / TEES' },
            { id: 'vinyl', label: 'VINYL & KASET' },
            { id: 'hoodie', label: 'HOODIE & JACKET' },
            { id: 'accessories', label: 'AKSESORIS' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-4 py-1.5 text-xs font-heading font-bold uppercase tracking-wider transition-all border ${
                filterCategory === cat.id
                  ? 'bg-accent text-white border-accent shadow-punk'
                  : 'bg-surface text-muted border-border hover:text-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Merchandise Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMerch.map((item) => (
            <div
              key={item.id}
              className="bg-surface border-2 border-border hover:border-accent p-4 transition-all duration-300 flex flex-col justify-between group shadow-punk relative"
            >
              {/* Duct tape top right corner */}
              <div className="duct-tape-corner"></div>

              <div>
                {/* Product Image Container */}
                <div className="aspect-square w-full overflow-hidden bg-surface-subtle border border-border relative mb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Stamp / Badge */}
                  {item.badge && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="tape-badge text-[10px] sm:text-xs">
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                      <span className="rubber-stamp-soldout text-sm">HABIS / SOLD OUT</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-heading font-bold text-accent uppercase tracking-wider">
                    {item.category.toUpperCase()}
                  </span>
                  <h3 className="font-wordmark text-xl text-text tracking-wide line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-lg font-bold font-mono text-emerald-400 pt-1">
                    {item.formattedPrice}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-border">
                {item.inStock ? (
                  <a
                    href={
                      item.orderUrl ||
                      `https://wa.me/6281234567890?text=Halo%20Admin%20Deathroll,%20saya%20mau%20pesan%20${encodeURIComponent(item.name)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-punk transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>PESAN VIA WHATSAPP</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 bg-zinc-800 text-zinc-500 font-heading font-bold text-xs uppercase tracking-wider cursor-not-allowed"
                  >
                    STOK HABIS
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
