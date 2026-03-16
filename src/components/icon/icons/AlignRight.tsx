import type { SVGProps } from 'react';

type AlignRightIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'filled';
};

export const AlignRightIcon = ({ variant = 'default', ...props }: AlignRightIconProps) => {
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
        d="M12.6667 14.3333H23.5M9.33333 11H23.5M9.33333 17.6667H23.5M12.6667 21H23.5"
        stroke={variant === 'filled' ? 'var(--color-gray-700)' : 'var(--color-gray-500)'}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
