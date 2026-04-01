'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib';
import { useSettingsModal } from '@/stores/useSettingModal';
import { Monitor } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTheme } from 'next-themes';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function SettingsModal() {
  const { isOpen, close } = useSettingsModal();

  const { setTheme, theme } = useTheme();
  const refTheme = useRef('light');
  const confirmed = useRef(false);
  const options = [
    { value: 'light', icon: <Icon name="sun" size={24} /> },
    { value: 'dark', icon: <Icon name="moon" size={24} /> },
    {
      value: 'system',
      icon: <HugeiconsIcon icon={Monitor} className="size-7 text-gray-400" />,
    },
  ] as const;

  const handleClose = (open: boolean) => {
    if (!open) {
      if (!confirmed.current) {
        setTheme(refTheme.current); // 확인 안 누르고 닫으면 롤백
      }
      confirmed.current = false;
      close();
    }
  };

  useEffect(() => {
    if (theme != null) {
      refTheme.current = theme;
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-[357px]">
        <DialogHeader className="flex flex-row justify-start">
          <DialogTitle className="">설정</DialogTitle>
        </DialogHeader>
        <h3 className="font-base-semibold mt-8 text-gray-700">다크모드</h3>
        <div className="relative mt-2 inline-flex w-83 space-x-2 rounded-full bg-gray-50 p-2">
          {/* 슬라이딩 thumb */}
          <div
            className={cn(
              'absolute top-2 h-[calc(100%-16px)] rounded-full bg-white transition-all duration-200',
              theme === 'light' && 'left-2 w-25',
              theme === 'dark' && 'left-29 w-25',
              theme === 'system' && 'left-56 w-25',
            )}
          />
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setTheme(opt.value);
              }}
              className={cn(
                'relative z-10 flex h-10 w-25 items-center justify-center rounded-full transition-colors',
              )}
            >
              {opt.icon}
            </button>
          ))}
        </div>
        <DialogFooter className="mt-10">
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                className="w-1/2"
                onClick={() => {
                  setTheme(refTheme.current);
                }}
              >
                취소
              </Button>
            }
          />
          <DialogClose
            render={
              <Button
                type="button"
                variant="default"
                className="w-1/2"
                onClick={() => {
                  confirmed.current = true;
                }}
              >
                확인
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
