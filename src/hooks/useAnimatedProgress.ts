'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { MIN_STEP_DURATION_MS, PROGRESS_ANIMATION_DURATION_MS } from '@/constants/animation';

/** 공개 옵션에서 온 ms — NaN/±∞/0 이하면 fallback (rAF에서 t→1 보장) */
function normalizePositiveMs(value: number | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return value;
}

/** t ∈ [0,1] → ease-out cubic */
export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

export type AnimatedProgressFrameContext = {
  max: number;
  /** 0 ~ 100 스케일이 아니라 (value/max)*100 */
  percent: number;
};

export type UseAnimatedProgressOptions = {
  max?: number;
  /** value가 0→max 전체를 채울 때의 기준 시간. 실제 재생 시간은 |Δvalue|/max에 비례 */
  durationMs?: number;
  minStepDurationMs?: number;
  ease?: (t: number) => number;
};

/**
 * @description 전정 장애, ADHD 등 과도한 움직임이 불편한 사용자를 위해 media query를 사용해 감지
 * @returns boolean
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * requestAnimationFrame + ref 기반 진행값 보간. 루프 중 React state 갱신 없음.
 * onFrame은 ref로 최신 참조를 유지하므로 매 렌더 새 함수를 넘겨도 effect 의존성은 안 늘어남.
 *
 * - prefers-reduced-motion: reduce 이면 rAF 없이 목표값으로 즉시 반영
 * - 탭 hidden 시 rAF 중단, visible 시 남은 구간만큼 재개
 */
export function useAnimatedProgress(
  target: number,
  options: UseAnimatedProgressOptions | undefined,
  onFrame: (value: number, ctx: AnimatedProgressFrameContext) => void,
) {
  const valueRef = useRef(0);
  const onFrameRef = useRef(onFrame);
  const easeRef = useRef(options?.ease ?? easeOutCubic);
  const frameIdRef = useRef(0);
  const clampedTargetRef = useRef(0);
  const [resumeEpoch, setResumeEpoch] = useState(0);

  useLayoutEffect(() => {
    onFrameRef.current = onFrame;
    easeRef.current = options?.ease ?? easeOutCubic;
  }, [onFrame, options?.ease]);

  const max = options?.max ?? 100;
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const durationMs = normalizePositiveMs(options?.durationMs, PROGRESS_ANIMATION_DURATION_MS);
  const minStepDurationMs = normalizePositiveMs(options?.minStepDurationMs, MIN_STEP_DURATION_MS);

  const finiteTarget = Number.isFinite(target) ? target : 0;
  const clampedTarget = Math.min(Math.max(0, finiteTarget), safeMax);

  useLayoutEffect(() => {
    clampedTargetRef.current = clampedTarget;
  }, [clampedTarget]);

  useEffect(() => {
    let from = valueRef.current;
    if (!Number.isFinite(from)) {
      from = 0;
      valueRef.current = 0;
    }
    const to = clampedTarget;
    if (!Number.isFinite(to)) {
      valueRef.current = 0;
      onFrameRef.current(0, { max: safeMax, percent: 0 });
      return;
    }
    if (from === to) return;

    // prefers-reduced-motion 이 true면 rAF 없이 즉시 목표값 + onFrame 1회로 처리
    if (prefersReducedMotion()) {
      valueRef.current = to;
      const percent = safeMax === 0 ? 0 : (to / safeMax) * 100;
      onFrameRef.current(to, { max: safeMax, percent });
      return;
    }

    const delta = Math.abs(to - from);
    const spanMs = safeMax <= 0 ? durationMs : (delta / safeMax) * durationMs;
    const activeDurationMsRaw = Math.min(durationMs, Math.max(minStepDurationMs, spanMs));
    const activeDurationMs =
      Number.isFinite(activeDurationMsRaw) && activeDurationMsRaw > 0
        ? activeDurationMsRaw
        : Math.min(durationMs, minStepDurationMs);

    const startTime = performance.now();
    const ease = easeRef.current;

    const step = (now: number) => {
      // 가시성이 hidden 이면 rAF 중단
      if (document.visibilityState === 'hidden') {
        return;
      }

      const t = Math.min(1, (now - startTime) / activeDurationMs);
      const nextRaw = from + (to - from) * ease(t);
      const next = Number.isFinite(nextRaw) ? nextRaw : to;
      valueRef.current = next;
      const percent = safeMax === 0 ? 0 : (next / safeMax) * 100;
      onFrameRef.current(next, { max: safeMax, percent });

      if (t < 1) {
        frameIdRef.current = requestAnimationFrame(step);
      }
    };

    frameIdRef.current = requestAnimationFrame(step);

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(frameIdRef.current);
        return;
      }
      const goal = clampedTargetRef.current;
      if (Math.abs(valueRef.current - goal) > 1e-6) {
        setResumeEpoch((e) => e + 1);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [clampedTarget, durationMs, minStepDurationMs, safeMax, resumeEpoch]);

  return valueRef;
}
