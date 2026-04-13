import type { PasswordFormProps } from '@/app/(routers)/profile/types';

import {
  CONFIRM_PASSWORD,
  CURRENT_PASSWORD,
  NEW_PASSWORD,
  PROFILE_TEXT,
} from '@/app/(routers)/profile/constants';

import { PasswordFieldWithToggle } from '@/components/common/PasswordFieldWithToggle';

export default function PasswordForm({ control, errors }: PasswordFormProps) {
  return (
    <div className="w-full space-y-2">
      <p className="font-sm-semibold text-gray-700">{PROFILE_TEXT.CHANGE_PASSWORD}</p>
      <div className="flex flex-col space-y-1">
        <PasswordFieldWithToggle
          control={control}
          name={CURRENT_PASSWORD}
          id="current-password"
          autoComplete="current-password"
          placeholder={PROFILE_TEXT.CURRENT_PASSWORD}
          hideValidationMessage
        />
        <p className="font-xs-regular h-4 text-red-500">{errors.currentPassword?.message ?? ''}</p>
        <PasswordFieldWithToggle
          control={control}
          name={NEW_PASSWORD}
          id="new-password"
          autoComplete="new-password"
          placeholder={PROFILE_TEXT.NEW_PASSWORD}
          hideValidationMessage
        />
        <p className="font-xs-regular h-4 text-red-500">{errors.newPassword?.message ?? ''}</p>
        <PasswordFieldWithToggle
          control={control}
          name={CONFIRM_PASSWORD}
          id="confirm-password"
          autoComplete="confirm-password"
          placeholder={PROFILE_TEXT.CONFIRM_PASSWORD}
          hideValidationMessage
        />
        <p className="font-xs-regular h-4 text-red-500">{errors.confirmPassword?.message ?? ''}</p>
      </div>
    </div>
  );
}
