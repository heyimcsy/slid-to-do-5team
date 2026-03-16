import type { SVGProps } from 'react';

type UnderlineIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'filled';
};

export const UnderlineIcon = ({ variant = 'default', ...props }: UnderlineIconProps) => {
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
        d="M21.0002 9.3335V15.1668C21.0002 17.9283 18.7616 20.1668 16.0002 20.1668C13.2387 20.1668 11.0002 17.9283 11.0002 15.1668V9.3335M9.3335 23.5002H22.6668"
        stroke={variant === 'filled' ? 'var(--color-gray-700)' : 'var(--color-gray-500)'}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
