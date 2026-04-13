'use client';

import {
  PasswordForm,
  ProfileImageSection,
  ProfileNameForm,
} from '@/app/(routers)/profile/_components/index';
import { CHECK_NICKNAME, CURRENT_PASSWORD, PROFILE_TEXT } from '@/app/(routers)/profile/constants';
import { usePasswordForm } from '@/app/(routers)/profile/hooks/usePasswordForm';
import { useProfileForm } from '@/app/(routers)/profile/hooks/useProfileForm';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKeys';

import { Button } from '@/components/ui/button';

export default function ProfileContainer() {
  const userInfo = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
  const parsedUser = userInfo ? JSON.parse(userInfo) : null;
  const oauthProvider: boolean = !!parsedUser.state.user.oauthProvider;

  const queryClient = useQueryClient();
  const {
    userData,
    register,
    errors,
    isNameChanged,
    nickNameCheck,
    checkData,
    refetch,
    imageUrl,
    isImageChanged,
    handleImageSelect,
    submitProfile,
    resetNickNameCheck,
  } = useProfileForm();

  const {
    control,
    errors: passwordErrors,
    submitPassword,
    getValues: getPasswordValues,
  } = usePasswordForm();

  const handleSaveAll = async () => {
    const hasProfileChange = isNameChanged || isImageChanged;
    const hasPasswordChange = !!getPasswordValues(CURRENT_PASSWORD);

    // 아무것도 변경 없으면 얼리 리턴
    if (!hasProfileChange && !hasPasswordChange) return;
    if (Object.keys(passwordErrors).length > 0) return;

    try {
      await Promise.all([submitProfile(), submitPassword()]);
      queryClient.removeQueries({ queryKey: [CHECK_NICKNAME] });
      resetNickNameCheck();
      toast.success(PROFILE_TEXT.SUCCESS_MESSAGE);
    } catch (e) {
      console.error(e);
      toast.error(PROFILE_TEXT.ERROR_MESSAGE);
    }
  };
  return (
    <div className="flex h-fit w-full flex-col items-center rounded-[32px] bg-white p-5 md:px-8 md:py-10">
      <ProfileImageSection imageUrl={imageUrl} onCropComplete={handleImageSelect} />
      <div className="mt-8 w-full md:mt-12">
        <ProfileNameForm
          register={register}
          errors={errors}
          email={userData?.email ?? ''}
          isNameChanged={isNameChanged}
          checkData={checkData}
          onCheckNickname={refetch}
          oauthProvider={oauthProvider}
        />
      </div>
      {!oauthProvider && (
        <>
          <div className="mt-8 w-full">
            <PasswordForm control={control} errors={passwordErrors} />
          </div>
          <Button
            type="button"
            onClick={handleSaveAll}
            className="mt-10 w-full md:mt-12"
            size="lg"
            disabled={isNameChanged && !nickNameCheck}
          >
            {isNameChanged && !nickNameCheck ? PROFILE_TEXT.DUPLICATE_CHECK : PROFILE_TEXT.SAVE}
          </Button>
        </>
      )}
    </div>
  );
}
