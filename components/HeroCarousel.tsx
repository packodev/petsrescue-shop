"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function HeroCarousel({ images }: { images: string[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Detect which slide is centered using IntersectionObserver
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const index = slideRefs.current.findIndex((s) => s === entry.target);
            if (index >= 0) setActiveIndex(index);
          }
        });
      },
      { root: scroller, threshold: [0.6] },
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, [images.length]);

  function scrollToIndex(index: number) {
    const slide = slideRefs.current[index];
    if (slide) slide.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function scrollBy(delta: number) {
    const next = Math.max(0, Math.min(images.length - 1, activeIndex + delta));
    scrollToIndex(next);
  }

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={scrollerRef}
        className="no-scrollbar flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overflow-y-hidden bg-cream-100 shadow-sm"
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="relative h-full w-full flex-none snap-start"
          >
            <Image
              src={src}
              alt={`Puzzle design ${i + 1}`}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        ))}
      </div>

      {/* Arrows (desktop only) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => scrollBy(-1)}
            disabled={activeIndex === 0}
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/90 text-ink-800 shadow-sm transition hover:bg-cream-50 disabled:opacity-30 md:flex"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => scrollBy(1)}
            disabled={activeIndex === images.length - 1}
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/90 text-ink-800 shadow-sm transition hover:bg-cream-50 disabled:opacity-30 md:flex"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-ink-800" : "w-1.5 bg-ink-300 hover:bg-ink-500"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
