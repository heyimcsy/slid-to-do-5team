import { apiClient } from '@/lib/apiClient.browser';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

interface FavoritesResponse {
  favorites: Favorite[];
  nextCursor: number | null;
  totalCount: number;
}

export interface Favorite {
  id: number;
  teamId: string;
  userId: number;
  todoId: number;
  createdAt: string;
  todo: {
    id: number;
    title: string;
    done: boolean;
    goal: {
      id: number;
      title: string;
    };
    noteIds: number[];
  };
}

export const toTask = (fav: Favorite) => ({
  id: fav.todo.id,
  teamId: fav.teamId,
  userId: fav.userId,
  goalId: fav.todo.goal.id,
  title: fav.todo.title,
  done: fav.todo.done,
  fileUrl: null,
  linkUrl: null,
  dueDate: '',
  createdAt: fav.createdAt,
  updatedAt: fav.createdAt,
  goal: fav.todo.goal,
  noteIds: fav.todo.noteIds ?? [],
  tags: [],
  favorites: true,
});

export const favoritesQueryKeys = {
  all: ['favorites'] as const,
  list: () => [...favoritesQueryKeys.all, 'list'] as const,
};

export const useGetFavorites = () => {
  const limit = 20;

  return useInfiniteQuery({
    queryKey: favoritesQueryKeys.list(),
    queryFn: ({ pageParam }) =>
      apiClient<FavoritesResponse>(
        `/todos/favorites?limit=${limit}${pageParam ? `&cursor=${pageParam}` : ''}`,
      ),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};
