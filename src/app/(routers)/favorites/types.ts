export interface FavoritesResponse {
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
