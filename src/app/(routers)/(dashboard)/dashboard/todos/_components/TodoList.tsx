import type { Task } from '../types';

import TodoItem from './TodoItem';

interface TodoListProps {
  todolists: Task[];
}

export default function TodoList({ todolists }: TodoListProps) {
  return (
    <div className="flex-1 rounded-2xl bg-white px-4 py-3 shadow-sm">
      {todolists.map((todo) => (
        <TodoItem key={todo.id} task={todo} />
      ))}
    </div>
  );
}
