'use client';

import { useLayoutEffect, useRef } from 'react';
import { useAnimatedProgress } from '@/hooks/useAnimatedProgress';
import { cn } from '@/lib';

import { PROGRESS_ANIMATION_DURATION_MS } from '@/constants/animation';

interface AnimatedNumberProps {
  value: number;
  max?: number;
  durationMs?: number;
  minStepDurationMs?: number;
  className?: string;
}

/**
 * value를 0 -> target으로 보간해서 숫자 텍스트만 업데이트하는 공통 컴포넌트.
 * 루프 중 setState를 쓰지 않고 ref.textContent를 업데이트한다.
 */
export function AnimatedNumber({
  value,
  max = 100,
  durationMs = PROGRESS_ANIMATION_DURATION_MS,
  minStepDurationMs = 90,
  className,
}: AnimatedNumberProps) {
  const clamped = Math.min(max, Math.max(0, value));
  const numberRef = useRef<HTMLSpanElement>(null);
  /** useAnimatedProgress 내부 safeMax와 동일 — 퍼센트 스케일 맞춤 */
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;

  const valueRef = useAnimatedProgress(
    clamped,
    { max, durationMs, minStepDurationMs },
    (_next, { percent }) => {
      const el = numberRef.current;
      if (el) el.textContent = String(Math.round(percent));
    },
  );

  useLayoutEffect(() => {
    const el = numberRef.current;
    if (!el) return;
    const percent = safeMax === 0 ? 0 : (valueRef.current / safeMax) * 100;
    el.textContent = String(Math.round(percent));
  }, [clamped, valueRef, safeMax]);

  return (
    <span ref={numberRef} className={cn(className)} suppressHydrationWarning>
      0
    </span>
  );
}
