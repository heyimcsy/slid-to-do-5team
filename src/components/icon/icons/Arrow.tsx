import type { SVGProps } from 'react';

type ArrowIconProps = SVGProps<SVGSVGElement> & {
  direction?: 'left' | 'right' | 'up' | 'down';
  variant?: 'default' | 'white';
};

const directionStyles = {
  left: 'rotate(0deg)',
  right: 'rotate(180deg)',
  up: 'rotate(90deg)',
  down: 'rotate(-90deg)',
};

const variantStyles = {
  default: 'var(--color-gray-400)',
  white: 'var(--color-white)',
};

export const ArrowIcon = ({
  direction = 'left',
  variant = 'default',
  ...props
}: ArrowIconProps) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: directionStyles[direction] }}
      {...props}
    >
      <path
        d="M15 18L9 12L15 6"
        stroke={variantStyles[variant]}
        strokeWidth="2.004"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
