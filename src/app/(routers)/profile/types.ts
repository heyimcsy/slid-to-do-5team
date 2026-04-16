import type { PasswordFormValues } from '@/app/(routers)/profile/hooks/usePasswordForm';
import type { ProfileFormValues } from '@/app/(routers)/profile/hooks/useProfileForm';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

export interface ProfileNameFormProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  email: string;
  isNameChanged: boolean;
  checkData: { available: boolean } | undefined;
  onCheckNickname: () => void;
  oauthProvider: boolean;
}

export interface ProfileImageSectionProps {
  imageUrl: string | null;
  onCropComplete: (file: File) => void;
  oauthProvider: boolean;
}
export interface PasswordFormProps {
  control: Control<PasswordFormValues>;
  errors: FieldErrors<PasswordFormValues>;
}

export interface ImageCropperProps {
  onCropComplete: (file: File) => void;
}
