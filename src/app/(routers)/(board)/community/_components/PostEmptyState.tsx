export function PostEmptyState() {
  return (
    <div className="flex w-full flex-col items-center gap-3 py-40">
      <img src="/img_empty_gray.svg" alt="게시물 없음" className="size-24 md:size-36" />
      <p className="font-base-regular text-gray-500">아직 등록된 게시물이 없어요.</p>
    </div>
  );
}
