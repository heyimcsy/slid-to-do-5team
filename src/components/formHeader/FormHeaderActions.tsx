import { cn } from '@/lib/shadcn';

interface FormHeaderActionsProps {
  variant: 'mobile' | 'desktop';
  isSubmitDisabled: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmitClick: () => void;
}

export function FormHeaderActions({
  variant,
  isSubmitDisabled,
  submitLabel,
  onCancel,
  onSubmitClick,
}: FormHeaderActionsProps) {
  const isMobile = variant === 'mobile';

  const baseBtn = isMobile ? 'px-[6px] py-[2px]' : 'w-[106px] rounded-full border px-[18px] py-2.5';

  return (
    <div className={cn('flex items-center', isMobile ? 'gap-1' : 'gap-2')}>
      <button
        type="button"
        onClick={onCancel}
        className={cn(
          'font-sm-medium',
          baseBtn,
          'text-gray-500',
          !isMobile && 'font-sm-semibold border-gray-300 hover:bg-gray-50',
        )}
      >
        취소
      </button>
      <button
        type="button"
        onClick={onSubmitClick}
        disabled={isSubmitDisabled}
        className={cn(
          baseBtn,
          isMobile
            ? 'font-sm-semibold text-orange-500 disabled:cursor-not-allowed disabled:text-gray-300'
            : 'font-sm-semibold bg-orange-500 text-white disabled:cursor-not-allowed disabled:bg-gray-300',
        )}
      >
        {submitLabel}
      </button>
    </div>
  );
}
