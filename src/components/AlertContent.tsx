'use client';

import type { Notification } from '@/api/notifications';
import type { TodoResponse } from '@/api/todos';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import basicImage from '@/../public/images/user-yellow.svg';
import { usePatchNotification } from '@/api/notifications';
import { fetchTodo } from '@/api/todos';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { cn } from '@/lib';
import { useQueryClient } from '@tanstack/react-query';

import { ROUTES } from '@/constants/routes';

import { formatRelativeTime } from '@/utils/formatRelativeTime';

export default function AlertContent({
  notifications,
}: Readonly<{ notifications: Notification[] }>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: patchNoti } = usePatchNotification();

  const handleReadNoti = useDebouncedCallback(async (item: Notification) => {
    if (item.type === 'todo') {
      const data: TodoResponse = await queryClient.fetchQuery({
        queryKey: ['todo', item.resourceId],
        queryFn: () => fetchTodo(item.resourceId),
      });
      router.push(ROUTES.TODO_DETAIL(data.goalId, item.resourceId));
    }
    if (item.type === 'goal') {
      router.push(ROUTES.GOAL_DETAIL(item.resourceId));
    }
    if (item.type === 'comment') {
      router.push(ROUTES.COMMUNITY_DETAIL(item.resourceId));
    }
    if (item.isRead) return;
    patchNoti({ id: item.id });
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
                handleReadNoti(item);
              }}
              key={item.id}
              className="flex h-21 w-full items-start gap-2 rounded-[16px] px-2 py-3 hover:bg-gray-50"
            >
              <div className="flex size-3 items-center justify-center">
                {!item.isRead && <div className="size-[6px] rounded-full bg-orange-500" />}
              </div>

              <div className="flex h-full flex-1 flex-col space-y-1 text-left">
                <div className="font-sm-medium line-clamp-2 h-10 text-gray-700">{item.message}</div>
                {item.type === 'comment' && item.data && (
                  <p className="font-sm-medium mt-[-16px] line-clamp-1 text-gray-400">
                    &#34;{item.data.commentContent}&#34;
                  </p>
                )}
                <p className="font-xs-regular text-gray-400">
                  {formatRelativeTime(item.createdAt)}
                </p>
              </div>

              <div className="flex h-full items-center">
                <Image
                  src={item.data?.userImage || basicImage}
                  alt="유저 이미지"
                  height={40}
                  width={40}
                  className="min-h-[40px] min-w-[40px] rounded-full object-cover"
                />
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  );
}
