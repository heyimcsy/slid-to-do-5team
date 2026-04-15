import type { SVGProps } from 'react';





type LinkIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'orange' | 'white';
};

const variantStyles = {
  default: 'var(--color-white)',
  orange: 'var(--color-orange-alpha-20)',
  white: 'var(--color-black)', // 다크모드 시 사용하기 위해 black 사용
};

export const LinkIcon = ({ variant = 'default', ...props }: LinkIconProps) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill={variantStyles[variant]} fillOpacity="0.4" />
      <path
        d="M13.3332 10.6668L10.6665 13.3335"
        stroke="#EF6C00"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6668 12.6668L16.0002 11.3335C16.9206 10.413 16.9206 8.92064 16.0002 8.00016C15.0797 7.07969 13.5873 7.07969 12.6668 8.00016L11.3335 9.3335M9.3335 11.3335L8.00016 12.6668C7.07969 13.5873 7.07969 15.0797 8.00016 16.0002C8.92064 16.9206 10.413 16.9206 11.3335 16.0002L12.6668 14.6668"
        stroke="#EF6C00"
        strokeWidth="1.33333"
        strokeLinecap="round"
      />
    </svg>
  );
};
