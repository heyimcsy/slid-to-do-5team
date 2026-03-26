'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';

export default function ItemActionBar({
  goalId,
  noteIds,
  linkUrl,
  favorites,
}: {
  goalId: number;
  noteIds: number[];
  linkUrl: string | null;
  favorites: boolean;
}) {
  const router = useRouter();
  const handleCopyLink = async (linkUrl: string) => {
    await navigator.clipboard.writeText(linkUrl);
  };
  return (
    <div className="flex h-fit shrink-0 space-x-[6px] lg:space-x-2">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          if (noteIds.length > 0) {
            router.push(`/goals/${goalId}/notes/${noteIds[0]}`);
          } else {
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
      {linkUrl && (
        <Button
          variant="icon"
          size="none"
          onClick={() => {
            linkUrl && handleCopyLink(linkUrl);
          }}
        >
          <Icon name="link" variant="orange" />
        </Button>
      )}
      <div className="hidden h-fit shrink-1 space-x-[6px] group-hover:flex lg:space-x-2">
        <Link href={`/goals/${goalId}/notes/${noteIds[0]}/edit`}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            variant="icon"
            size="none"
          >
            <Icon name="edit" />
          </Button>
        </Link>
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
