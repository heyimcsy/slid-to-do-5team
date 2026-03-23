'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signupBodySchema } from '@/lib/auth/schemas/signup';

type FieldKey = 'email' | 'password' | 'passwordConfirm';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const parsed = signupBodySchema.safeParse({ email, password, passwordConfirm });
    if (!parsed.success) {
      const next: Partial<Record<FieldKey, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === 'email' || key === 'password' || key === 'passwordConfirm') {
          if (!next[key]) next[key] = issue.message;
        }
      }
      setFieldErrors(next);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
        credentials: 'include',
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        authenticated?: boolean;
      };
      if (!res.ok) {
        setError(data.message ?? '회원가입 실패');
        return;
      }
      if (data.authenticated) {
        try {
          await fetch('/api/proxy/users/me', { credentials: 'include' });
        } catch {
          // 네트워크 등 - BFF 경로는 검증됨
        }
        router.push('/');
        return;
      }
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 실패');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
          {fieldErrors.email && (
            <p id="email-error" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
          />
          {fieldErrors.password && (
            <p id="password-error" role="alert">
              {fieldErrors.password}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="new-password"
            aria-invalid={!!fieldErrors.passwordConfirm}
            aria-describedby={fieldErrors.passwordConfirm ? 'passwordConfirm-error' : undefined}
          />
          {fieldErrors.passwordConfirm && (
            <p id="passwordConfirm-error" role="alert">
              {fieldErrors.passwordConfirm}
            </p>
          )}
        </div>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? '처리 중...' : '가입하기'}
        </button>
      </form>
      <p>
        이미 계정이 있으신가요? <Link href="/login">로그인</Link>
      </p>
    </main>
  );
}
