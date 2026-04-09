import type { SVGProps } from 'react';

type DeleteIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'white';
};

const variantStyles = {
  default: 'var(--color-gray-300)',
  white: 'white',
};

export const DeleteIcon = ({ variant = 'default', ...props }: DeleteIconProps) => {
  const safeVariant = variant in variantStyles ? variant : 'default';

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 6.5L18 18.5"
        stroke={variantStyles[safeVariant]}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 6.5L6 18.5"
        stroke={variantStyles[safeVariant]}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};
