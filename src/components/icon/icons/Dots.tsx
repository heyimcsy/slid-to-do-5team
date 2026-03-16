import type { SVGProps } from 'react';

export const DotsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="6.14941" cy="12.2915" r="1.5" fill="var(--color-gray-500)" />
      <circle cx="12.1494" cy="12.2915" r="1.5" fill="var(--color-gray-500)" />
      <circle cx="18.1494" cy="12.2915" r="1.5" fill="var(--color-gray-500)" />
    </svg>
  );
};
