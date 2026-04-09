'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib';

import { ArrowIcon } from '../icon/icons/Arrow';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    let el: HTMLElement | null = sentinelRef.current?.parentElement ?? null;
    while (el) {
      if (el.scrollTop > 0) {
        el.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      el = el.parentElement;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-0 w-0" />
      <button
        type="button"
        onClick={handleClick}
        aria-label="상단으로 이동"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        disabled={!visible}
        className={cn(
          'fixed right-4 bottom-24 flex size-[52px] cursor-pointer items-center justify-center rounded-full bg-white shadow-lg transition-opacity duration-200 md:right-8',
          visible ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <ArrowIcon direction="up" variant="default" />
      </button>
    </>
  );
}
