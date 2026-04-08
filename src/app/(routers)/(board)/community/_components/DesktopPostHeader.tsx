import { PostHeaderActions } from './PostHeaderActions';

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
      <PostHeaderActions
        variant="desktop"
        isSubmitDisabled={isSubmitDisabled}
        submitLabel={submitLabel}
        onCancel={onCancel}
        onSubmitClick={onSubmitClick}
      />
    </div>
  );
}
