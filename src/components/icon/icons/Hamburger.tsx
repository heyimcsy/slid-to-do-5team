import type { SVGProps } from 'react';

export const HamburgerIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6 8H18" stroke="var(--color-gray-500)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 12H18" stroke="var(--color-gray-500)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 16H18" stroke="var(--color-gray-500)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};