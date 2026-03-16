import { cn } from '@/lib';

type ChipVariant = 'todo' | 'done';

interface ChipProps {
  variant: ChipVariant;
  className?: string;
}

const chipStyles: Record<ChipVariant, string> = {
  todo: 'bg-orange-200 text-orange-600',
  done: 'bg-gray-300 text-white',
};

const chipLabels: Record<ChipVariant, string> = {
  todo: 'TO DO',
  done: 'DONE',
};

export function Chips({ variant, className }: Readonly<ChipProps>) {
  return (
    <span
      className={cn(
        'font-xs-semibold inline-flex h-6 w-12 items-center justify-center rounded-[8px] px-2 py-1 whitespace-nowrap',
        chipStyles[variant],
        className,
      )}
    >
      {chipLabels[variant]}
    </span>
  );
}
