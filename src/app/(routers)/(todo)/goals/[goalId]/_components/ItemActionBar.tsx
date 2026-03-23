'use client';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';

export default function ItemActionBar({
  note,
  link,
  favorites,
}: {
  note: boolean;
  link: boolean;
  favorites: boolean;
}) {
  return (
    <div className="flex h-fit shrink-0 space-x-[6px] lg:space-x-2">
      {note && <Icon name="note" variant="orange" />}
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
