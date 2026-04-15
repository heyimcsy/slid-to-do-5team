import type { SVGProps } from 'react';

type CheckBoxVariant = 'default' | 'ghost';

type CheckIconProps = SVGProps<SVGSVGElement> & {
  checked?: boolean;
  variant?: CheckBoxVariant;
};

export const CheckBoxIcon = ({
  checked = false,
  variant = 'default',
  ...props
}: CheckIconProps) => {
  const variantStyles = {
    default: {
      fill: '#ffffff',
      stroke: '#CCCCCC',
    },
    ghost: {
      fill: '#FEEFDC',
      stroke: 'transparent',
    },
  };

  const safeVariant = variant in variantStyles ? variant : 'default';

  if (!checked) {
    return (
      <svg
        width={18}
        height={18}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect
          x="0.5"
          y="0.5"
          width="17"
          height="17"
          rx="5.5"
          fill={variantStyles[safeVariant].fill}
          stroke={variantStyles[safeVariant].stroke}
        />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
      <rect width={18} height={18} fill="#FF8442" rx={6} />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth={2}
        d="M5.444 9.216 7.74 11.51a.375.375 0 0 0 .53 0l4.286-4.286"
      />
    </svg>
  );
};
