import type { SVGProps } from 'react';

type CloseIconColor = 'purple' | 'gray' | 'red' | 'yellow' | 'green';

type CloseIconProps = SVGProps<SVGSVGElement> & {
  color?: CloseIconColor;
};

const colorStyles: Record<CloseIconColor, string> = {
  purple: '#B692F6',
  gray: '#A4A7AE',
  red: '#F97066',
  yellow: '#FDB022',
  green: '#47CD89',
};

export const CloseIcon = ({ color = 'purple', ...props }: CloseIconProps) => {
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
        d="M11 5L5 11M5 5L11 11"
        stroke={colorStyles[color]}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
