import { useEffect, useRef, useState } from 'react';
import { uploadImage } from '@/api/images';
import { CHECK_NICKNAME, NAME, PROFILE_TEXT } from '@/app/(routers)/profile/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useGetCheckNickname, useGetMe, usePatchProfile } from '../api/users';

const profileSchema = z.object({
  name: z.string().min(1, PROFILE_TEXT.NAME_PLACEHOLDER).max(20, PROFILE_TEXT.NICKNAME_LENGTH),
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
      setValue(NAME, userData.name);
      originalName.current = userData.name;
    }
  }, [userData, setValue]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const firstImageUrl = useRef<string | null>(null);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
  };
  const isImageChanged = imageFile !== null;

  useEffect(() => {
    if (userData?.image) {
      setImageUrl(userData.image);
      firstImageUrl.current = userData.image;
    }
  }, [userData?.image]);

  const nameValue = watch(NAME);
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
    queryClient.removeQueries({ queryKey: [CHECK_NICKNAME, nameValue] });
  }, [nameValue, queryClient]);

  const submitProfile = async () => {
    if (!isNameChanged && !isImageChanged) return;

    const payload: { name?: string; image?: string } = {};
    if (isNameChanged) payload.name = nameValue;

    // 저장 시점에 S3 업로드
    if (isImageChanged && imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      payload.image = uploadedUrl;
      firstImageUrl.current = uploadedUrl;
      setImageUrl(uploadedUrl);
      setImageFile(null);
    }

    await patchProfile(payload);
    originalName.current = nameValue;
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
    handleImageSelect,
    submitProfile,
    resetNickNameCheck: () => setNickNameCheck(false),
  };
}
