import { cva } from 'class-variance-authority';

/** RSC·클라이언트 공용 — `button.tsx`는 `'use client'`라 여기서만 cva 정의 */
export const buttonVariants = cva(
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
