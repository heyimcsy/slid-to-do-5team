import type { Tag, Tags } from '@/api/todos';

export const TAG_COLORS = ['green', 'gray', 'yellow', 'red', 'purple'] as const;
export type TagColor = (typeof TAG_COLORS)[number];

// Tag[] → Tags[] 변환 함수
export const mapTagsWithColor = (tags: Tag[]): Tags[] =>
  tags.map((tag, index) => ({
    id: tag.id,
    name: tag.name,
    color: TAG_COLORS[index % TAG_COLORS.length], // 순환
  }));
