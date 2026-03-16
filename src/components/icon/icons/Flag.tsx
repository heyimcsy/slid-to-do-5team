import type { SVGProps } from 'react';

type FlagIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'orange';
};

const variantStyles = {
  default: 'var(--color-gray-300)',
  orange: 'var(--color-orange-600)',
};

export const FlagIcon = ({ variant = 'default', ...props }: FlagIconProps) => {
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
        d="M19.5234 4L18.2197 7.25684C18.029 7.73366 18.029 8.26634 18.2197 8.74316L19.5234 12H6V4H19.5234Z"
        fill={variantStyles[variant]}
        stroke={variantStyles[variant]}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line
        x1="6"
        y1="6"
        x2="6"
        y2="20"
        stroke={variantStyles[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
