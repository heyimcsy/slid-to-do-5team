interface PostErrorFallbackProps {
  onRetry: () => void;
}

export function PostErrorFallback({ onRetry }: PostErrorFallbackProps) {
  return (
    <div className="h-full w-full bg-gray-100 px-4 py-6 md:px-8 md:py-12">
      <h1 className="font-xl-semibold md:font-2xl-semibold mb-6 px-2 text-black md:mb-8">
        소통 게시판
      </h1>
      <div className="flex flex-col items-center gap-4 py-40">
        <p className="font-3xl-regular mb-4 text-gray-600">데이터를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={onRetry}
          className="font-sm-medium rounded-xl bg-orange-500 px-5 py-2.5 text-white"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}
