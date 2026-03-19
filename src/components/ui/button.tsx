'use client';

import type { VariantProps } from 'class-variance-authority';

import React from 'react';
import { cn } from '@/lib/shadcn';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "group/button min-w-fit inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-colors duration-300 outline-none select-none cursor-pointer focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          'bg-orange-500 border border-transparent text-white hover:bg-orange-600 disabled:bg-gray-300',
        outline:
          'bg-transparent border border-orange-500 text-orange-500 hover:border-orange-600 hover:text-orange-600 disabled:border-gray-400 disabled:text-gray-400',
        ghost:
          'bg-transparent border border-gray-300 text-gray-500 hover:text-gray-600 disabled:text-gray-300',
        icon: 'bg-transparent',
      },
      size: {
        none: 'size-fit',
        sm: 'text-sm md:text-base lg:text-lg px-3 py-2',
        md: 'text-sm md:text-base lg:text-lg px-3 md:px-4 py-2 md:py-2.5',
        lg: 'text-sm md:text-base lg:text-lg px-4 md:px-5 py-2.5 md:py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

// children에 span 포함 text(string) 여부를 검사하는 유틸리티 함수
const hasTextInChildren = (children: React.ReactNode): boolean => {
  return React.Children.toArray(children).some((child) => {
    if (typeof child === 'string') {
      return child.trim().length > 0;
    }
    if (
      React.isValidElement(child) &&
      (child.props as { children?: React.ReactNode }).children != null
    ) {
      return hasTextInChildren((child.props as { children?: React.ReactNode }).children);
    }
    return false;
  });
};

// Shadcn 기본 ButtonPrimitive에 buttonVariants 추가하여 타입 정의
type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

// ref 추가하여 필요 시 리렌더링이 필요하지 않은 컴포넌트에 대해 성능 최적화
// 사용법: <Button variant="default" size="md">Button CTA</Button>
/**
 *
 * @param ref (optional)
 * @param className (optional)
 * @param variant
 * @param size
 * @param children
 * @param props
 * @returns Button
 * @description 사용법: `<Button variant="default" size="md">Button CTA</Button>`
 */
function Button({
  ref,
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const hasText = hasTextInChildren(children);
  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), hasText && 'gap-x-1.5')}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  );
}

// icon이 포함된 버튼 컴포넌트에 웹 접근성(ARIA6)을 위해 aria-label 또는 aria-labelledby 속성 정의 요건 추가
type IconButtonProps = Omit<ButtonPrimitive.Props, 'aria-label' | 'aria-labelledby'> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
    'aria-label'?: string;
    'aria-labelledby'?: string;
  };

// ref 추가하여 필요 시 리렌더링이 필요하지 않은 컴포넌트에 대해 성능 최적화
// 사용법: <IconButton variant="default" size="md"><HugeiconsIcon icon={Add01Icon} /> <span>추가하기</span></IconButton>
/**
 *
 * @param ref
 * @param className
 * @param variant
 * @param size
 * @param children
 * @param props
 * @returns IconButton
 * @description 사용법: `<IconButton variant="default" size="md"><HugeiconsIcon icon={Add01Icon} /> <span>추가하기</span></IconButton>`
 */
function IconButton({
  ref,
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: IconButtonProps) {
  const hasText = hasTextInChildren(children);
  const ariaLabel = props['aria-label'];

  if (
    process.env.NODE_ENV === 'development' &&
    !hasText &&
    (ariaLabel === undefined || ariaLabel === '')
  ) {
    console.warn(
      '[IconButton] 아이콘만 있는 버튼은 접근성(ARIA6)을 위해 aria-label을 반드시 지정해주세요.',
    );
  }

  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), hasText && 'gap-x-1.5')}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants, IconButton };
