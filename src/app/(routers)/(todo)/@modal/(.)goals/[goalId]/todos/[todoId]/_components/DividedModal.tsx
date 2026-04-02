'use client';

import { useRouter } from 'next/navigation';
import { useGetNote } from '@/api/notes';
import { useGetTodo } from '@/api/todos';
import { TodoDetailContent } from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/todos/[todoId]/_components/TodoDetailContent';
import { TodoDetailSkeleton } from '@/app/(routers)/(todo)/@modal/(.)goals/[goalId]/todos/[todoId]/_components/TodoDetailSkeleton';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';

export default function DividedModal({ todoId }: { todoId: string }) {
  const { data, isLoading, isSuccess } = useGetTodo({ id: Number(todoId) });
  const noteId = data?.noteIds?.[0];
  const { data: noteData } = useGetNote({ id: Number(noteId) });
  const router = useRouter();
  const isMd = useMediaQuery('(min-width: 768px)');
  const onClose = () => router.back();

  const content = isLoading ? (
    <TodoDetailSkeleton />
  ) : isSuccess ? (
    <TodoDetailContent
      title={data.title}
      done={data.done ? 'DONE' : 'TO DO'}
      goalTitle={data.goal.title}
      goalId={data.goalId}
      dueDate={data.dueDate}
      tags={data.tags}
      linkUrl={data.linkUrl}
      noteTitle={noteData?.title}
      noteId={noteData?.id}
      todoId={Number(todoId)}
    />
  ) : null;

  if (isMd === undefined) return null;

  if (isMd) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="w-[456px] rounded-[40px] p-10 shadow-[0_0_60px_0_rgba(0,0,0,0.05)]">
          <DialogTitle className="sr-only">할 일 상세 보기</DialogTitle>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open onOpenChange={onClose}>
      <DrawerContent className="min-w-[311px] rounded-t-[32px] p-8 shadow-[0_0_60px_0_rgba(0,0,0,0.05)]">
        <DrawerTitle className="sr-only">할 일 상세 보기</DrawerTitle>
        <Button variant="icon" size="none" className="absolute right-8" onClick={onClose}>
          <Icon name="close" color="gray" size={24} />
        </Button>
        {content}
      </DrawerContent>
    </Drawer>
  );
}
