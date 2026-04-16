'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export function FadeInSection({
  children,
  delay = 0.2,
  className,
  variant = 'slide',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: 'slide' | 'scale';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const initial = variant === 'scale' ? { opacity: 0, scale: 0.5 } : { opacity: 0, y: 50 };

  const animate = variant === 'scale' ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{ duration: variant === 'scale' ? 0.3 : 0.7, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
