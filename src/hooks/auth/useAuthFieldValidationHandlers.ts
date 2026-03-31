import type { ControllerFieldState, ControllerRenderProps, FieldValues } from 'react-hook-form';

import { useCallback } from 'react';

type UseAuthFieldValidationHandlersArgs<T extends FieldValues> = {
  field: ControllerRenderProps<T>;
  fieldState: ControllerFieldState;
  /** `handleSubmit(() => {}, toastInvalid)`와 동일한 검증 토스트 — dirty일 때 blur에서 호출 */
  onValidateToast?: () => void;
};

/**
 * blur: 해당 필드가 dirty일 때만 `onValidateToast`
 */
export function useAuthFieldValidationHandlers<T extends FieldValues>({
  field,
  fieldState,
  onValidateToast,
}: UseAuthFieldValidationHandlersArgs<T>) {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(e);
    },
    [field],
  );

  const onBlur = useCallback(() => {
    field.onBlur();
    if (onValidateToast && fieldState.isDirty) onValidateToast();
  }, [field, fieldState.isDirty, onValidateToast]);

  return { onChange, onBlur };
}
