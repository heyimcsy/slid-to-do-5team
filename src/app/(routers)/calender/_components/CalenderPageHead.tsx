'use client';

import Link from 'next/link';

import { Icon } from '@/components/icon/Icon';
import { IconButton } from '@/components/ui/button';

export default function CalenderPageHead() {
  const userInfo: string | null = localStorage.getItem('user-info');
  let userName: string = '';
  try {
    const parsed = userInfo
      ? (JSON.parse(userInfo) as { state?: { user?: { name?: string } } })
      : null;
    userName = parsed?.state?.user?.name ?? '';
  } catch {
    userName = '';
  }
  return (
    <div className="hidden w-full items-center justify-between md:flex">
      <h1 className="font-xl-semibold lg:font-2xl-semibold">{userName}님의 캘린더</h1>
      <Link href="/goals/todos/new" className="flex h-fit w-fit">
        <IconButton variant="outline">
          <Icon name="plus" variant="orange" />할 일 추가
        </IconButton>
      </Link>
    </div>
  );
}
