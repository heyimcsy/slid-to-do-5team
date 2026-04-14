import type { TodoWithFavorites } from '@/api/todos';

import TodoList from '@/app/(routers)/(todo)/goals/[goalId]/_components/TodoList';
import { cn } from '@/lib';
import Image from 'next/image';

export function TodoListSection({
  title,
  items,
  variant,
}: {
  title: string;
  items: TodoWithFavorites[];
  variant: 'completed' | 'pending';
}) {
  const emptyText = variant === 'completed' ? '완료된' : '해야';
  const emptyImage =
    variant === 'completed' ? '/images/big-zero-done.svg' : '/images/big-zero-todo.svg';
  return (
    <section
      className={cn(
        'flex-1 rounded-2xl p-4 md:p-4 lg:p-6',
        variant === 'completed' ? '' : 'bg-orange-100',
      )}
    >
      <h2
        className={`text-xl font-bold ${variant === 'completed' ? 'text-gray-400' : 'text-orange-600'}`}
      >
        {title}
      </h2>
      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <Image src={emptyImage} alt={`${emptyText} 할 일 없음`} width={130} height={140} />
            <p className="text-sm text-gray-500">{`${emptyText} 할 일이 없어요`}</p>
          </div>
        ) : (
          items.map((item) => <TodoList key={item.id} {...item} />)
        )}
      </div>
    </section>
  );
}
