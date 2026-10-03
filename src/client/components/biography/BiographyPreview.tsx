import React from 'react';
import { useSite } from '../../context/SiteContext';
import { useAdmin } from '../../context/AdminContext';
import { Users, ArrowRight, Edit3, ShieldAlert } from 'lucide-react';

type BioProps = {
  navigate: (path: string) => void;
};

export const BiographyPreview: React.FC<BioProps> = ({ navigate }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();
  const bio = content.biography;

  return (
    <section className="py-20 bg-bg border-b-2 border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Col: Band Photo with Punk Tape Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative border-4 border-text shadow-punk-lg group">
              <img
                src={bio.imageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"}
                alt={bio.imageAlt || bio.heading}
                className="w-full aspect-[4/3] object-cover filter contrast-125 grayscale group-hover:grayscale-0 transition-all duration-500"
                loading="lazy"
              />
              <div className="absolute -top-3 -left-3">
                <span className="tape-badge-red text-xs sm:text-sm">DEATHROLL • EST. 2011</span>
              </div>
            </div>
          </div>

          {/* Right Col: Story & Members */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <span className="tape-badge text-xs">THE STORY & BROTHERHOOD</span>

              {isAdmin && !isPreviewMode && (
                <button
                  onClick={() => openDrawer('biography')}
                  className="flex items-center space-x-1.5 bg-surface-subtle text-accent border border-accent hover:bg-accent hover:text-white px-3 py-1 font-heading text-xs font-bold uppercase transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Biografi</span>
                </button>
              )}
            </div>

            <h2 className="text-3xl sm:text-5xl font-wordmark text-text tracking-wider leading-tight">
              {bio.heading}
            </h2>

            <div className="text-muted text-base leading-relaxed space-y-3 font-normal">
              <p className="line-clamp-4">
                {bio.bodyMarkdown.split('\n')[0]}
              </p>
            </div>

            {/* Member Highlights */}
            {bio.members && bio.members.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-heading font-bold text-accent uppercase tracking-widest mb-3">
                  PERSONIL / FORMATION
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {bio.members.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-surface border border-border flex flex-col justify-center"
                    >
                      <span className="font-wordmark text-lg text-text tracking-wide truncate">
                        {m.name}
                      </span>
                      <span className="text-xs text-accent font-heading font-semibold mt-0.5">
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => navigate('/biography')}
                className="px-6 py-3 bg-accent text-white font-heading font-bold text-base tracking-wider hover:bg-accent-hover transition-all shadow-punk inline-flex items-center space-x-2"
              >
                <span>BACA SEJARAH LENGKAP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
