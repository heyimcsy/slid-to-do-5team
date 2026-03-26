'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authUserStore } from '@/stores/authUserStore';

import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const user = authUserStore((s) => s.user);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <h1>🏗️ 홈페이지 작업 중 🚧</h1>
        {user ? (
          <>
            <h1>{`${user?.name}님 환영합니다.`}</h1>
            <p>이메일: {user?.email}</p>
            <h3>프로필 이미지: null이면 지구본 나옴</h3>
            {user?.image ? (
              <Image src={user.image} alt="프로필 이미지" width={40} height={40} priority />
            ) : (
              <Image src="/globe.svg" alt="프로필 이미지" width={40} height={40} priority />
            )}
            <Button onClick={() => router.push('/logout')} variant="outline">
              로그아웃
            </Button>
          </>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => router.push('/login')}>로그인</Button>
            <Button onClick={() => router.push('/signup')} variant="outline">
              회원가입
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
