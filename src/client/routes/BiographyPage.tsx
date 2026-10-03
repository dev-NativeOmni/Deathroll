import React from 'react';
import { useSite } from '../context/SiteContext';
import { useAdmin } from '../context/AdminContext';
import { renderMarkdown } from '../utils/markdown';
import { Users, Guitar, Flame, Edit3, Award, Disc } from 'lucide-react';
import { formatImageUrl } from '../utils/imageUtils';

type BioPageProps = {
  navigate: (path: string) => void;
};

export const BiographyPage: React.FC<BioPageProps> = ({ navigate }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();
  const bio = content.biography;

  const milestones = [
    { year: '2011', title: 'Terbentuk di Bali', desc: 'Tiga pemuda jalanan sepakat membentuk DEATHROLL berbekal gitar second dan amplifier rakitan.' },
    { year: '2015', title: 'Debut Album Rebel Spirit', desc: 'Merilis album perdana independen yang terjual 5.000 keping kaset pita di kalangan underground.' },
    { year: '2019', title: 'Tur Nasional 20 Kota', desc: 'Menjelajah jalur darat Pantura hingga pelosok pulau Jawa dan Bali dalam tur bertajuk Badai Distorsi.' },
    { year: '2024', title: 'Album Masterpiece Tanah Merdeka', desc: 'Memuncaki tangga lagu rock alternatif nusantara dan meraih nominasi Best Rock Album.' },
    { year: '2026', title: 'Suara Dari Jalanan & Tur 14 Kota', desc: 'Memasuki era baru dengan semangat perlawanan sosial yang semakin membara.' },
  ];

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="border-b-2 border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="tape-badge-red text-xs mb-2">THE BAND LEGACY</span>
            <h1 className="text-4xl sm:text-6xl font-wordmark text-text tracking-wider mt-1">
              BIOGRAFI & PERSONIL
            </h1>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
              Perjalanan lebih dari satu dekade membakar panggung musik underground nusantara.
            </p>
          </div>

          {isAdmin && !isPreviewMode && (
            <button
              onClick={() => openDrawer('biography')}
              className="inline-flex items-center space-x-2 bg-accent text-white px-4 py-2 font-heading font-bold text-sm tracking-wider shadow-punk self-start"
            >
              <Edit3 className="w-4 h-4" />
              <span>EDIT BIOGRAFI</span>
            </button>
          )}
        </div>

        {/* Hero Band Shot & Lead Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative">
            <div className="border-4 border-text shadow-punk-lg overflow-hidden bg-surface-subtle">
              <img
                src={formatImageUrl(bio.imageUrl) || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"}
                alt={bio.imageAlt || bio.heading}
                className="w-full aspect-[4/3] object-cover filter contrast-125"
              />
            </div>
            <div className="absolute -bottom-3 -right-3">
              <span className="tape-badge text-sm sm:text-base">EST. 2011 • INDONESIA</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-wordmark text-text tracking-wider">
              {bio.heading}
            </h2>
            <div className="text-text/90 leading-relaxed text-base space-y-4">
              {renderMarkdown(bio.bodyMarkdown)}
            </div>
          </div>
        </div>

        {/* Member Profiles */}
        {bio.members && bio.members.length > 0 && (
          <div className="space-y-6 pt-8 border-t-2 border-border">
            <div className="text-center space-y-2">
              <span className="tape-badge-red text-xs">TRIO REBEL CREW</span>
              <h2 className="text-3xl sm:text-4xl font-wordmark text-text tracking-wider">
                PERSONIL BAND
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {bio.members.map((member: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-surface border-2 border-border p-6 shadow-punk text-center space-y-4 group hover:border-accent transition-colors"
                >
                  <div className="w-24 h-24 mx-auto bg-surface-subtle border-2 border-border rounded-full flex items-center justify-center overflow-hidden">
                    {member.photoUrl ? (
                      <img src={formatImageUrl(member.photoUrl)} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-10 h-10 text-muted group-hover:text-accent transition-colors" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-wordmark text-text tracking-wide group-hover:text-accent transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-accent font-heading font-bold uppercase tracking-widest mt-1">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones Timeline */}
        <div className="space-y-8 pt-8 border-t-2 border-border">
          <div className="text-center space-y-2">
            <span className="tape-badge text-xs">TIMELINE PERJALANAN</span>
            <h2 className="text-3xl sm:text-4xl font-wordmark text-text tracking-wider">
              JEJAK LANGKAH & TONGGAK SEJARAH
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-surface border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-accent transition-colors shadow-punk"
              >
                <div className="w-20 shrink-0 text-center sm:text-left">
                  <span className="text-2xl font-black font-wordmark text-accent">{m.year}</span>
                </div>
                <div className="border-l-2 border-border pl-4 sm:pl-6 space-y-1">
                  <h4 className="text-lg font-wordmark text-text tracking-wide">{m.title}</h4>
                  <p className="text-sm text-muted">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
