import type { SVGProps } from 'react';

export const MoreIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse
        cx="11.9"
        cy="11.7001"
        rx="0.9"
        ry="0.9"
        transform="rotate(-90 11.9 11.7001)"
        fill="var(--color-gray-400)"
        stroke="var(--color-gray-400)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse
        cx="11.9"
        cy="19.4999"
        rx="0.9"
        ry="0.9"
        transform="rotate(-90 11.9 19.4999)"
        fill="var(--color-gray-400)"
        stroke="var(--color-gray-400)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse
        cx="11.9"
        cy="3.8998"
        rx="0.9"
        ry="0.9"
        transform="rotate(-90 11.9 3.8998)"
        fill="var(--color-gray-400)"
        stroke="var(--color-gray-400)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
