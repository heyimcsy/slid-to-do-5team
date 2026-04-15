'use client';

import { useLayoutEffect, useRef } from 'react';
import { useAnimatedProgress } from '@/hooks/useAnimatedProgress';
import { cn } from '@/lib';

import { PROGRESS_ANIMATION_DURATION_MS } from '@/constants/animation';

interface DonutProgressProps {
  value: number;
  color?: string;
  trackColor?: string;
  responsive?: boolean;
  ariaLabel?: string;
  className?: string;
  /** 0→100 전체 스윕 기준 시간 (ms). 실제 재생은 |Δvalue|에 비례 */
  durationMs?: number;
}
// 반지름(radius)
const R = 80;
// 원주(원의 둘레)
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * 도넛 형태의 진행률 표시 컴포넌트
 * 진행 방향은 12시 기준 반시계 방향입니다.
 *
 * @param value - 진행률 (0 ~ 100)
 * @param color - 진행 arc 색상 (기본값: '#FFFFFF')
 * @param trackColor - 배경 트랙 색상 (기본값: '#009D97')
 * @param responsive - true일 경우 lg 브레이크포인트에서 size-46으로 확대 (기본값: false)
 *
 * @remarks
 * **SVG 크기 계산 공식**
 * - `viewBox 한 변` = `r * 2 + strokeWidth` = 80 * 2 + 24 = **184**
 * - `center (cx, cy)` = `viewBox / 2` = 184 / 2 = **92**
 * - `r` = 반지름. strokeWidth의 절반만큼 안쪽으로 들어오므로 원이 잘리지 않음
 * - `strokeWidth` = 선 두께. 양쪽으로 각 절반씩 퍼지므로 viewBox에 반드시 포함해야 함
 *
 * @constructor seoyoon
 */

export function DonutProgress({
  value,
  color = '#FFFFFF',
  trackColor = '#009D97',
  responsive = false,
  className,
  durationMs = PROGRESS_ANIMATION_DURATION_MS,
}: Readonly<DonutProgressProps>) {
  const circleRef = useRef<SVGCircleElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLProgressElement>(null);

  const clamped = Math.min(100, Math.max(0, value));

  const valueRef = useAnimatedProgress(
    clamped,
    { max: 100, durationMs, minStepDurationMs: 90 },
    (next, { percent }) => {
      const c = circleRef.current;
      if (c) {
        c.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - next / 100));
      }
      rootRef.current?.setAttribute('aria-valuenow', String(Math.round(percent)));
      const p = progressRef.current;
      if (p) p.value = next;
    },
  );

  useLayoutEffect(() => {
    const v = valueRef.current;
    const p = progressRef.current;
    if (p) p.value = v;
    const c = circleRef.current;
    if (c) {
      c.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - v / 100));
    }
    rootRef.current?.setAttribute('aria-valuenow', String(Math.round(v)));
  }, [clamped, valueRef]);

  return (
    <div
      ref={rootRef}
      className={cn('size-27', responsive && 'lg:size-46', className)}
      role="progressbar"
      aria-label="donut progress"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <progress
        ref={progressRef}
        value={0}
        max={100}
        className="sr-only"
        suppressHydrationWarning
      />
      <svg viewBox="0 0 184 184" width="100%" height="100%">
        <circle cx="92" cy="92" r={R} fill="none" stroke={trackColor} strokeWidth="24" />
        <circle
          ref={circleRef}
          aria-hidden="true"
          cx="92"
          cy="92"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="24"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform="translate(184 0) scale(-1 1) rotate(-90 92 92)"
        />
      </svg>
    </div>
  );
}
