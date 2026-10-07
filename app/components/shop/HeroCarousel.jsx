"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const INTERVAL = 6000;

const subscribeMotion = (cb) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function SlideArt({ slide, first }) {
  // Wide flat-illustration backdrop; the focal point sits on the right so the
  // copy on the left stays legible. Phones crop towards the focal point.
  return (
    <Image
      src={slide.image}
      alt=""
      fill
      unoptimized
      sizes="(min-width: 1440px) 1408px, 100vw"
      preload={first}
      className="object-cover object-[82%_center] sm:object-center"
    />
  );
}

export default function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, getMotion, () => true);
  const focusWithin = useRef(false);
  const count = slides.length;

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);
  const playing = !reduced && !userPaused && !hovered;

  useEffect(() => {
    if (!playing) return undefined;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearTimeout(t);
  }, [playing, index, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative overflow-hidden rounded-lg bg-brand-deep"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => !focusWithin.current && setHovered(false)}
      onFocus={() => {
        focusWithin.current = true;
        setHovered(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          focusWithin.current = false;
          setHovered(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div className="relative h-[268px] sm:h-[280px] lg:h-[320px]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${s.title}`}
            aria-hidden={i !== index}
            inert={i !== index}
            className={`absolute inset-0 bg-brand-deep transition-opacity duration-500 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <SlideArt slide={s} first={i === 0} />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,79,40,0.94)_0%,rgba(10,79,40,0.74)_55%,rgba(10,79,40,0.2)_100%)] sm:bg-[linear-gradient(90deg,rgba(10,79,40,0.94)_0%,rgba(10,79,40,0.8)_38%,rgba(10,79,40,0)_68%)]" />
            {/* Mobile: copy sits above a reserved 52px control strip so the CTA is never covered. */}
            <div className="on-dark relative flex h-full max-w-2xl flex-col justify-center px-5 pb-12 pt-4 sm:px-10 sm:pb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-harvest">
                <span className="sm:hidden">{s.eyebrowShort ?? s.eyebrow}</span>
                <span className="hidden sm:inline">{s.eyebrow}</span>
              </p>
              <h2 className="mt-1.5 font-display text-[22px] font-extrabold leading-[1.15] text-white sm:text-[32px] lg:text-[38px]">
                {s.title}
              </h2>
              <p className="mt-2 max-w-md text-[13px] text-white/90 sm:text-[15px]">
                <span className="sm:hidden">{s.textShort ?? s.text}</span>
                <span className="hidden sm:inline">{s.text}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={s.href} className="btn btn-cart h-11 px-4 text-[14px] sm:h-10 sm:text-sm" tabIndex={i === index ? 0 : -1}>
                  {s.cta}
                  <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </Link>
                {s.secondary && (
                  <Link
                    href={s.secondary.href}
                    className="btn hidden h-10 border border-white/40 px-4 text-white hover:bg-white/10 sm:inline-flex"
                    tabIndex={i === index ? 0 : -1}
                  >
                    {s.secondary.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-0 top-1/2 hidden h-16 w-9 -translate-y-1/2 items-center justify-center rounded-r-md bg-white/85 text-ink shadow hover:bg-white md:flex"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-0 top-1/2 hidden h-16 w-9 -translate-y-1/2 items-center justify-center rounded-l-md bg-white/85 text-ink shadow hover:bg-white md:flex"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </button>

      {/* Controls: bottom-right strip on phones (44px targets), centred pill on larger screens. */}
      <div className="absolute bottom-1 right-1 flex items-center sm:bottom-2.5 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:gap-0.5 sm:rounded-full sm:bg-black/25 sm:px-1.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            aria-current={i === index ? "true" : undefined}
            className="group flex h-11 w-11 items-center justify-center sm:h-6 sm:w-6"
          >
            <span
              aria-hidden="true"
              className={`block h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-harvest" : "w-1.5 bg-white/70 group-hover:bg-white"}`}
            />
          </button>
        ))}
        {!reduced && (
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
            className="flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/20 sm:h-6 sm:w-6"
          >
            {userPaused ? <Play className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" />}
          </button>
        )}
      </div>
    </section>
  );
}
