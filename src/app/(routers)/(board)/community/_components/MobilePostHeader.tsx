import { SidebarTrigger } from '@/components/ui/sidebar';

interface MobilePostHeaderProps {
  isSubmitDisabled: boolean;
  onCancel: () => void;
  headerTitle: string;
  submitLabel: string;
  toolbar: React.ReactNode;
}

export function MobilePostHeader({
  isSubmitDisabled,
  onCancel,
  headerTitle,
  submitLabel,
  toolbar,
}: MobilePostHeaderProps) {
  return (
    <div className="md:hidden">
      <div className="fixed top-0 right-0 left-0 z-40 flex flex-col">
        <header className="flex min-h-16 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <span className="font-base-semibold text-gray-700">{headerTitle}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onCancel}
              className="font-sm-medium px-[6px] py-[2px] text-gray-500"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="font-sm-semibold px-[6px] py-[2px] text-orange-500 disabled:cursor-not-allowed disabled:text-gray-300"
            >
              {submitLabel}
            </button>
          </div>
        </header>
        <div className="bg-gray-50 px-4 py-1.5">{toolbar}</div>
      </div>
      <div className="min-h-16" aria-hidden />
    </div>
  );
}
