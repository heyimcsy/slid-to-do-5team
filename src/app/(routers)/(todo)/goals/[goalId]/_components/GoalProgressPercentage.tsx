'use client';

import { GOALS_TEXT } from '@/app/(routers)/(todo)/constants';
import { cn } from '@/lib';

import { MIN_STEP_DURATION_MS, PROGRESS_ANIMATION_DURATION_MS } from '@/constants/animation';

import { AnimatedNumber } from '@/components/common/AnimatedNumber';

/**
 * 목표 진행률 퍼센트 표시 컴포넌트
 * @param value - 진행률 값
 * @param max - 최대 값
 * @param durationMs - 애니메이션 지속 시간
 * @param minStepDurationMs - 최소 지속 시간
 * @param className - 클래스 이름
 */
interface GoalProgressPercentageProps {
  value: number;
  max?: number;
  durationMs?: number;
  minStepDurationMs?: number;
  className?: string;
}

export function GoalProgressPercentage({
  value,
  max = 100,
  durationMs = PROGRESS_ANIMATION_DURATION_MS,
  minStepDurationMs = MIN_STEP_DURATION_MS,
  className,
}: GoalProgressPercentageProps) {
  return (
    <p className={cn('display-lg-bold', className)}>
      <AnimatedNumber
        value={value}
        max={max}
        durationMs={durationMs}
        minStepDurationMs={minStepDurationMs}
      />
      <span className="font-xl-medium mr-1">{GOALS_TEXT.PROGRESS_UNIT}</span>
    </p>
  );
}
