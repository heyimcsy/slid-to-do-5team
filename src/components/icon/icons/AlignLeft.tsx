import type { SVGProps } from 'react';

type AlignLeftIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'filled';
};

export const AlignLeftIcon = ({ variant = 'default', ...props }: AlignLeftIconProps) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {variant === 'filled' && <rect width="32" height="32" rx="8" fill="var(--color-gray-200)" />}
      <path
        d="M19.3333 14.3333H8.5M22.6667 11H8.5M22.6667 17.6667H8.5M19.3333 21H8.5"
        stroke={variant === 'filled' ? 'var(--color-gray-700)' : 'var(--color-gray-500)'}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
