'use client';

import { useEffect, useMemo, useState } from 'react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useGetMe } from '@/app/(routers)/profile/api/users';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { toast } from 'sonner';

import { formatDate } from '@/utils/date';

import { DeleteDialog } from '@/components/common/DeleteDialog';
import { KebabMenu } from '@/components/common/KebabMenu';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Icon } from '@/components/icon/Icon';

import { useDeletePost, useGetComments, useGetPostById } from '../_api/communityQueries';
import { WriterAvatar } from '../_components/WriterAvatar';
import { extractImagesFromContent } from '../_utils/extractImagesFromContent';
import { CommentSection } from './_components/CommentSection';
import { PostDetailSkeleton } from './_components/PostDetailSkeleton';

interface PostDetailClientProps {
  postId: number;
}

export function PostDetailClient({ postId }: PostDetailClientProps) {
  useGetComments(postId);
  const { data: post, isLoading: isPostLoading, isError, refetch } = useGetPostById(postId);
  const { data: user } = useGetMe();
  const userId = Number(user?.id);

  const { mutate: deletePost, isPending: isPostDeleting } = useDeletePost();
  const isWriter = userId === post?.userId;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isCommentBusy, setIsCommentBusy] = useState(false);
  const isBusy = isCommentBusy || isPostDeleting;
  const [contentReady, setContentReady] = useState(false);
  const router = useRouter();

  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] }), Image],
    content: '',
    editable: false,
    immediatelyRender: false,
  });

  const { contentWithoutImages, imageUrls } = useMemo(
    () =>
      post ? extractImagesFromContent(post.content) : { contentWithoutImages: '', imageUrls: [] },
    [post],
  );

  useEffect(() => {
    if (editor && post) {
      try {
        editor.commands.setContent(JSON.parse(contentWithoutImages));
      } catch {
        editor.commands.setContent(contentWithoutImages ?? '');
      }
      setContentReady(true);
    }
  }, [editor, post, contentWithoutImages]);

  if (isError && !post) return <ErrorFallback onRetry={refetch} title="소통 게시판" />;
  if (isPostLoading) return <PostDetailSkeleton />;
  if (!post) return <ErrorFallback onRetry={refetch} title="소통 게시판" />;
  if (!contentReady) return <PostDetailSkeleton />;

  const { title, viewCount, createdAt, writer, commentCount } = post;

  const kebabItems = [
    { label: '수정하기', onClick: () => router.push(`/community/${postId}/edit`) },
    { label: '삭제하기', onClick: () => setDeleteDialogOpen(true), variant: 'danger' as const },
  ];

  return (
    <>
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="정말 삭제하시겠어요?"
        description="삭제된 게시물은 복구할 수 없습니다."
        onConfirm={() => {
          if (!isWriter) {
            toast.error('본인이 작성한 게시물만 삭제할 수 있습니다.');
            setDeleteDialogOpen(false);
            return;
          }

          deletePost(postId, {
            onSuccess: () => router.push('/community'),
            onError: () => toast.error('게시물 삭제에 실패했습니다. 다시 시도해주세요.'),
          });
        }}
      />
      <div className="h-full w-full overflow-y-auto bg-gray-100 px-4 py-4 md:px-8 md:py-10 lg:p-14">
        <ScrollToTop />
        <div className="mx-auto w-full md:max-w-[636px] lg:max-w-[768px]">
          <div className="flex flex-col gap-10 rounded-3xl bg-white px-5 py-6 md:gap-14 md:p-10 lg:p-14">
            <div className="w-full">
              <div className="flex items-start gap-2">
                <button className="cursor-pointer pt-0.5" aria-label="목록으로 이동" onClick={() => router.push('/community')}>
                  <Icon name="arrow" direction="left" />
                </button>
                <h1 className="font-base-semibold md:font-xl-semibold min-w-0 flex-1 pl-1 text-gray-800">
                  {title}
                </h1>
                {isWriter && <KebabMenu items={kebabItems} disabled={isBusy} />}
              </div>

              <div className="mt-6 flex items-center gap-1">
                <WriterAvatar name={writer.name} image={writer.image} />
                <span className="font-xs-regular text-gray-500">{writer.name}</span>
              </div>

              <hr className="mt-4 border-gray-200" />

              <EditorContent
                editor={editor}
                className="mt-6 [&_img]:mt-4 [&_img]:h-auto [&_img]:w-full [&_img]:max-w-[232px] [&_img]:rounded-[20px]"
              />

              {imageUrls.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative size-[150px] shrink-0 md:size-[232px]">
                      <NextImage
                        src={url}
                        alt={`첨부 이미지 ${i + 1}`}
                        fill
                        unoptimized
                        className="rounded-xl object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="font-xs-regular mt-4 flex gap-1 text-gray-400">
                <span>{formatDate(createdAt)}</span>
                <span>·</span>
                <span>조회 {viewCount}</span>
              </div>
            </div>

            <CommentSection
              postId={postId}
              totalCount={commentCount}
              userId={userId}
              isPostDeleting={isPostDeleting}
              onPendingChange={setIsCommentBusy}
            />
          </div>
        </div>
      </div>
    </>
  );
}
