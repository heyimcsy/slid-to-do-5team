import type { SVGProps } from 'react';

type DashboardIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'orange';
};

const variantStyles = {
  default: 'var(--color-gray-300)',
  orange: 'var(--color-orange-600)',
};

export const DashboardIcon = ({ variant = 'default', ...props }: DashboardIconProps) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3" y="3" width="8" height="8" rx="2" fill={variantStyles[variant]} />
      <rect x="13" y="13" width="8" height="8" rx="2" fill={variantStyles[variant]} />
      <rect x="3" y="13" width="8" height="8" rx="2" fill={variantStyles[variant]} />
      <rect x="13" y="3" width="8" height="8" rx="2" fill={variantStyles[variant]} />
    </svg>
  );
};
