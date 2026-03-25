'use client';

import { useRouter } from 'next/navigation';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';

export default function ItemActionBar({
  noteIds,
  link,
  favorites,
}: {
  noteIds: number[];
  link: string | null;
  favorites: boolean;
}) {
  const goalId = 1;
  const router = useRouter();
  return (
    <div className="flex h-fit shrink-0 space-x-[6px] lg:space-x-2">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          if (noteIds.length > 0) {
            router.push(`/goals/${goalId}/notes/${noteIds[0]}`);
          } else {
            // router.push(`/goals/${goalId}/notes/new`);
            //TODO :이게 맞누 ㅜ
            window.location.href = `/goals/${goalId}/notes/new`;
          }
        }}
        aria-label={noteIds.length > 0 ? '노트 열기' : '새 노트 만들기'}
        variant="icon"
        size="none"
      >
        <Icon name="note" variant="orange" />
      </Button>
      {link && <Icon name="link" variant="orange" />}
      <div className="hidden h-fit shrink-1 space-x-[6px] group-hover:flex lg:space-x-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          variant="icon"
          size="none"
        >
          <Icon name="edit" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          variant="icon"
          size="none"
        >
          <Icon name="dotscircle" />
        </Button>
      </div>
      <Icon
        name={favorites ? 'filledStar' : 'outlineStar'}
        variant={favorites ? 'orange' : undefined}
      />
    </div>
  );
}
