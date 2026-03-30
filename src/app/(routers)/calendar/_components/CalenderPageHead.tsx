'use client';

import { Icon } from '@/components/icon/Icon';
import { IconButton } from '@/components/ui/button';

export default function CalenderPageHead() {
  const userInfo = localStorage.getItem('user-info');
  const parsedUserInfo = userInfo ? JSON.parse(userInfo).state : null;
  const userName: string = parsedUserInfo.user.name ? parsedUserInfo.user.name : '';
  return (
    <div className="hidden w-full items-center justify-between md:flex">
      <h1 className="font-xl-semibold lg:font-2xl-semibold">{userName}님의 캘린더</h1>
      <IconButton variant="outline">
        <Icon name="plus" variant="orange" />할 일 추가
      </IconButton>
    </div>
  );
}
