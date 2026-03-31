'use client';

import { memo } from 'react';

import { EyeIcon } from '@/components/icon/icons/Eye';
import { EyeOffIcon } from '@/components/icon/icons/EyeOff';

type PasswordToggleButtonProps = {
  visible: boolean;
  onToggle: () => void;
  /** `aria-controls`용 입력 id */
  controlsId: string;
};

function PasswordToggleButtonInner({ visible, onToggle, controlsId }: PasswordToggleButtonProps) {
  return (
    <button
      type="button"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 outline-none hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-0"
      aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
      aria-pressed={visible}
      aria-controls={controlsId}
      onClick={onToggle}
    >
      <span className="h-5 w-5 [&_svg]:scale-105 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-in-out [&_svg]:hover:cursor-pointer">
        {visible ? <EyeIcon /> : <EyeOffIcon />}
      </span>
    </button>
  );
}

export const PasswordToggleButton = memo(PasswordToggleButtonInner);
PasswordToggleButton.displayName = 'PasswordToggleButton';
