'use client';

import { useLayoutEffect, useRef } from 'react';
import { useAnimatedProgress } from '@/hooks/useAnimatedProgress';

import { MIN_STEP_DURATION_MS, PROGRESS_ANIMATION_DURATION_MS } from '@/constants/animation';

interface ProgressBarProps {
  value: number; // 현재 값
  max?: number; // 최대 값 (기본값 100)
  /** value가 0→max 전체를 채울 때의 기준 시간. 실제 재생 시간은 이동 거리(|Δvalue|)에 비례 */
  durationMs?: number;
}

export const ProgressBar = ({
  value = 0,
  max = 100,
  durationMs = PROGRESS_ANIMATION_DURATION_MS,
}: ProgressBarProps) => {
  const finiteMax = Number.isFinite(max) && max > 0 ? max : 100;
  const finiteValue = Number.isFinite(value) ? value : 0;
  const clampedTarget = Math.min(Math.max(0, finiteValue), finiteMax);

  const progressRef = useRef<HTMLProgressElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const valueRef = useAnimatedProgress(
    clampedTarget,
    { max: finiteMax, durationMs, minStepDurationMs: MIN_STEP_DURATION_MS },
    (next, { percent }) => {
      const el = progressRef.current;
      if (el) el.value = next;
      const label = labelRef.current;
      if (label) {
        const percentage = Math.round(percent);
        label.textContent = `${percentage}%`;
      }
    },
  );

  // 부모 리렌더로 React가 <progress value={0}> 등을 다시 깔아도, 실제 진행값으로 복구
  // clampedTarget과 valueRef.current가 변경될 때마다 실행
  useLayoutEffect(() => {
    const el = progressRef.current;
    if (el) el.value = valueRef.current;
  }, [clampedTarget, valueRef]);

  return (
    <div className="flex w-full max-w-[248px] items-center gap-3">
      <progress
        ref={progressRef}
        className="h-2 w-full appearance-none rounded-full bg-gray-200 dark:bg-gray-700 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-orange-500 dark:[&::-moz-progress-bar]:bg-orange-300 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray-200 dark:[&::-webkit-progress-bar]:bg-gray-700 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-orange-500 dark:[&::-webkit-progress-value]:bg-orange-300"
        max={finiteMax}
        value={0}
        suppressHydrationWarning
        aria-label="progress bar"
      />

      <span
        ref={labelRef}
        className="min-w-[36px] text-[14px] font-bold text-orange-500 tabular-nums dark:text-orange-300"
      >
        0%
      </span>
    </div>
  );
};

export default ProgressBar;
