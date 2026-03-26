'use client';

import type { LoginBody } from '@/lib/auth/schemas/login';
import type { User } from '@/lib/auth/schemas/user';



import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient, ApiClientError } from '@/lib/apiClient';
import { loginBodySchema } from '@/lib/auth/schemas/login';
import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';
import { authUserStore } from '@/stores/authUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { AuthFooter, AuthHeader } from '../_components/AuthHeaderFooter';
import { AuthRHFTextField } from '../_components/AuthRHFTextField';
import { PasswordFieldWithToggle } from '../_components/PasswordFieldWithToggle';

function LoginFormBody() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState('');

  const { control, handleSubmit } = useForm<LoginBody>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });
  const { isSubmitting } = useFormState({ control });

  const onSubmit = async (data: LoginBody) => {
    setSubmitError('');
    try {
      /**
       * 로그인 성공 시 세션(토큰 쌍) 확보가 목적이다. 2xx인데 토큰이 없으면 signup과 달리
       * 정상 분기가 아니라 **BFF·백엔드 응답 계약 위반**으로 본다 (`/api/auth/signup` 주석 참고).
       * 이런 경우 `ApiClientError` 예외가 발생하므로 처리.
       */
      const res = await apiClient<{ success?: boolean; user?: User }>('/login', {
        method: 'POST',
        body: data,
        clientPublicBase: '/api/auth',
        retry: false,
      });
      if (res.user) {
        authUserStore.getState().setUser(res.user);
      } else {
        authUserStore.getState().clearUser();
      }
      const nextPath = getSafeCallbackPath(searchParams.get('callbackUrl')) ?? '/';
      router.refresh();
      router.push(nextPath);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setSubmitError(err.message || '로그인 실패');
        return;
      }
      setSubmitError(err instanceof Error ? err.message : '로그인 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col" noValidate>
      <FieldGroup className="pb-8 **:data-[slot=field-description]:gap-x-1 **:data-[slot=field-description]:pt-2 **:data-[slot=field-error]:text-justify">
        <Field>
          <FieldLabel className="sr-only" htmlFor="login-email">
            이메일
          </FieldLabel>
          <AuthRHFTextField
            control={control}
            name="email"
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="이메일을 입력해 주세요"
          />
        </Field>
        <Field>
          <FieldLabel className="sr-only" htmlFor="login-password">
            비밀번호
          </FieldLabel>
          <PasswordFieldWithToggle
            control={control}
            name="password"
            id="login-password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력해 주세요"
          />
        </Field>
      </FieldGroup>
      {submitError ? <FieldError>{submitError}</FieldError> : null}
      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  );
}

export default function LoginForm() {
  return (
    <main className="mx-auto flex h-dvh w-full max-w-100 flex-col justify-center px-4 text-center md:px-0">
      <AuthHeader />
      <Suspense fallback={null}>
        <LoginFormBody />
      </Suspense>
      <AuthFooter variant="login" />
    </main>
  );
}
