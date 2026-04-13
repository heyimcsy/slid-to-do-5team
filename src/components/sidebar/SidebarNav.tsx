'use client';

import type { IconName } from '../icon/Icon';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGetGoals, usePostGoals } from '@/api/goals';
import { useGetMe } from '@/app/(routers)/profile/api/users';
import { useLogout } from '@/hooks/auth/useLogout';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib';
import { useSettingsModal } from '@/stores/useSettingModal';
import { AnimatePresence, motion } from 'motion/react';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import AlertPopover from '../AlertPopover';
import { Icon } from '../icon/Icon';

const navItems: { label: string; href: string; icon: IconName; hasArrow?: boolean }[] = [
  { label: '대시보드', href: '/dashboard', icon: 'dashboard' },
  { label: '목표', href: '/goals', icon: 'flag', hasArrow: true },
  { label: '캘린더', href: '/calendar', icon: 'calendar' },
  { label: '소통 게시판', href: '/community', icon: 'message' },
  { label: '찜한 할 일', href: '/favorites', icon: 'filledStar' },
];

const middleItems: { label: string; href: string; icon: IconName }[] = [
  { label: '설정', href: '/settings', icon: 'setting' },
];

const bottomItems: {
  label: string;
  href: string;
  icon: IconName;
  variant?: 'default' | 'white';
  textClassName: string;
  bgClassName?: string;
}[] = [
  {
    label: '새 목표',
    href: '/goals',
    icon: 'flagLine',
    variant: 'white',
    textClassName: 'text-white',
    bgClassName: 'bg-orange-500',
  },
  {
    label: '새 할일',
    href: `/goals/todos/new`,
    icon: 'task',
    textClassName: 'text-orange-500',
    bgClassName: 'white',
  },
];

