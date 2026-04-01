import type { ProfileFormValues } from '../hooks/useProfileForm';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { cn } from '@/lib';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProfileNameFormProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  email: string;
  isNameChanged: boolean;
  checkData: { available: boolean } | undefined;
  onCheckNickname: () => void;
}

export default function ProfileNameForm({
  register,
  errors,
  email,
  isNameChanged,
  checkData,
  onCheckNickname,
}: ProfileNameFormProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="font-sm-semibold text-gray-700">
          이메일
        </label>
        <Input id="email" value={email} readOnly disabled />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="name" className="font-sm-semibold text-gray-700">
          이름
        </label>
        <div className="flex gap-1">
          <div className="min-w-0 flex-1">
            <Input
              maxLength={20}
              id="name"
              {...register('name')}
              placeholder="닉네임을 입력해주세요"
            />
          </div>
          <Button
            type="button"
            disabled={!isNameChanged}
            className="shrink-0"
            onClick={onCheckNickname}
          >
            중복확인
          </Button>
        </div>
        <p className="font-xs-regular h-4">
          {errors.name?.message && <span className="text-red-500">{errors.name.message}</span>}
          {checkData !== undefined && (
            <span className={cn(checkData.available ? 'text-blue-400' : 'text-red-500')}>
              {checkData.available ? '사용 가능한 이름입니다.' : '중복된 이름입니다.'}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
