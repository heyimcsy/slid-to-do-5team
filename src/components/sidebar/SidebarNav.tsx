'use client';

import type { IconName } from '../icon/Icon';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

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
  { label: '로그아웃', href: '/logout', icon: 'logout' },
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
    href: '/newtodo',
    icon: 'task',
    textClassName: 'text-orange-500',
    bgClassName: 'white',
  },
];
const tempGoals = [
  { id: 1, label: '자바스크립트로 웹 서비스 만들기' },
  { id: 2, label: '디자인 시스템 강의 듣기' },
  { id: 3, label: '코드잇 강의 듣기' },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [isGoalsOpen, setIsGoalsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleNewGoal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsGoalsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 350);
  };

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
                  onClick={item.hasArrow ? () => setIsGoalsOpen((prev) => !prev) : undefined}
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
                          {tempGoals.map((goal) => (
                            <Link
                              key={goal.id}
                              href={`/goals/${goal.id}`}
                              className="font-sm-semibold truncate px-6 py-2 text-gray-600 hover:text-gray-900"
                            >
                              {goal.label}
                            </Link>
                          ))}
                          <div className="mt-1 flex items-center gap-2 border border-t-0 border-r-0 border-b-2 border-l-0 border-b-orange-500 bg-orange-200 px-4 py-2 text-orange-700">
                            <input
                              ref={inputRef}
                              type="text"
                              placeholder="입력 후 Enter"
                              className="w-full cursor-text border-none bg-transparent ring-0 outline-none placeholder:text-orange-400 focus:border-none focus:ring-0 focus:outline-none"
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
              <Link href={item.href} className="flex items-center gap-2 px-2 py-3">
                <Icon name={item.icon} className="group-data-[collapsible=icon]:hidden" />
                <span className="font-lg-semibold text-gray-500 group-data-[collapsible=icon]:hidden">
                  {item.label}
                </span>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="mt-16 mb-16">
        <SidebarMenu className="flex flex-row gap-3 group-data-[collapsible=icon]:hidden">
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.label} className="w-full">
              <Link
                href={item.href}
                onClick={item.label === '새 목표' ? handleNewGoal : undefined}
                className={`flex flex-row items-center justify-center gap-2 rounded-full border border-orange-500 px-6 py-4 md:flex-col md:rounded-xl md:py-8 ${item.bgClassName}`}
              >
                <Icon name={item.icon} variant={item.variant} size={38} />
                <span className={`font-lg-semibold ${item.textClassName}`}>{item.label}</span>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 px-3 py-2 group-data-[collapsible=icon]:hidden">
            <div>img</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-sm-medium">체다치즈</span>
                <Icon name="arrow" direction="right" size={12} />
              </div>
              <span className="font-sm-regular text-gray-300">chedacheese@slid.kr</span>
            </div>
          </div>
          <div className="relative hidden group-data-[collapsible=icon]:hidden md:block">
            {/* 아이콘 수정 */}
            <button aria-label="알림" className="rounded-full border border-gray-200 p-5">
              <Icon name="bell" />
            </button>
          </div>
        </div>
      </SidebarGroup>
    </div>
  );
}
