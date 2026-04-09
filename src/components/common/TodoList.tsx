import type { TodoWithFavorites } from '@/api/todos';

import Image from 'next/image';

import TodoItem from './TodoItem';

interface TodoListProps {
  todolists: TodoWithFavorites[];
}

export default function TodoList({ todolists }: TodoListProps) {
  return (
    <div className="w-full flex-1 rounded-2xl bg-white px-2 py-3 shadow-sm">
      {todolists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Image
            className="hidden md:block"
            src="/images/big-zero-done.svg"
            alt="empty"
            width={130}
            height={140}
          />
          <Image
            className="md:hidden"
            src="/images/big-zero-done.svg"
            alt="empty"
            width={80}
            height={85}
          />
          <p className="mt-4 text-sm text-gray-400">아직 등록한 할 일이 없어요</p>
        </div>
      ) : (
        <ul>
          {todolists.map((todo) => (
            <TodoItem key={todo.id} task={todo} />
          ))}
        </ul>
      )}
    </div>
  );
}
