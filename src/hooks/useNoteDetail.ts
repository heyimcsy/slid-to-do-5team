import { useGetNote } from '@/api/notes';
import { useGetTodo } from '@/api/todos';

export const useNoteDetail = ({ noteId, todoId }: { noteId: number; todoId: number }) => {
  const noteQuery = useGetNote({ id: noteId });
  const todoQuery = useGetTodo({ id: todoId });

  return {
    noteData: noteQuery.data,
    todoData: todoQuery.data,
    isLoading: noteQuery.isLoading || todoQuery.isLoading,
    isSuccess: noteQuery.isSuccess && todoQuery.isSuccess,
  };
};
