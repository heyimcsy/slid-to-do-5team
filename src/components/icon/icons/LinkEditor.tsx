import type { SVGProps } from 'react';

type LinkEditorIconProps = SVGProps<SVGSVGElement> & {
  variant?: 'default' | 'filled';
};

export const LinkEditorIcon = ({ variant = 'default', ...props }: LinkEditorIconProps) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {variant === 'filled' && <rect width="32" height="32" rx="8" fill="var(--color-gray-200)" />}
      <path
        d="M16.5898 21.3034L15.4113 22.4819C13.7841 24.1091 11.1459 24.1091 9.51873 22.4819C7.89154 20.8547 7.89154 18.2165 9.51873 16.5893L10.6972 15.4108M21.3038 16.5893L22.4824 15.4108C24.1095 13.7836 24.1095 11.1454 22.4824 9.51824C20.8552 7.89106 18.217 7.89106 16.5898 9.51824L15.4113 10.6968M13.0839 18.9167L18.9172 13.0834"
        stroke={variant === 'filled' ? 'var(--color-gray-700)' : 'var(--color-gray-500)'}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
