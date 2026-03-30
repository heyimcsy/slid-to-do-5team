'use client';

import * as React from 'react';
import { cn } from '@/lib/shadcn';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { ArrowDown01Icon, ArrowUp01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Icon } from '@/components/icon/Icon';

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: Readonly<SelectPrimitive.Group.Props>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-1 p-1', className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: Readonly<SelectPrimitive.Value.Props>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('flex flex-1 text-left', className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = 'default',
  iconTrigger = false,
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: 'sm' | 'default';
  iconTrigger?: boolean;
}) {
  const isIconMode = iconTrigger && size === 'sm';
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={
        isIconMode
          ? cn(
              'flex size-8 cursor-pointer items-center justify-center rounded-full border-none bg-transparent outline-none data-popup-open:ring-[1px] data-popup-open:ring-orange-500/30',
              className,
            )
          : cn(
              // 레이아웃
              'flex h-fit w-full items-center justify-between gap-1.5 bg-gray-50 whitespace-nowrap data-[size=sm]:w-[102px] data-[size=sm]:border-0',
              // 사이즈
              'max-w-143 data-[size=default]:px-3 data-[size=default]:py-3 data-[size=sm]:px-[10px] data-[size=sm]:py-2 lg:max-w-164 data-[size=default]:lg:py-4',
              // 테두리 & 모양
              'rounded-[16px] border border-gray-100',
              // 텍스트
              'data-placeholder:text-muted-foreground data-[size=sm]:text-sm-regular data-[size=default]:text-sm-regular data-[size=default]:lg:text-base-regular text-gray-700',
              // 트랜지션
              'transition-colors outline-none',
              // 포커스
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              // 유효성 에러 (aria-invalid)
              'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-[3px]',
              'dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
              // 비활성화
              'disabled:cursor-not-allowed disabled:opacity-50',
              // 자식 요소 (select-value 슬롯)
              '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5',
              // 자식 요소 (svg 아이콘)
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              // 열린 상태 (active)
              'data-popup-open:border-orange-500 data-popup-open:ring-[1px] data-popup-open:ring-orange-500/30',
              className,
            )
      }
      {...props}
    >
      {children}
      {size === 'default' && (
        <SelectPrimitive.Icon render={<Icon name="arrow" direction="down" size={24} />} />
      )}
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  size = 'default',
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = false,
  ...props
}: { size?: 'default' | 'sm' } & SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            // 레이아웃 & 위치
            'relative isolate z-50',
            // 사이즈
            size === 'default'
              ? 'max-h-(--available-height) w-(--anchor-width) min-w-36'
              : 'max-h-(--available-height) data-[size=sm]:w-[102px]',
            // 모양
            'overflow-x-hidden overflow-y-auto rounded-[16px]',
            // 배경 & 텍스트
            'bg-popover text-popover-foreground',
            // 그림자 & 링
            'ring-foreground/5 shadow-2xl',
            // 트랜지션 속도
            'origin-(--transform-origin) duration-100',
            // 열림 애니메이션
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            // 닫힘 애니메이션
            'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            // 방향별 slide 애니메이션
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
            'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
            'data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2',
            // 예외 처리
            'data-[align-trigger=true]:animate-none',
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: Readonly<SelectPrimitive.GroupLabel.Props>) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn('text-muted-foreground px-3 py-2.5 text-xs', className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  size = 'default',
  ...props
}: { size?: 'default' | 'sm' } & SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        // 레이아웃
        'relative flex w-full items-center gap-2.5 rounded-[8px] lg:rounded-[10px]',
        // 사이즈 & 여백
        'py-2 pr-8 pl-3',
        // 텍스트 & 커서
        'cursor-default outline-hidden select-none',
        // 포커스
        'focus:bg-orange-alpha-20 focus:text-orange-600',
        // 비활성화
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        // 자식 요소 (svg 아이콘)
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // 자식 요소 (span 마지막)
        '*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="text-sm-medium lg:text-base-medium flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      {size === 'default' && (
        <SelectPrimitive.ItemIndicator
          render={
            <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
          }
        >
          <HugeiconsIcon
            icon={Tick02Icon}
            strokeWidth={2}
            className="pointer-events-none text-orange-600"
          />
        </SelectPrimitive.ItemIndicator>
      )}
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: Readonly<SelectPrimitive.Separator.Props>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('bg-border/50 pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "bg-popover top-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bg-popover bottom-0 z-10 flex w-full cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
