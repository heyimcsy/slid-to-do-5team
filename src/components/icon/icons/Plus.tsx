import type { SVGProps } from 'react';

type PlusIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'orange';
};

const variantStyles = {
  default: 'var(--color-white)',
  orange: 'var(--color-orange-600)',
};

export const PlusIcon = ({ variant = 'default', ...props }: PlusIconProps) => {
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
        d="M5 12H18.5"
        stroke={variantStyles[variant]}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11.75 18.75V5.25"
        stroke={variantStyles[variant]}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};
