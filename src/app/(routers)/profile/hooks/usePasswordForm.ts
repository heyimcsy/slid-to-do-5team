import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { usePatchPassword } from '../api/users';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    newPassword: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    confirmPassword: z.string().min(1, '비밀번호를 다시 입력해주세요'),
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: '기존 비밀번호와 새 비밀번호가 일치합니다.',
    path: ['newPassword'],
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;

export function usePasswordForm() {
  const { mutateAsync: patchPassword } = usePatchPassword({
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => toast.error(error.message),
  });

  const {
    control,
    formState: { errors },
    reset,
    trigger,
    getValues,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const submitPassword = async () => {
    const values = getValues();
    if (!values.currentPassword) return;
    const isValid = await trigger();
    if (!isValid) return;
    await patchPassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    reset();
  };

  return { control, errors, submitPassword, getValues };
}
