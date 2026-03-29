import SpeachComponent from '@/app/(routers)/(todo)/goals/[goalId]/notes/new/_components/SpeachComponent';

import { Button } from '@/components/ui/button';

interface NoteFormHeaderProps {
  saveDraft: () => void;
  handleSubmit: () => void;
  titleLength: number;
  loadDraft: () => void;
  clearDraft: () => void;
}
export default function NoteFormHeader({
  saveDraft,
  handleSubmit,
  titleLength,
  clearDraft,
  loadDraft,
}: NoteFormHeaderProps) {
  return (
    <div className="relative flex h-6 w-[343px] items-center justify-between md:h-10 md:w-full">
      <h1 className="font-base-semibold md:font-xl-semibold lg:font-2xl-semibold">노트 작성하기</h1>
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={saveDraft}>
          임시저장
        </Button>
        <Button variant={'default'} size="sm" onClick={handleSubmit} disabled={titleLength === 0}>
          등록하기
        </Button>
      </div>

      <SpeachComponent
        loadDraft={loadDraft}
        clearDraft={clearDraft}
        className="top-5 right-4 hidden md:block"
      />
    </div>
  );
}
