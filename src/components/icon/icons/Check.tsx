import type { SVGProps } from 'react';

type CheckIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'orange';
};

const variantStyles = {
  default: 'var(--color-white)',
  orange: 'var(--color-orange-600)',
};

export const CheckIcon = ({ variant = 'default', ...props }: CheckIconProps) => {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.44434 8.21572L6.73917 10.5106C6.88562 10.657 7.12305 10.657 7.2695 10.5106L11.5554 6.22461"
        stroke={variantStyles[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
