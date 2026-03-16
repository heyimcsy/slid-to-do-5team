import type { SVGProps } from 'react';

type CheckDIconProps = SVGProps<SVGSVGElement> & {
  checked?: boolean;
};

export const CheckBoxDIcon = ({ checked = false, ...props }: CheckDIconProps) => {
  if (!checked) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect width="18" height="18" rx="6" fill="#FEEFDC" />
      </svg>
    );
  }

  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="18" height="18" rx="6" fill="#FEEFDC" />
      <path
        d="M5.44434 9.21572L7.73917 11.5106C7.88562 11.657 8.12305 11.657 8.2695 11.5106L12.5554 7.22461"
        stroke="#EF6C00"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
