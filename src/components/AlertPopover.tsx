'use client';

import type { Notification } from '@/api/notifications';

import { useGetNotifications, usePatchNotifications } from '@/api/notifications';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';

import AlertContent from '@/components/AlertContent';
import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function AlertPopover() {
  const { data, isLoading, isSuccess } = useGetNotifications({ limit: 20 });
  const { mutate: patchNotis } = usePatchNotifications();
  const notifications: Notification[] = data?.notifications || [];
  const hasUnread: boolean = notifications.some((item: Notification) => !item.isRead);

  const handleReadNotis = useDebouncedCallback(() => {
    patchNotis();
  }, 300);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            aria-label="알림"
            className="relative cursor-pointer rounded-full border border-gray-200 p-5"
          >
            <Icon name="bell" />
            {hasUnread && (
              <span className="absolute top-1 right-1 size-3 rounded-full bg-orange-500" />
            )}
          </button>
        }
      ></PopoverTrigger>
      <PopoverContent
        className="w-[289px] border border-gray-200 px-3 py-5"
        align="end"
        side="right"
      >
        <div className="flex items-center justify-between">
          <span className="font-sm-semibold">알림</span>
          <Button
            onClick={handleReadNotis}
            variant="icon"
            size="none"
            className={cn(
              notifications.length > 0 || !hasUnread ? 'text-orange-500' : 'text-gray-200',
              'font-xs-regular',
            )}
          >
            모두 읽기
          </Button>
        </div>
        {isLoading && (
          <div className="flex max-h-84 min-h-31 flex-col overflow-y-scroll">
            {[1, 2, 3, 4].map((a: number) => (
              <div
                key={a}
                className="flex h-21 w-full shrink-0 space-x-2 rounded-[16px] px-2 py-3 hover:bg-gray-50"
              >
                <div className="flex size-3 items-center justify-center">
                  <div className="size-[6px] animate-pulse rounded-[3px] bg-orange-500" />
                </div>
                <div className="flex h-full w-44 flex-col justify-between">
                  <div className="h-3 w-full animate-pulse rounded-sm bg-gray-200" />
                  <div className="h-3 w-full animate-pulse rounded-sm bg-gray-200" />
                  <p className="h-3 w-1/3 animate-pulse rounded-sm bg-gray-200" />
                </div>
                <div className="flex h-full w-11 items-center pl-1">
                  <div className="size-10 animate-pulse rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}
        {isSuccess && <AlertContent notifications={notifications} />}
      </PopoverContent>
    </Popover>
  );
}
