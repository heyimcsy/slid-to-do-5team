import type { TodoWithFavorites } from '@/api/todos';

import { TodoListSection } from './TodoListSection';

function matchesTodoSearch(title: string, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return title.toLowerCase().includes(q);
}

export function TodoContainer({
  todos,
  searchQuery = '',
}: {
  todos: TodoWithFavorites[];
  searchQuery?: string;
}) {
  const list = (todos ?? []).filter((item) => matchesTodoSearch(item.title, searchQuery));
  const todoList = list.filter((item) => !item.done);
  const doneList = list.filter((item) => item.done);

  return (
    <div className="flex flex-col gap-x-8 gap-y-2 md:flex-row md:gap-2 lg:flex-row lg:gap-8">
      {/* TO DO 섹션 */}
      <TodoListSection title="TO DO" items={todoList} variant="pending" />

      {/* DONE 섹션 */}
      <TodoListSection title="DONE" items={doneList} variant="completed" />
    </div>
  );
}
