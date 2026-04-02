import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useGetCheckNickname, useGetMe, usePatchProfile } from '../api/users';

const profileSchema = z.object({
  name: z.string().min(1, '닉네임을 입력해주세요').max(20, '20자 이하로 입력해주세요'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function useProfileForm() {
  const queryClient = useQueryClient();
  const { data: userData } = useGetMe();
  const { mutateAsync: patchProfile } = usePatchProfile();
  const originalName = useRef('');

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (userData) {
      setValue('name', userData.name);
      originalName.current = userData.name;
    }
  }, [userData, setValue]);

  const firstImageUrl = useRef<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const isImageChanged = imageUrl !== firstImageUrl.current;

  useEffect(() => {
    if (userData?.image) {
      setImageUrl(userData.image);
      firstImageUrl.current = userData.image;
    }
  }, [userData?.image]);

  const nameValue = watch('name');
  const isNameChanged = nameValue !== originalName.current;

  const [nickNameCheck, setNickNameCheck] = useState(false);
  const { data: checkData, refetch } = useGetCheckNickname({
    name: nameValue,
    enabled: false,
  });

  useEffect(() => {
    setNickNameCheck(!!checkData?.available);
  }, [checkData]);

  useEffect(() => {
    setNickNameCheck(false);
    queryClient.removeQueries({ queryKey: ['check-nickname', nameValue] });
  }, [nameValue, queryClient]);

  const submitProfile = async () => {
    if (!isNameChanged && !isImageChanged) return;

    const payload: { name?: string; image?: string } = {};
    if (isNameChanged) payload.name = nameValue;
    if (isImageChanged) payload.image = imageUrl ?? undefined;

    await patchProfile(payload);
    originalName.current = nameValue;
    firstImageUrl.current = imageUrl; // ← 저장 후 기준값 업데이트
  };

  return {
    userData,
    register,
    errors,
    nameValue,
    isNameChanged,
    nickNameCheck,
    checkData,
    refetch,
    imageUrl,
    isImageChanged,
    setImageUrl,
    submitProfile,
    resetNickNameCheck: () => setNickNameCheck(false),
  };
}
