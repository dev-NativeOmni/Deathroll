import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../../context/SiteContext';
import { useAdmin } from '../../context/AdminContext';
import { formatImageUrl } from '../../utils/imageUtils';
import { ChevronLeft, ChevronRight, Edit3, Calendar, ArrowRight, Play } from 'lucide-react';

type HeroProps = {
  navigate: (path: string) => void;
};

export const HeroCarousel: React.FC<HeroProps> = ({ navigate }) => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = content.heroSlides.filter((s) => s.published);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  if (slides.length === 0) {
    return (
      <div className="relative bg-surface py-28 text-center border-b-2 border-border">
        <h1 className="text-4xl font-wordmark tracking-wider text-text">{content.site.bandName}</h1>
        <p className="text-muted mt-2">{content.site.tagline}</p>
        {isAdmin && !isPreviewMode && (
          <button
            onClick={() => openDrawer('hero')}
            className="mt-4 px-4 py-2 bg-accent text-white font-bold inline-flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Tambah Slide Hero</span>
          </button>
        )}
      </div>
    );
  }

  const currentSlide = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleCtaClick = (href?: string) => {
    if (!href) return;
    if (href.startsWith('http://') || href.startsWith('https://')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(href);
    }
  };

  return (
    <section
      className="relative min-h-[550px] sm:min-h-[640px] lg:min-h-[720px] bg-bg overflow-hidden flex items-center border-b-4 border-border"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-label="Hero Carousel"
    >
      {/* Background Images with smooth fade */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={formatImageUrl(slide.imageUrl)}
            alt={slide.imageAlt || slide.title}
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-125 scale-105 transform animate-none"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent"></div>
          <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
        </div>
      ))}

      {/* Admin Quick Edit Button */}
      {isAdmin && !isPreviewMode && (
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={() => openDrawer('hero')}
            className="flex items-center space-x-2 bg-accent text-white px-3 py-1.5 font-heading font-bold text-xs uppercase shadow-punk tracking-wider hover:bg-accent-hover transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Hero Slides ({slides.length})</span>
          </button>
        </div>
      )}

      {/* Slide Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl space-y-6">
          <div className="inline-block">
            <span className="tape-badge text-sm sm:text-base">
              OFFICIAL RELEASE & TOUR
            </span>
          </div>

          <h1 className="text-[clamp(2rem,8vw,4.5rem)] font-wordmark text-text tracking-wider leading-[0.95] drop-shadow-md">
            {currentSlide.title}
          </h1>

          {currentSlide.subtitle && (
            <p className="text-sm sm:text-2xl font-heading font-bold text-muted uppercase tracking-wide border-l-4 border-accent pl-3 sm:pl-4">
              {currentSlide.subtitle}
            </p>
          )}

          {currentSlide.ctaLabel && currentSlide.ctaHref && (
            <div className="pt-2 sm:pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => handleCtaClick(currentSlide.ctaHref)}
                className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 bg-accent text-white font-heading font-bold text-base sm:text-xl tracking-wider hover:bg-accent-hover transition-all transform hover:-translate-y-1 shadow-punk flex items-center justify-center space-x-3 group"
              >
                <span>{currentSlide.ctaLabel}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Slide Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 z-20 p-3 bg-surface/80 hover:bg-accent text-text hover:text-white border border-border hover:border-accent transition-all hidden sm:flex items-center justify-center"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 z-20 p-3 bg-surface/80 hover:bg-accent text-text hover:text-white border border-border hover:border-accent transition-all hidden sm:flex items-center justify-center"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots / Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 transition-all duration-300 rounded-none border border-black ${
                  idx === currentIndex ? 'w-8 bg-accent' : 'w-3 bg-muted/60 hover:bg-muted'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
