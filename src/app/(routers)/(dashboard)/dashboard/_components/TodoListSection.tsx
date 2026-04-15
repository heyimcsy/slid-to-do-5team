import type { TodoWithFavorites } from '@/api/todos';

import Image from 'next/image';
import { cn } from '@/lib';

import TodoList from './TodoList';

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
        variant === 'completed'
          ? ''
          : 'bg-orange-100 text-black dark:bg-orange-300 dark:text-black',
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
            <Image
              src={emptyImage}
              alt={`${emptyText} 할 일 없음`}
              width={130}
              height={140}
              className="h-21.25 w-20 object-contain md:h-35 md:w-32.5 lg:h-35 lg:w-32.5"
            />
            <p className="text-sm text-gray-500 dark:text-black">{`${emptyText} 할 일이 없어요`}</p>
          </div>
        ) : (
          items.map((item) => <TodoList key={item.id} {...item} variant={variant} />)
        )}
      </div>
    </section>
  );
}
