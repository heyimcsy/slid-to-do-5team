export const ROUTES = {
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  SIGNUP: '/signup',

  // Goals
  GOALS: '/goals',
  GOAL_DETAIL: (goalId: number) => `/goals/${goalId}`,

  // Todos
  TODO_DETAIL: (goalId: number, todoId: number) => `/goals/${goalId}/todos/${todoId}`,
  TODO_EDIT: (goalId: number, todoId: number) => `/goals/${goalId}/todos/${todoId}/edit`,
  TODO_NEW: '/goals/todos/new',

  // Notes
  NOTE_DETAIL: (goalId: number, noteId: number, todoId?: number) =>
    `/goals/${goalId}/notes/${noteId}${todoId !== undefined ? `?todoId=${todoId}` : ''}`,
  NOTE_EDIT: (goalId: number, noteId: number) => `/goals/${goalId}/notes/${noteId}/edit`,
  NOTE_NEW: (goalId: number, todoId?: number) =>
    `/goals/${goalId}/notes/new${todoId ? `?todoId=${todoId}` : ''}`,

  // Community
  COMMUNITY: '/community',
  COMMUNITY_NEW: '/community/new',
  COMMUNITY_DETAIL: (id: number) => `/community/${id}`,

  // Favorites
  FAVORITES: '/favorites',

  // Calendar
  CALENDAR: (goalId?: number) => `/calendar${goalId ? `?goalId=${goalId}` : ''}`,

  // Profile
  PROFILE: '/profile',
} as const;
