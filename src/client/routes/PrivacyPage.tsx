import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

type PrivacyProps = {
  navigate: (path: string) => void;
};

export const PrivacyPage: React.FC<PrivacyProps> = ({ navigate }) => {
  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-muted hover:text-accent font-heading font-bold text-sm tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE BERANDA</span>
        </button>

        <div className="bg-surface border-2 border-border p-6 sm:p-10 shadow-punk-lg space-y-6">
          <div className="flex items-center space-x-3 border-b border-border pb-4">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-wordmark text-text tracking-wider">
                KEBIJAKAN PRIVASI
              </h1>
              <p className="text-xs text-muted font-heading uppercase">
                DEATHROLL OFFICIAL PRIVACY POLICY
              </p>
            </div>
          </div>

          <div className="text-text/90 leading-relaxed space-y-4 text-sm sm:text-base">
            <p>
              Website profil band <strong>DEATHROLL</strong> berkomitmen untuk menjaga privasi seluruh pengunjung dan pendengar setia kami. Halaman ini menjelaskan bagaimana data Anda dikelola pada website privat ini.
            </p>

            <h3 className="text-xl font-wordmark text-accent tracking-wide pt-2">
              1. Pengumpulan Data Pengunjung
            </h3>
            <p>
              Situs ini beroperasi secara mandiri. Kami tidak menggunakan pelacak iklan pihak ketiga (third-party tracking cookies) invasif. Informasi kontak yang dikirimkan via newsletter atau formulir hanya digunakan untuk komunikasi resmi band.
            </p>

            <h3 className="text-xl font-wordmark text-accent tracking-wide pt-2">
              2. Sesi Akses Admin
            </h3>
            <p>
              Cookie otentikasi yang digunakan untuk pengelola situs bertipe <code>HttpOnly</code> dan <code>SameSite=Strict</code> yang bertujuan menjaga keamanan mutasi data konten band. Token rahasia admin tidak pernah disimpan dalam bentuk teks biasa (hanya hash berstandar industri).
            </p>

            <h3 className="text-xl font-wordmark text-accent tracking-wide pt-2">
              3. Tautan Eksternal
            </h3>
            <p>
              Situs ini menyediakan tautan resmi ke platform musik dan media sosial (Spotify, Apple Music, YouTube, Instagram, Toko Merchandise). Kebijakan privasi platform masing-masing berlaku saat Anda mengunjungi layanan tersebut.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
