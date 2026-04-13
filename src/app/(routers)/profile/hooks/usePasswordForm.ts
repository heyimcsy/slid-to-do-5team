import {
  CONFIRM_PASSWORD,
  CURRENT_PASSWORD,
  NEW_PASSWORD,
  PROFILE_TEXT,
} from '@/app/(routers)/profile/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { usePatchPassword } from '../api/users';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, PROFILE_TEXT.CURRENT_PASSWORD),
    newPassword: z.string().min(8, PROFILE_TEXT.PASSWORD_LENGTH),
    confirmPassword: z.string().min(1, PROFILE_TEXT.REPEAT_PASSWORD),
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: PROFILE_TEXT.DUPLICATE_PASSWORD,
    path: [NEW_PASSWORD],
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: PROFILE_TEXT.PASSWORD_UNSAME,
    path: [CONFIRM_PASSWORD],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;

export function usePasswordForm() {
  const {
    control,
    formState: { errors },
    reset,
    trigger,
    getValues,
    setError,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const { mutateAsync: patchPassword } = usePatchPassword({
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => {
      toast.error(error.message);
      if (error.code === 'INVALID_CREDENTIALS') {
        setError(CURRENT_PASSWORD, {
          message: PROFILE_TEXT.CURRENT_PASSWORD_UNSAME,
        });
        return;
      }
    },
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
