'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

import { MIN_STEP_DURATION_MS, PROGRESS_ANIMATION_DURATION_MS } from '@/constants/animation';

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
 * requestAnimationFrame + ref 기반 진행값 보간. 루프 중 React state 갱신 없음.
 * onFrame은 ref로 최신 참조를 유지하므로 매 렌더 새 함수를 넘겨도 effect 의존성은 안 늘어남.
 */
export function useAnimatedProgress(
  target: number,
  options: UseAnimatedProgressOptions | undefined,
  onFrame: (value: number, ctx: AnimatedProgressFrameContext) => void,
) {
  const valueRef = useRef(0);
  const onFrameRef = useRef(onFrame);
  const easeRef = useRef(options?.ease ?? easeOutCubic);

  useLayoutEffect(() => {
    onFrameRef.current = onFrame;
    easeRef.current = options?.ease ?? easeOutCubic;
  }, [onFrame, options?.ease]);

  const max = options?.max ?? 100;
  const safeMax = max > 0 ? max : 100;
  const durationMs = options?.durationMs ?? PROGRESS_ANIMATION_DURATION_MS;
  const minStepDurationMs = options?.minStepDurationMs ?? MIN_STEP_DURATION_MS;

  const clampedTarget = Math.min(Math.max(0, target), safeMax);

  useEffect(() => {
    let frameId: number;
    const from = valueRef.current;
    const to = clampedTarget;
    if (from === to) return;

    const delta = Math.abs(to - from);
    const spanMs = safeMax <= 0 ? durationMs : (delta / safeMax) * durationMs;
    const activeDurationMs = Math.min(durationMs, Math.max(minStepDurationMs, spanMs));

    const startTime = performance.now();
    const ease = easeRef.current;

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / activeDurationMs);
      const next = from + (to - from) * ease(t);
      valueRef.current = next;
      const percent = safeMax === 0 ? 0 : (next / safeMax) * 100;
      onFrameRef.current(next, { max: safeMax, percent });

      if (t < 1) frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [clampedTarget, durationMs, minStepDurationMs, safeMax]);

  return valueRef;
}
