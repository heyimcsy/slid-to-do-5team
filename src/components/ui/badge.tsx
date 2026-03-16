import type { VariantProps } from 'class-variance-authority';

import React from 'react';
import { cn } from '@/lib';
import { cva } from 'class-variance-authority';

const badgeVariants = cva(
  // 기본 레이아웃
  [
    'inline-flex h-6 w-fit shrink-0 items-center gap-1 overflow-hidden rounded-4xl border',
    'whitespace-nowrap transition-all',
    // 텍스트
    'font-xs-regular',
    // X 없을 때 기본 패딩
    'px-2 py-2',
    // X 있을 때 오른쪽 패딩 축소
    'has-[button]:pr-[3px]',
  ],
  {
    variants: {
      color: {
        gray: 'bg-[#FAFAFA] border-[#E9EAEB] text-[#414651]',
        green: 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]',
        yellow: 'bg-[#FFFAEB] border-[#FEDF89] text-[#B54708]',
        red: 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]',
        purple: 'bg-[#F9F5FF] border-[#E9D7FE] text-[#6941C6]',
      },
    },
    defaultVariants: {
      color: 'gray',
    },
  },
);

// X 버튼 색상 map
const removeIconColorMap: Record<string, string> = {
  gray: 'text-[#A4A7AE]',
  green: 'text-[#47CD89]',
  yellow: 'text-[#FDB022]',
  red: 'text-[#F97066]',
  purple: 'text-[#B692F6]',
};

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void; // 있으면 X 버튼 노출, 없으면 미노출
  state?: 'default' | 'delete';
}
/**
 *  제작자: 최서윤
 *  color 원하는 뱃지 컬러
 *  onClick x 아이콘 활성화 상태에만 작동
 *  state 뱃지 상태 값 x 아이콘 유무
 */
function Badge({
  children,
  className,
  color = 'gray',
  onClick,
  state = 'default',
}: Readonly<BadgeProps>) {
  return (
    <span className={cn(badgeVariants({ color }), className)}>
      {children}
      {state === 'delete' && (
        <button
          type="button"
          onClick={onClick}
          className={cn(
            'flex cursor-pointer items-center justify-center rounded-full p-[2px]',
            'transition-opacity hover:opacity-70',
            removeIconColorMap[color ?? 'gray'],
          )}
        >
          {/* X 아이콘 */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M9 3L3 9M3 3l6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

export { Badge, badgeVariants };
