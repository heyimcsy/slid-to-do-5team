import { FormHeaderActions } from '@/components/formHeader/FormHeaderActions';

interface DesktopPostHeaderProps {
  isSubmitDisabled: boolean;
  onCancel: () => void;
  onSubmitClick: () => void;
  headerTitle: string;
  secondaryLabel: string;
  submitLabel: string;
}

export function DesktopPostHeader({
  isSubmitDisabled,
  onCancel,
  onSubmitClick,
  headerTitle,
  secondaryLabel,
  submitLabel,
}: DesktopPostHeaderProps) {
  return (
    <div className="hidden items-center justify-between md:flex">
      <h1 className="font-xl-semibold lg:font-2xl-semibold text-black">{headerTitle}</h1>
      <FormHeaderActions
        variant="desktop"
        isSubmitDisabled={isSubmitDisabled}
        secondaryLabel={secondaryLabel}
        submitLabel={submitLabel}
        onCancel={onCancel}
        onSubmitClick={onSubmitClick}
      />
    </div>
  );
}
