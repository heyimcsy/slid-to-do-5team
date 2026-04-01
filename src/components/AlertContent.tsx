'use client';

import type { Notification } from '@/api/notifications';

import { usePatchNotification } from '@/api/notifications';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';

export default function AlertContent({ notifications }: { notifications: Notification[] }) {
  const { mutate: patchNoti } = usePatchNotification();
  const handleReadNoti = useDebouncedCallback((id: number) => {
    patchNoti({ id });
  }, 300);
  return (
    <div
      className={cn(
        notifications.length === 0 && 'items-center justify-center',
        'flex max-h-84 min-h-31 flex-col overflow-y-scroll',
      )}
    >
      {notifications.length === 0 ? (
        <p className="font-sm-medium text-center text-gray-500">아직 알림이 없어요</p>
      ) : (
        <>
          {notifications.map((item: Notification) => (
            <button
              onClick={() => {
                if (item.isRead) return;
                handleReadNoti(item.id);
              }}
              key={item.id}
              className="flex h-21 w-full items-start gap-2 rounded-[16px] px-2 py-3 hover:bg-gray-50"
            >
              <div className="flex size-3 items-center justify-center">
                {!item.isRead && <div className="size-[6px] rounded-full bg-orange-500" />}
              </div>

              <div className="flex h-full flex-1 flex-col space-y-1 text-left">
                <div className="font-sm-medium line-clamp-2 h-10 text-gray-700">{item.message}</div>
                <p className="font-xs-regular text-gray-400">2분 전</p>
              </div>

              <div className="flex h-full items-center">
                <div className="size-10 rounded-full bg-gray-200" />
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  );
}
