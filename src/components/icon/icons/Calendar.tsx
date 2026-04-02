import type { SVGProps } from 'react';

type CalendarIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'orange';
};

const variantStyles = {
  default: 'var(--color-gray-300)',
  orange: 'var(--color-orange-600)',
};

export const CalendarIcon = ({ variant = 'default', ...props }: CalendarIconProps) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_13460_59573)">
        <path
          d="M21 10.5V21H3V10.5H21ZM21 9V6.75C21 6.15326 20.7629 5.58097 20.341 5.15901C19.919 4.73705 19.3467 4.5 18.75 4.5H16.5V3H15V4.5H9V3H7.5V4.5H5.25C4.65326 4.5 4.08097 4.73705 3.65901 5.15901C3.23705 5.58097 3 6.15326 3 6.75L3 9H21ZM16.5 13.5H15V15H16.5V13.5ZM12.75 13.5H11.25V15H12.75V13.5ZM9 13.5H7.5V15H9V13.5ZM16.5 16.5H15V18H16.5V16.5ZM12.75 16.5H11.25V18H12.75V16.5ZM9 16.5H7.5V18H9V16.5Z"
          fill={variantStyles[variant]}
        />
      </g>
      <defs>
        <clipPath id="clip0_13460_59573">
          <rect width="18" height="18" fill="white" transform="translate(3 3)" />
        </clipPath>
      </defs>
    </svg>
  );
};
