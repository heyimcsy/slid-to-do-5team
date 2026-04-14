export const COLORS = ['gray', 'green', 'yellow', 'red', 'purple'] as const;
export type TagColor = (typeof COLORS)[number];

export interface Tag {
  name: string;
  color: TagColor;
}
