import type { SVGProps } from 'react';

type AlignCenterIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'filled';
};

export const AlignCenterIcon = ({ variant = 'default', ...props }: AlignCenterIconProps) => {
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
        d="M21 14.3333H11M23.5 11H8.5M23.5 17.6667H8.5M21 21H11"
        stroke={variant === 'filled' ? 'var(--color-gray-700)' : 'var(--color-gray-500)'}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