export default function SidebarNav() {
  const { open: openSettings } = useSettingsModal();
  const { data: goalsData } = useGetGoals();
  const [goalInput, setGoalInput] = React.useState('');
  const { mutate: postGoal } = usePostGoals({
    onSuccess: () => {
      setGoalInput('');
      setIsInputVisible(false);
    },
  });
  const handleGoalSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && goalInput.trim()) {
      postGoal({ title: goalInput.trim() });
    }
  };
  const pathname = usePathname();
  /** `useState`/`useRef`를 `useLogout`·zustand보다 먼저 — HMR 시 이전 스냅샷과 슬롯이 맞고 Rules of Hooks 위반 방지 */
  const [isGoalsOpen, setIsGoalsOpen] = React.useState(false);
  // 목표탭 하위에 Input을 보여주는 상태 관리
  const [isInputVisible, setIsInputVisible] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const logout = useLogout();
  const { data: user } = useGetMe();
  const handleNewGoal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsGoalsOpen(true);
    setIsInputVisible(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 350);
  };

  const { setOpen, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div>
      <SidebarGroup className="p-0">
        <SidebarMenu className="gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  size="lg"
                  isActive={isActive}
                  render={!item.hasArrow ? <Link href={item.href} /> : undefined}
                  onClick={
                    item.hasArrow
                      ? () => setIsGoalsOpen((prev) => !prev)
                      : () => (isMobile ? setOpenMobile(false) : setOpen(false))
                  }
                  className="cursor-pointer px-4 group-data-[collapsible=icon]:hidden active:bg-transparent active:text-inherit [&_svg]:size-6"
                >
                  <Icon name={item.icon} variant={isActive ? 'orange' : 'default'} />
                  <span className="font-lg-semibold">{item.label}</span>
                </SidebarMenuButton>
                {item.hasArrow && (
                  <SidebarMenuAction onClick={() => setIsGoalsOpen(!isGoalsOpen)}>
                    <Icon
                      name="arrow"
                      direction={isGoalsOpen ? 'up' : 'down'}
                      size={36}
                      className="mt-1 mr-4"
                    />
                  </SidebarMenuAction>
                )}
                {item.hasArrow && (
                  <AnimatePresence>
                    {isGoalsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                          {goalsData?.goals.map((goal) => {
                            const isGoalActive = pathname === `/goals/${goal.id}`;
                            return (
                              <Link
                                onClick={() => (isMobile ? setOpenMobile(false) : setOpen(false))}
                                key={goal.id}
                                href={`/goals/${goal.id}`}
                                className={cn(
                                  'font-sm-semibold truncate px-6 py-2 hover:text-gray-900',
                                  isGoalActive ? 'text-orange-600' : 'text-gray-600',
                                )}
                              >
                                {goal.title}
                              </Link>
                            );
                          })}
                          <div
                            className={`mt-1 flex ${!isInputVisible && 'hidden'} items-center gap-2 border border-t-0 border-r-0 border-b-2 border-l-0 border-b-orange-500 bg-orange-200 px-4 py-2 text-orange-700`}
                          >
                            <input
                              ref={inputRef}
                              type="text"
                              value={goalInput}
                              onChange={(e) => setGoalInput(e.target.value)}
                              placeholder="입력 후 Enter"
                              onKeyDown={handleGoalSubmit}
                              className={`w-full cursor-text border-none bg-transparent ring-0 outline-none placeholder:text-orange-400 focus:border-none focus:ring-0 focus:outline-none ${!isInputVisible && 'hidden'}`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarMenu className="gap-3">
          {middleItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              {item.href === '/settings' ? (
                <button
                  type="button"
                  onClick={openSettings}
                  className="flex w-full cursor-pointer items-center gap-2 px-2 py-3 text-left"
                >
                  <Icon name={item.icon} className="group-data-[collapsible=icon]:hidden" />
                  <span className="font-lg-semibold text-gray-500 group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </button>
              ) : (
                <Link href={item.href} className="flex items-center gap-2 px-2 py-3">
                  <Icon name={item.icon} className="group-data-[collapsible=icon]:hidden" />
                  <span className="font-lg-semibold text-gray-500 group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </Link>
              )}
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem key="logout">
            <button
              type="button"
              onClick={() => void logout()}
              className="flex w-full cursor-pointer items-center gap-2 px-2 py-3 text-left"
            >
              <Icon name="logout" className="group-data-[collapsible=icon]:hidden" />
              <span className="font-lg-semibold text-gray-500 group-data-[collapsible=icon]:hidden">
                로그아웃
              </span>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="mt-16 mb-16">
        <SidebarMenu className="flex flex-row gap-3 group-data-[collapsible=icon]:hidden">
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.label} className="w-full">
              <Link
                href={item.href}
                onClick={item.label === '새 목표' ? handleNewGoal : undefined}
                className={`flex flex-row items-center justify-center gap-2 rounded-full border border-orange-500 px-4 py-3 md:flex-col md:rounded-xl md:px-6 md:py-8 ${item.bgClassName}`}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Icon name={item.icon} variant={item.variant} size={38} />
                </motion.div>
                <span className={`font-base-semibold md:font-lg-semibold ${item.textClassName}`}>
                  {item.label}
                </span>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="mt-4 flex items-center gap-2">
          <Link
            href="/profile"
            onClick={() => {
              if (isMobile) {
                setOpenMobile(false);
              } else {
                setOpen(false);
              }
            }}
            className="flex flex-1 cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-3 py-2 group-data-[collapsible=icon]:hidden"
          >
            <Image
              src={user?.image?.trim() || '/images/user-yellow.svg'}
              alt={`${user?.name ?? '손'}님 프로필 이미지`}
              width={40}
              height={40}
              className="min-h-[40px] min-w-[40px] rounded-full object-cover"
              priority
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-sm-medium" title={user?.name}>
                  {user?.name}
                </span>
                <Icon name="arrow" direction="right" size={12} />
              </div>
              <span className="font-sm-regular max-w-32 truncate text-gray-300" title={user?.email}>
                {user?.email}
              </span>
            </div>
          </Link>
          <div className="relative hidden group-data-[collapsible=icon]:hidden md:block">
            {/* 아이콘 수정 */}
            <AlertPopover />
          </div>
        </div>
      </SidebarGroup>
    </div>
  );
}
