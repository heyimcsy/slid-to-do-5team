export type PaginatedResponse<T, K extends string = 'goals'> = {
  [key in K]: T[];
} & {
  nextCursor: number | null;
  totalCount: number;
};
