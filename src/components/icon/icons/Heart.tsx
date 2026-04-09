import type { SVGProps } from 'react';

type HeartIconProps = SVGProps<SVGSVGElement> & {
  filled?: boolean;
};

export const HeartIcon = ({ filled = false, ...props }: HeartIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 21C12 21 3 15.5 3 9C3 6.23858 5.23858 4 8 4C9.6569 4 11.1287 4.79417 12 6.02956C12.8713 4.79417 14.3431 4 16 4C18.7614 4 21 6.23858 21 9C21 15.5 12 21 12 21Z"
        fill={filled ? '#ef4444' : 'transparent'}
        stroke={filled ? '#ef4444' : 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
