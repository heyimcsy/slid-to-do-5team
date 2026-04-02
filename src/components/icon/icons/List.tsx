import type { SVGProps } from 'react';

type ListIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'filled';
};

export const ListIcon = ({ variant = 'default', ...props }: ListIconProps) => {
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
        d="M23.5 15.9998L13.5 15.9998M23.5 10.9998L13.5 10.9998M23.5 20.9998L13.5 20.9998M10.1667 15.9998C10.1667 16.4601 9.79357 16.8332 9.33333 16.8332C8.8731 16.8332 8.5 16.4601 8.5 15.9998C8.5 15.5396 8.8731 15.1665 9.33333 15.1665C9.79357 15.1665 10.1667 15.5396 10.1667 15.9998ZM10.1667 10.9998C10.1667 11.4601 9.79357 11.8332 9.33333 11.8332C8.8731 11.8332 8.5 11.4601 8.5 10.9998C8.5 10.5396 8.8731 10.1665 9.33333 10.1665C9.79357 10.1665 10.1667 10.5396 10.1667 10.9998ZM10.1667 20.9998C10.1667 21.4601 9.79357 21.8332 9.33333 21.8332C8.8731 21.8332 8.5 21.4601 8.5 20.9998C8.5 20.5396 8.8731 20.1665 9.33333 20.1665C9.79357 20.1665 10.1667 20.5396 10.1667 20.9998Z"
        stroke={variant === 'filled' ? 'var(--color-gray-700)' : 'var(--color-gray-500)'}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
