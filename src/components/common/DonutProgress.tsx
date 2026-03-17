import { cn } from '@/lib';

interface DonutProgressProps {
  value: number;
  color?: string;
  trackColor?: string;
  responsive?: boolean;
}

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
}: Readonly<DonutProgressProps>) {
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);

  return (
    <div className={cn('size-38', responsive && 'lg:size-46')} aria-label="donut progress">
      <progress value={value} max={100} className="sr-only" />
      <svg viewBox="0 0 184 184" width="100%" height="100%">
        <circle cx="92" cy="92" r={r} fill="none" stroke={trackColor} strokeWidth="24" />
        <circle
          aria-hidden="true"
          cx="92"
          cy="92"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="24"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="translate(184 0) scale(-1 1) rotate(-90 92 92)"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
    </div>
  );
}
