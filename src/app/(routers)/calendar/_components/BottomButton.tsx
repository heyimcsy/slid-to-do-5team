import Link from 'next/link';

import { Icon } from '@/components/icon/Icon';
import { IconButton } from '@/components/ui/button';

export default function BottomButton() {
  return (
    <Link href="/goals/todos/new" className="flex h-fit w-full">
      <IconButton variant="outline" className="w-full">
        <Icon name="plus" variant="orange" />할 일 추가
      </IconButton>
    </Link>
  );
}
