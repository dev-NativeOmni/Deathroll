import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../../context/SiteContext';
import { useAdmin } from '../../context/AdminContext';
import { Play, Pause, SkipForward, Volume2, VolumeX, Music, Disc, Edit3, Settings, AlertCircle } from 'lucide-react';
import { formatAudioUrl } from '../../utils/imageUtils';

const DEFAULT_TRACKS = [
  { id: 'track-1', title: "Pembakar Api Perlawanan", album: "Suara Dari Jalanan", bpm: 180 },
  { id: 'track-2', title: "Suara Dari Jalanan", album: "Suara Dari Jalanan", bpm: 175 },
  { id: 'track-3', title: "Rebel Soul", album: "Rebel Soul Anthem EP", bpm: 165 },
  { id: 'track-4', title: "Tanah Merdeka", album: "Tanah Merdeka", bpm: 170 },
  { id: 'track-5', title: "Laskar Berbisa", album: "Tanah Merdeka", bpm: 185 }
];

export const AudioPlayerBar: React.FC = () => {
  const { content, openDrawer } = useSite();
  const { isAdmin, isPreviewMode } = useAdmin();

  const tracks = (content.audioPlayer?.tracks && content.audioPlayer.tracks.length > 0)
    ? content.audioPlayer.tracks
    : DEFAULT_TRACKS;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElemRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const safeIndex = currentTrackIndex < tracks.length ? currentTrackIndex : 0;
  const currentTrack = tracks[safeIndex] || DEFAULT_TRACKS[0];

  // Resolve audio URL properly using formatAudioUrl
  const resolvedAudioUrl = currentTrack.audioUrl ? formatAudioUrl(currentTrack.audioUrl) : null;

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
      const rootFreq = [164.81, 196.00, 220.00, 146.83][safeIndex % 4];
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
    setAudioError(false);
    if (resolvedAudioUrl && audioElemRef.current) {
      audioElemRef.current.load();
      if (isPlaying) {
        audioElemRef.current.play().catch((err) => {
          console.warn('Direct audio play failed, falling back to synth:', err);
          setAudioError(true);
        });
      }
    }
  }, [resolvedAudioUrl, safeIndex]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (resolvedAudioUrl && !audioError && audioElemRef.current) {
          const duration = audioElemRef.current.duration || 1;
          const cur = audioElemRef.current.currentTime || 0;
          setProgress((cur / duration) * 100);
          if (cur >= duration) {
            handleNext();
          }
        } else {
          setProgress((prev) => {
            if (prev >= 100) {
              setCurrentTrackIndex((idx) => (idx + 1) % tracks.length);
              return 0;
            }
            playPunkChords();
            return prev + 1.2;
          });
        }
      }, 400);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioElemRef.current) {
        audioElemRef.current.pause();
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, safeIndex, isMuted, resolvedAudioUrl, audioError, tracks.length]);

  const togglePlay = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);

    if (nextPlay && resolvedAudioUrl && audioElemRef.current) {
      audioElemRef.current.play().catch((e) => {
        console.warn('Audio play error, fallback to synth:', e);
        setAudioError(true);
      });
    } else if (!nextPlay && audioElemRef.current) {
      audioElemRef.current.pause();
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setProgress(0);
    setAudioError(false);
    if (audioElemRef.current) {
      audioElemRef.current.currentTime = 0;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#121212]/95 border-t-2 border-accent backdrop-blur-md text-text shadow-2xl py-2 px-4">
      {resolvedAudioUrl && (
        <audio
          ref={audioElemRef}
          src={resolvedAudioUrl}
          muted={isMuted}
          onEnded={handleNext}
          onError={() => {
            console.warn('Audio stream error on URL:', resolvedAudioUrl);
            setAudioError(true);
          }}
        />
      )}

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

              {/* Admin Quick Edit Button */}
              {isAdmin && !isPreviewMode && (
                <button
                  onClick={() => openDrawer('audio')}
                  className="inline-flex items-center space-x-1 text-[10px] uppercase font-bold bg-amber-950 text-amber-300 border border-amber-600 px-1.5 py-0.5 hover:bg-accent hover:text-white transition-colors ml-2"
                  title="Klik untuk mengubah lagu preview audio"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                  <span>Edit Track</span>
                </button>
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
