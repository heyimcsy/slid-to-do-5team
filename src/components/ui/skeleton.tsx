import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/shadcn';
import { cva } from 'class-variance-authority';

const skeletonVariants = cva('animate-pulse rounded-xl', {
  variants: {
    variant: {
      default: 'bg-muted',
      gray: 'bg-gray-200',
    },
  },
  defaultVariants: { variant: 'default' },
});

function Skeleton({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof skeletonVariants>) {
  return (
    <div data-slot="skeleton" className={cn(skeletonVariants({ variant }), className)} {...props} />
  );
}

export { Skeleton };
