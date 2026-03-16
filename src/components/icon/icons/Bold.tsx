import type { SVGProps } from 'react';

type BoldIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'filled';
};

export const BoldIcon = ({ variant = 'default', ...props }: BoldIconProps) => {
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
        d="M11 16.0002H17.6667C19.5076 16.0002 21 14.5078 21 12.6668C21 10.8259 19.5076 9.3335 17.6667 9.3335H11V16.0002ZM11 16.0002H18.5C20.3409 16.0002 21.8333 17.4925 21.8333 19.3335C21.8333 21.1744 20.3409 22.6668 18.5 22.6668H11V16.0002Z"
        stroke={variant === 'filled' ? 'var(--color-gray-700)' : 'var(--color-gray-500)'}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
