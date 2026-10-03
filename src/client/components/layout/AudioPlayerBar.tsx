import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX, Music, Disc } from 'lucide-react';

const TRACKS = [
  { title: "Pembakar Api Perlawanan", album: "Suara Dari Jalanan", bpm: 180 },
  { title: "Suara Dari Jalanan", album: "Suara Dari Jalanan", bpm: 175 },
  { title: "Rebel Soul", album: "Rebel Soul Anthem EP", bpm: 165 },
  { title: "Tanah Merdeka", album: "Tanah Merdeka", bpm: 170 },
  { title: "Laskar Berbisa", album: "Tanah Merdeka", bpm: 185 }
];

export const AudioPlayerBar: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  // Punk rock synth audio generator using Web Audio API when played
  const playPunkChords = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (isMuted) return;

      // Create a gritty power chord sound (E5 / G5 / A5 progression)
      const rootFreq = [164.81, 196.00, 220.00, 146.83][currentTrackIndex % 4];
      const fifthFreq = rootFreq * 1.5;
      const octaveFreq = rootFreq * 2;

      [rootFreq, fifthFreq, octaveFreq].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const distortion = ctx.createWaveShaper();

        // Distortion curve
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i * 2) / 256 - 1;
          curve[i] = ((3 + 20) * x * 20 * (Math.PI / 180)) / (Math.PI + 20 * Math.abs(x));
        }
        distortion.curve = curve;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc.connect(distortion);
        distortion.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.38);
      });
    } catch (e) {
      // Ignore if browser restricts autoplay
    }
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentTrackIndex((idx) => (idx + 1) % TRACKS.length);
            return 0;
          }
          playPunkChords();
          return prev + 1.2;
        });
      }, 400);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentTrackIndex, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#121212]/95 border-t-2 border-accent backdrop-blur-md text-text shadow-2xl py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 bg-accent text-white flex items-center justify-center shrink-0 border border-text">
            <Disc className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold text-accent tracking-wider font-heading">
                PREVIEW TRACK
              </span>
              {isPlaying && (
                <span className="flex space-x-0.5 items-end h-3">
                  <span className="w-0.5 h-3 bg-accent animate-pulse"></span>
                  <span className="w-0.5 h-2 bg-accent animate-pulse delay-75"></span>
                  <span className="w-0.5 h-3.5 bg-accent animate-pulse delay-150"></span>
                </span>
              )}
            </div>
            <div className="font-bold text-sm text-text truncate">
              {currentTrack.title}
            </div>
            <div className="text-[11px] text-muted truncate">
              DEATHROLL • {currentTrack.album}
            </div>
          </div>
        </div>

        {/* Player Controls & Progress */}
        <div className="flex-1 max-w-md hidden sm:flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-1">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-transform hover:scale-105"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={handleNext}
              className="p-1 text-muted hover:text-text transition-colors"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-surface-subtle h-1.5 rounded-full overflow-hidden border border-border">
            <div
              className="bg-accent h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Mobile controls & Volume */}
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlay}
            className="sm:hidden w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-muted hover:text-text transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-accent" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
