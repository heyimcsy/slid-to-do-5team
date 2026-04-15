import type { SVGProps } from 'react';

import { cn } from '@/lib';

type DotsCircleIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'ghost';
};

export const DotsCircleIcon = ({
  variant = 'default',
  className,
  ...props
}: DotsCircleIconProps) => {
  const variantStyles = {
    default: {
      fill: 'var(--color-white)',
      dots: 'var(--color-orange-600)',
    },
    ghost: {
      fill: '#ffffff99',
      dots: 'currentColor',
    },
  };
  const safeVariant = variant in variantStyles ? variant : 'default';
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(variant === 'ghost' && 'text-orange-600 dark:text-orange-300', className)}
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill={variantStyles[safeVariant].fill} />
      <circle
        cx="11.942"
        cy="11.9999"
        r="0.525"
        transform="rotate(-90 11.942 11.9999)"
        fill={variantStyles[safeVariant].dots}
        stroke={variantStyles[safeVariant].dots}
        strokeWidth="1.16667"
        strokeLinecap="round"
      />
      <circle
        cx="11.942"
        cy="15.9667"
        r="0.525"
        transform="rotate(-90 11.942 15.9667)"
        fill={variantStyles[safeVariant].dots}
        stroke={variantStyles[safeVariant].dots}
        strokeWidth="1.16667"
        strokeLinecap="round"
      />
      <circle
        cx="11.942"
        cy="8.03311"
        r="0.525"
        transform="rotate(-90 11.942 8.03311)"
        fill={variantStyles[safeVariant].dots}
        stroke={variantStyles[safeVariant].dots}
        strokeWidth="1.16667"
        strokeLinecap="round"
      />
    </svg>
  );
};
