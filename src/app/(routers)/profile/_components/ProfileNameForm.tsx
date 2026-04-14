import type { ProfileNameFormProps } from '@/app/(routers)/profile/types';

import { EMAIL, NAME, PROFILE_TEXT } from '@/app/(routers)/profile/constants';
import { cn } from '@/lib';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfileNameForm({
  register,
  errors,
  email,
  isNameChanged,
  checkData,
  onCheckNickname,
  oauthProvider,
}: ProfileNameFormProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor={EMAIL} className="font-sm-semibold text-gray-700">
          {PROFILE_TEXT.EMAIL}
        </label>
        <Input id={EMAIL} value={email} readOnly disabled />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor={NAME} className="font-sm-semibold text-gray-700">
          {PROFILE_TEXT.NAME}
        </label>
        <div className="flex gap-1">
          <div className="min-w-0 flex-1">
            <Input
              maxLength={20}
              id={NAME}
              {...register(NAME)}
              placeholder={PROFILE_TEXT.NAME_PLACEHOLDER}
              disabled={oauthProvider}
            />
          </div>
          {!oauthProvider && (
            <Button
              type="button"
              disabled={!isNameChanged}
              className="shrink-0"
              onClick={onCheckNickname}
            >
              {PROFILE_TEXT.DUPLICATE}
            </Button>
          )}
        </div>
        <p className="font-xs-regular h-4">
          {errors.name?.message && <span className="text-red-500">{errors.name.message}</span>}
          {checkData !== undefined && (
            <span className={cn(checkData.available ? 'text-blue-400' : 'text-red-500')}>
              {checkData.available ? PROFILE_TEXT.CHECK.POSSIBLE : PROFILE_TEXT.CHECK.IMPOSSIBLE}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
