import { cn } from '@/lib/shadcn';

interface SpinnerProps {
  className?: string;
  text?: string;
}

function Spinner({ className, text }: SpinnerProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      role="status"
      aria-live="polite"
      aria-label={text || '로딩 중'}
    >
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-lg',
          className,
        )}
      >
        <div className="size-5 animate-spin rounded-full border-[3px] border-orange-500 border-t-transparent" />
        {text && <span className="font-base-medium text-gray-700">{text}</span>}
      </div>
    </div>
  );
}

export { Spinner };
