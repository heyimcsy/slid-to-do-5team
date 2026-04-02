interface DesktopPostHeaderProps {
  isSubmitDisabled: boolean;
  onCancel: () => void;
  onSubmitClick: () => void;
  headerTitle: string;
  submitLabel: string;
}

export function DesktopPostHeader({
  isSubmitDisabled,
  onCancel,
  onSubmitClick,
  headerTitle,
  submitLabel,
}: DesktopPostHeaderProps) {
  return (
    <div className="hidden items-center justify-between md:flex">
      <h1 className="font-xl-semibold lg:font-2xl-semibold text-black">{headerTitle}</h1>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="font-sm-semibold w-[106px] rounded-full border border-gray-300 px-[18px] py-2.5 text-gray-500 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onSubmitClick}
          disabled={isSubmitDisabled}
          className="font-sm-semibold w-[106px] rounded-full bg-orange-500 px-[18px] py-2.5 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
