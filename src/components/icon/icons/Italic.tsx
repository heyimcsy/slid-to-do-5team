import type { SVGProps } from 'react';

type ItalicIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'filled';
};

export const ItalicIcon = ({ variant = 'default', ...props }: ItalicIconProps) => {
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
        d="M21.8332 9.3335H14.3332M17.6665 22.6668H10.1665M18.4998 9.3335L13.4998 22.6668"
        stroke={variant === 'filled' ? 'var(--color-gray-700)' : 'var(--color-gray-500)'}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
