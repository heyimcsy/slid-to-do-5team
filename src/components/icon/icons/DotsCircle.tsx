import type { SVGProps } from 'react';

export const DotsCircleIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="white" />
      <circle
        cx="11.942"
        cy="11.9999"
        r="0.525"
        transform="rotate(-90 11.942 11.9999)"
        fill="var(--color-orange-600)"
        stroke="var(--color-orange-600)"
        strokeWidth="1.16667"
        strokeLinecap="round"
      />
      <circle
        cx="11.942"
        cy="15.9667"
        r="0.525"
        transform="rotate(-90 11.942 15.9667)"
        fill="var(--color-orange-600)"
        stroke="var(--color-orange-600)"
        strokeWidth="1.16667"
        strokeLinecap="round"
      />
      <circle
        cx="11.942"
        cy="8.03311"
        r="0.525"
        transform="rotate(-90 11.942 8.03311)"
        fill="var(--color-orange-600)"
        stroke="var(--color-orange-600)"
        strokeWidth="1.16667"
        strokeLinecap="round"
      />
    </svg>
  );
};
