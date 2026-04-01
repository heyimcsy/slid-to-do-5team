import type { PasswordFormValues } from '../hooks/usePasswordForm';
import type { Control, FieldErrors } from 'react-hook-form';

import { PasswordFieldWithToggle } from '@/components/common/PasswordFieldWithToggle';

interface PasswordFormProps {
  control: Control<PasswordFormValues>;
  errors: FieldErrors<PasswordFormValues>;
}

export default function PasswordForm({ control, errors }: PasswordFormProps) {
  return (
    <div className="w-full space-y-2">
      <p className="font-sm-semibold text-gray-700">비밀번호 변경</p>
      <div className="flex flex-col space-y-1">
        <PasswordFieldWithToggle
          control={control}
          name="currentPassword"
          id="current-password"
          autoComplete="current-password"
          placeholder="현재 비밀번호를 입력해주세요"
          hideValidationMessage
        />
        <p className="font-xs-regular h-4 text-red-500">{errors.currentPassword?.message ?? ''}</p>
        <PasswordFieldWithToggle
          control={control}
          name="newPassword"
          id="new-password"
          autoComplete="new-password"
          placeholder="새 비밀번호를 입력해주세요"
          hideValidationMessage
        />
        <p className="font-xs-regular h-4 text-red-500">{errors.newPassword?.message ?? ''}</p>
        <PasswordFieldWithToggle
          control={control}
          name="confirmPassword"
          id="confirm-password"
          autoComplete="new-password"
          placeholder="새 비밀번호를 다시 입력해주세요"
          hideValidationMessage
        />
        <p className="font-xs-regular h-4 text-red-500">{errors.confirmPassword?.message ?? ''}</p>
      </div>
    </div>
  );
}
