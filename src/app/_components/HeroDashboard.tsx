'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';

export function HeroDashboard() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // 스크롤에 따라 scale 0.6 → 1.15
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.6, 1.15]);
  // 스크롤에 따라 opacity 0 → 1
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  // 스크롤에 따라 borderRadius 24px → 0px
  const borderRadius = useTransform(scrollYProgress, [0, 0.5], [24, 0]);

  return (
    <div ref={ref} className="w-full max-w-332 min-w-80 pt-18.5">
      <motion.div style={{ scale, opacity, borderRadius }} className="overflow-hidden">
        <Image
          src="/images/hero-dashboard.svg"
          alt="슬리드투두 대시보드 이미지"
          width={1200}
          height={720}
          className="h-full w-full object-cover"
          priority
        />
      </motion.div>
    </div>
  );
}
