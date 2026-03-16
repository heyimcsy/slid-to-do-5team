import type { SVGProps } from 'react';

type NoteIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'orange';
};

const variantStyles = {
  default: 'white',
  orange: 'var(--color-orange-alpha-20)',
};

export const NoteIcon = ({ variant = 'default', ...props }: NoteIconProps) => {
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
      <rect x="7.5" y="6.8999" width="9" height="10.3846" rx="1.38462" fill="#EF6C00" />
      <path
        d="M9.57715 10.0151H14.4233"
        stroke="#FEEFDC"
        strokeWidth="0.969231"
        strokeLinecap="round"
      />
      <path
        d="M9.57666 12.0923H14.4228"
        stroke="#FEEFDC"
        strokeWidth="0.969231"
        strokeLinecap="round"
      />
      <path
        d="M9.57666 14.1689H14.4228"
        stroke="#FEEFDC"
        strokeWidth="0.969231"
        strokeLinecap="round"
      />
    </svg>
  );
};
