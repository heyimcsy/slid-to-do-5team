import { NOTES_TEXT } from '@/app/(routers)/(todo)/constants';
import { SpeechComponent } from '@/app/(routers)/(todo)/goals/[goalId]/notes/new/_components';

import { BUTTON_LABEL } from '@/constants/ui-label';

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
      <h1 className="font-base-semibold md:font-xl-semibold lg:font-2xl-semibold">
        {NOTES_TEXT.NOTE_CREATE}
      </h1>
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={saveDraft}>
          {BUTTON_LABEL.TEMPORARY_SAVE}
        </Button>
        <Button variant={'default'} size="sm" onClick={handleSubmit} disabled={titleLength === 0}>
          {BUTTON_LABEL.RESISTER}
        </Button>
      </div>

      <SpeechComponent
        loadDraft={loadDraft}
        clearDraft={clearDraft}
        className="top-5 right-4 hidden md:block"
      />
    </div>
  );
}
