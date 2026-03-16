import type { SVGProps } from 'react';

export const CheckMiniIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="3.75"
        y="3.75"
        width="10.5"
        height="10.5"
        rx="1.25"
        stroke="var(--color-gray-400)"
        strokeWidth="1.5"
      />
      <path
        d="M6.5 9.5L7.88923 10.7553C8.03995 10.8915 8.2717 10.8829 8.41194 10.736L11.5 7.5"
        stroke="var(--color-gray-400)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
