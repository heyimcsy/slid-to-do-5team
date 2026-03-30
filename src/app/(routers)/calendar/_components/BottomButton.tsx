'use client';

import { Icon } from '@/components/icon/Icon';
import { IconButton } from '@/components/ui/button';

export default function BottomButton() {
  return (
    <IconButton variant="outline" className="w-full">
      <Icon name="plus" variant="orange" />할 일 추가
    </IconButton>
  );
}
