interface DesktopPostHeaderProps {
  isSubmitDisabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function DesktopPostHeader({
  isSubmitDisabled,
  onCancel,
  onSubmit,
}: DesktopPostHeaderProps) {
  return (
    <div className="mb-4 hidden items-center justify-between md:mb-6 md:flex">
      <h1 className="font-xl-semibold lg:font-2xl-semibold text-black">게시물 작성하기</h1>
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
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className="font-sm-semibold w-[106px] rounded-full bg-orange-500 px-[18px] py-2.5 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
