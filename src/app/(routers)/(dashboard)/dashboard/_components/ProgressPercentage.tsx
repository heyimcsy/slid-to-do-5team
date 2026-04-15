'use client';

import { cn } from '@/lib';

import { MIN_STEP_DURATION_MS, PROGRESS_ANIMATION_DURATION_MS } from '@/constants/animation';

import { AnimatedNumber } from '@/components/common/AnimatedNumber';

/**
 * @param value - 진행률 값
 * @param max - 최대 값
 * @param durationMs - 애니메이션 지속 시간
 * @param minStepDurationMs - 최소 지속 시간
 * @param className - 클래스 이름
 */
interface ProgressPercentageProps {
  value: number;
  max?: number;
  durationMs?: number;
  minStepDurationMs?: number;
  className?: string;
}

/**
 * 퍼센트 숫자만 표시하고, `after:content-['%']`로 %는 스타일로 붙임.
 * DonutProgress와 동일한 `durationMs`/`minStepDurationMs`를 넘기면 애니메이션이 맞는다.
 */
export function ProgressPercentage({
  value,
  max = 100,
  durationMs = PROGRESS_ANIMATION_DURATION_MS,
  minStepDurationMs = MIN_STEP_DURATION_MS,
  className,
}: ProgressPercentageProps) {
  return (
    <h5
      className={cn(
        "display-lg-bold md:display-lg-bold lg:display-xl-bold after:font-xl-medium md:after:font-xl-medium lg:after:font-3xl-medium font-features-['ss01','ss02','ss06','ss08'] after:content-['%']",
        className,
      )}
    >
      <AnimatedNumber
        value={value}
        max={max}
        durationMs={durationMs}
        minStepDurationMs={minStepDurationMs}
      />
    </h5>
  );
}
