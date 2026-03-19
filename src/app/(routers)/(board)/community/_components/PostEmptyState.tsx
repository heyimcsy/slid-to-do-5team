interface PostEmptyStateProps {
  message?: string;
}

export function PostEmptyState({ message = '아직 등록된 게시물이 없어요.' }: PostEmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center gap-3 py-40">
      <img src="/img_empty_gray.svg" alt="게시물 없음" className="size-24 md:size-36" />
      <p className="font-base-regular text-gray-500">{message}</p>
    </div>
  );
}
