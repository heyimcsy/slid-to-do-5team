'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import profileImage from '@/../public/images/user-yellow.svg';
import { ImageCropper } from '@/app/(routers)/profile/_components/ImageCropper';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PasswordFieldWithToggle } from '@/components/common/PasswordFieldWithToggle';
import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const profileSchema = z.object({
  name: z.string().min(1, '닉네임을 입력해주세요').max(20, '20자 이하로 입력해주세요'),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, '5MB 이하 이미지만 업로드 가능합니다')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'JPG, PNG, WEBP 형식만 가능합니다',
    )
    .optional(),
});
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    newPassword: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    confirmPassword: z.string().min(1, '비밀번호를 다시 입력해주세요'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const user = { email: 'seoyoon@ooo.com', name: '최서윤' };
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 프로필 폼
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setValue,
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name },
  });

  // 비밀번호 폼
  const {
    control,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const imageFile = watch('image');
  const preview = imageFile ? URL.createObjectURL(imageFile) : null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue('image', file, { shouldValidate: true }); // ← rhf에 파일 등록
  };
  const onProfileSubmit = (values: ProfileFormValues) => {
    console.log('onProfileSubmit', values);
    const formData = new FormData();
    formData.append('name', values.name);
    if (fileInputRef.current?.files?.[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }
    // usePatchProfile 호출
  };
  console.log('passwordErrors:', passwordErrors);
  const onPasswordSubmit = (values: PasswordFormValues) => {
    console.log('비밀번호 변경:', values);
    // usePatchPassword 호출
    resetPassword();
  };

  return (
    <div className="h-fit w-[343px] space-y-[22px] md:w-157 lg:w-140 lg:space-y-10">
      <h1 className="font-xl-semibold">내 정보 관리</h1>
      <div className="flex h-fit w-full flex-col items-center rounded-[32px] bg-white p-5 md:px-8 md:py-10">
        {/* 유저 이미지 */}
        <div className="relative h-fit w-fit">
          <div className="relative size-[132px] overflow-hidden rounded-full">
            <Image src={preview ?? profileImage} alt="유저 이미지" fill className="object-cover" />
          </div>
          <div className="absolute right-3 bottom-0 flex size-9 items-center justify-center rounded-[18px] bg-orange-500">
            <label htmlFor="profile" className="">
              <Icon name="pencil" variant="white" size={21} />
            </label>
            <input
              id="profile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <ImageCropper
              onCropComplete={(file) => {
                setValue('image', file, { shouldValidate: true });
              }}
            />
          </div>
        </div>
        {/* 프로필 폼 */}
        <form
          onSubmit={handleProfileSubmit(onProfileSubmit)}
          className="mt-8 w-full space-y-4 md:mt-12"
        >
          {/* 이메일 - 수정 불가 */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="font-sm-semibold text-gray-700">
              이메일
            </label>
            <Input id="email" value={user.email} readOnly disabled />
          </div>

          {/* 이름 */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="font-sm-semibold text-gray-700">
              이름
            </label>
            <Input
              maxLength={20}
              id="name"
              {...registerProfile('name')}
              placeholder="닉네임을 입력해주세요"
              errorMessage={profileErrors.name?.message}
            />
          </div>
          <Button type="submit" className="hidden">
            경 이름 이미지 변경
          </Button>
        </form>

        {/* 비밀번호 폼 */}
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="mt-10 w-full space-y-2">
          <p className="font-sm-semibold text-gray-700">비밀번호 변경</p>
          <div className="flex flex-col space-y-3">
            <PasswordFieldWithToggle
              control={control}
              name="currentPassword"
              id="current-password"
              autoComplete="current-password"
              placeholder="현재 비밀번호를 입력해주세요"
            />
            <PasswordFieldWithToggle
              control={control}
              name="newPassword"
              id="new-password"
              autoComplete="new-password"
              placeholder="새 비밀번호를 입력해주세요"
            />
            <PasswordFieldWithToggle
              control={control}
              name="confirmPassword"
              id="confirm-password"
              autoComplete="new-password"
              placeholder="새 비밀번호를 다시 입력해주세요"
            />
          </div>
          <Button type="submit" className="mt-10 w-full md:mt-12" size="lg">
            비밀번호 변경
          </Button>
        </form>
      </div>
    </div>
  );
}
