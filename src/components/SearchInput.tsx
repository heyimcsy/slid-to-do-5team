import * as React from 'react';
import { cn } from '@/lib/shadcn';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

// shadcn의 InputGroupInput을 기반으로 className과 placeholder을 커스텀하여 사용하는 컴포넌트
type SearchInputProps = {
  className?: string;
  placeholder?: string;
} & Omit<React.ComponentProps<typeof InputGroupInput>, 'placeholder'>;

function SearchInput({
  className,
  placeholder = '할 일을 검색해주세요',
  ...props
}: SearchInputProps) {
  return (
    <InputGroup className={cn('h-fit min-h-12 min-w-fit rounded-full bg-transparent', className)}>
      <InputGroupInput
        aria-label={props['aria-label'] ?? placeholder ?? '검색'}
        className="font-base-regular px-5 py-3 text-gray-700 placeholder:text-gray-500"
        placeholder={placeholder}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <HugeiconsIcon icon={Search01Icon} />
      </InputGroupAddon>
    </InputGroup>
  );
}

export { SearchInput };
