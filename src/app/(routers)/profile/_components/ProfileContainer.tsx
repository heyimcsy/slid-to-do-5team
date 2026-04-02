'use client';

import {
  PasswordForm,
  ProfileImageSection,
  ProfileNameForm,
} from '@/app/(routers)/profile/_components/index';
import { usePasswordForm } from '@/app/(routers)/profile/hooks/usePasswordForm';
import { useProfileForm } from '@/app/(routers)/profile/hooks/useProfileForm';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export default function ProfileContainer() {
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
    setImageUrl,
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
    const hasPasswordChange = !!getPasswordValues('currentPassword'); // ← 비밀번호 입력 여부

    // 아무것도 변경 없으면 얼리 리턴
    if (!hasProfileChange && !hasPasswordChange) return;

    try {
      await Promise.all([submitProfile(), submitPassword()]);
      queryClient.removeQueries({ queryKey: ['check-nickname'] });
      resetNickNameCheck();
      toast.success('저장되었습니다.');
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="flex h-fit w-full flex-col items-center rounded-[32px] bg-white p-5 md:px-8 md:py-10">
      <ProfileImageSection imageUrl={imageUrl} onCropComplete={setImageUrl} />
      <div className="mt-8 w-full md:mt-12">
        <ProfileNameForm
          register={register}
          errors={errors}
          email={userData?.email ?? ''}
          isNameChanged={isNameChanged}
          checkData={checkData}
          onCheckNickname={refetch}
        />
      </div>
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
        {isNameChanged && !nickNameCheck ? '중복확인 해주세요' : '저장하기'}
      </Button>
    </div>
  );
}
