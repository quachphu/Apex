import { useEffect, useRef } from 'react';
import { ArrowRight, Camera, Globe, X } from 'lucide-react';

const VIDEO_SOURCE =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4';

const FADE_DURATION_MS = 500;
const FADE_OUT_SECONDS_REMAINING = 0.55;

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
];

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const cancelFade = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const fadeVideoTo = (targetOpacity: number) => {
    const video = videoRef.current;
    if (!video) return;

    cancelFade();

    const startOpacity = Number.parseFloat(video.style.opacity || '0');
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / FADE_DURATION_MS, 1);
      const nextOpacity = startOpacity + (targetOpacity - startOpacity) * progress;

      video.style.opacity = String(nextOpacity);

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(animate);
      } else {
        video.style.opacity = String(targetOpacity);
        frameRef.current = null;
      }
    };

    frameRef.current = window.requestAnimationFrame(animate);
  };

  const playVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
    } catch {
      // Autoplay may be blocked in unusual browser settings. The muted, playsInline
      // attributes keep this working in standard desktop and mobile browsers.
    }
  };

  const startFromBeginning = () => {
    const video = videoRef.current;
    if (!video) return;

    cancelFade();
    video.style.opacity = '0';

    window.setTimeout(() => {
      const activeVideo = videoRef.current;
      if (!activeVideo) return;

      activeVideo.currentTime = 0;
      fadingOutRef.current = false;
      void playVideo();
      fadeVideoTo(1);
    }, 100);
  };

  const handleLoadedData = () => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = '0';
    fadingOutRef.current = false;
    void playVideo();
    fadeVideoTo(1);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    const secondsRemaining = video.duration - video.currentTime;

    if (secondsRemaining <= FADE_OUT_SECONDS_REMAINING && !fadingOutRef.current) {
      fadingOutRef.current = true;
      fadeVideoTo(0);
    }
  };

  const handleEnded = () => {
    startFromBeginning();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = '0';
    void playVideo();

    return () => {
      cancelFade();
    };
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full translate-y-[17%] object-cover"
        src={VIDEO_SOURCE}
        muted
        autoPlay
        playsInline
        preload="auto"
        onLoadedData={handleLoadedData}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_45%,rgba(0,0,0,0.78)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/25 to-transparent" />

      <div className="relative z-20 px-6 py-6">
        <nav className="liquid-glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
          <div className="flex items-center gap-8">
            <a href="#home" className="flex items-center gap-2 text-lg font-semibold text-white">
              <Globe size={24} aria-hidden="true" />
              <span>Asme</span>
            </a>

            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-white transition-colors hover:text-white/80" type="button">
              Sign Up
            </button>
            <button className="liquid-glass rounded-full px-6 py-2 text-sm font-medium text-white" type="button">
              Login
            </button>
          </div>
        </nav>
      </div>

      <section className="relative z-10 flex flex-1 -translate-y-[20%] flex-col items-center justify-center px-6 py-12 text-center">
        <h1
          className="mb-8 whitespace-nowrap text-5xl tracking-tight text-white md:text-6xl lg:text-7xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Built for the curious
        </h1>

        <div className="w-full max-w-xl space-y-4">
          <form className="liquid-glass flex items-center gap-3 rounded-full py-2 pl-6 pr-2" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40"
            />
            <button className="rounded-full bg-white p-3 text-black transition-transform hover:scale-105" type="submit" aria-label="Submit email">
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </form>

          <p className="px-4 text-sm leading-relaxed text-white">
            Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
          </p>

          <button className="liquid-glass rounded-full px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5" type="button">
            Manifesto
          </button>
        </div>
      </section>

      <footer className="relative z-10 flex justify-center gap-4 pb-12">
        <a
          href="https://instagram.com"
          aria-label="Instagram (Camera)"
          className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
        >
          <Camera size={20} aria-hidden="true" />
        </a>
        <a
          href="https://twitter.com"
          aria-label="X (Twitter)"
          className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
        >
          <X size={20} aria-hidden="true" />
        </a>
        <a
          href="https://example.com"
          aria-label="Website"
          className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"
        >
          <Globe size={20} aria-hidden="true" />
        </a>
      </footer>
    </main>
  );
}

export default App;
