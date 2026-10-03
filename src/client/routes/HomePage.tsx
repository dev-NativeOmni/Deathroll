import React from 'react';
import { HeroCarousel } from '../components/hero/HeroCarousel';
import { UpcomingShows } from '../components/tour/UpcomingShows';
import { FeaturedDiscography } from '../components/discography/FeaturedDiscography';
import { VideoGallery } from '../components/videos/VideoGallery';
import { MerchandiseShowcase } from '../components/merch/MerchandiseShowcase';
import { LatestNews } from '../components/news/LatestNews';
import { BiographyPreview } from '../components/biography/BiographyPreview';
import { RebelShoutbox } from '../components/shoutbox/RebelShoutbox';
import { Mail, CheckCircle2 } from 'lucide-react';

type HomeProps = {
  navigate: (path: string) => void;
};

export const HomePage: React.FC<HomeProps> = ({ navigate }) => {
  const [emailSubscribed, setEmailSubscribed] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <div>
      {/* 1. Hero Carousel */}
      <HeroCarousel navigate={navigate} />

      {/* 2. Upcoming Shows */}
      <UpcomingShows navigate={navigate} limit={4} />

      {/* 3. Featured Discography */}
      <FeaturedDiscography navigate={navigate} limit={4} />

      {/* 4. Video Clips & Live Stage Footage (Item 4) */}
      <VideoGallery />

      {/* 5. Official Merchandise Drop (Item 3) */}
      <MerchandiseShowcase />

      {/* 6. Latest News */}
      <LatestNews navigate={navigate} limit={3} />

      {/* 7. Biography Preview */}
      <BiographyPreview navigate={navigate} />

      {/* 8. Rebel Shoutbox & Fan Guestbook (Item 5) */}
      <RebelShoutbox />

      {/* 9. Outsiders / Fan Club Newsletter Banner */}
      <section className="py-16 bg-surface-subtle border-b-2 border-border relative">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-block">
            <span className="tape-badge-red text-xs">JOIN THE REBEL ALLIANCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-wordmark text-text tracking-wider">
            GABUNG JARINGAN MILITAN DEATHROLL
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto">
            Dapatkan akses awal ke tiket konser, info merchandise limited drop, dan kabar eksklusif langsung di email Anda.
          </p>

          {emailSubscribed ? (
            <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-300 p-4 max-w-md mx-auto flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-heading font-bold text-sm tracking-wide">
                TERIMA KASIH! ANDA TELAH TERDAFTAR DI JARINGAN KAMI.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2"
            >
              <div className="relative w-full">
                <Mail className="w-4 h-4 text-muted absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Masukkan alamat email Anda"
                  className="w-full bg-bg border border-border focus:border-accent text-text pl-9 pr-3 py-2.5 text-sm focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-accent text-white font-heading font-bold text-sm tracking-wider uppercase hover:bg-accent-hover transition-all shadow-punk shrink-0"
              >
                GABUNG
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
