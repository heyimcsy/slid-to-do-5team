'use client';

import type { SignupBody } from '@/lib/auth/schemas/signup';
import type { User } from '@/lib/auth/schemas/user';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiClientError } from '@/lib/apiClient';
import { signupBodySchema } from '@/lib/auth/schemas/signup';
import { authUserStore } from '@/stores/authUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { AuthFooter, AuthHeader } from '../_components/AuthHeaderFooter';
import { AuthRHFTextField } from '../_components/AuthRHFTextField';
import { PasswordFieldWithToggle } from '../_components/PasswordFieldWithToggle';

function SignupFormBody() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');

  const { control, handleSubmit } = useForm<SignupBody>({
    resolver: zodResolver(signupBodySchema),
    defaultValues: { name: '', email: '', password: '', passwordConfirm: '' },
    mode: 'onSubmit',
  });
  const { isSubmitting } = useFormState({ control });

  const onSubmit = async (data: SignupBody) => {
    setSubmitError('');
    try {
      const res = await apiClient<{
        success?: boolean;
        message?: string;
        sessionIssued?: boolean;
        emailVerificationRequired?: boolean;
        user?: User;
      }>('/signup', {
        method: 'POST',
        body: data,
        clientPublicBase: '/api/auth',
        retry: false,
      });
      if (res.sessionIssued) {
        if (res.user) {
          authUserStore.getState().setUser(res.user);
        } else {
          authUserStore.getState().clearUser();
        }
        router.refresh();
        router.push('/');
        return;
      }
      router.push('/login');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setSubmitError(err.message || '회원가입 실패');
        return;
      }
      setSubmitError(err instanceof Error ? err.message : '회원가입 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col" noValidate>
      <FieldGroup className="pb-8 *:gap-x-0 *:gap-y-2 **:data-[slot=field-description]:gap-x-1 **:data-[slot=field-description]:pt-2 **:data-[slot=field-error]:text-justify">
        <Field>
          <FieldLabel htmlFor="signup-name">이름</FieldLabel>
          <AuthRHFTextField
            control={control}
            name="name"
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="이름을 입력해 주세요"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-email">이메일</FieldLabel>
          <AuthRHFTextField
            control={control}
            name="email"
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="이메일을 입력해 주세요"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-password">비밀번호</FieldLabel>
          <PasswordFieldWithToggle
            control={control}
            name="password"
            id="signup-password"
            autoComplete="new-password"
            className="w-full md:w-100"
            placeholder="비밀번호를 입력해 주세요"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="signup-password-confirm">비밀번호 확인</FieldLabel>
          <PasswordFieldWithToggle
            control={control}
            name="passwordConfirm"
            id="signup-password-confirm"
            autoComplete="new-password"
            placeholder="비밀번호를 한 번 더 입력해 주세요"
          />
        </Field>
      </FieldGroup>
      {submitError ? <FieldError>{submitError}</FieldError> : null}
      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? '처리 중...' : '가입하기'}
      </Button>
    </form>
  );
}

export default function SignupForm() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-100 flex-col justify-center px-4 text-center md:px-0">
      <AuthHeader />
      <SignupFormBody />
      <AuthFooter variant="signup" />
    </main>
  );
}
