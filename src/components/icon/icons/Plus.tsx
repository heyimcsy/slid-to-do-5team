import type { SVGProps } from 'react';

import { cn } from '@/lib/shadcn';

type PlusIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'orange';
};

/** stroke는 currentColor — 기본/호버는 className의 text-* 로 제어 */
const variantClassName = {
  default: 'text-[var(--color-white)]',
  orange: 'text-[var(--color-orange-600)]',
} as const;

export const PlusIcon = ({ variant = 'default', className, ...props }: PlusIconProps) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(variantClassName[variant], className)}
      {...props}
    >
      <path d="M5 12H18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11.75 18.75V5.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};
