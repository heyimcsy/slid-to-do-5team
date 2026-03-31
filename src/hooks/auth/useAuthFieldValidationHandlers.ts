import type { ControllerFieldState, ControllerRenderProps, FieldValues } from 'react-hook-form';

import { useCallback, useEffect, useRef } from 'react';

type UseAuthFieldValidationHandlersArgs<T extends FieldValues> = {
  field: ControllerRenderProps<T>;
  fieldState: ControllerFieldState;
  /** 포커스 후 이 시간(ms) 동안 입력이 없으면 전체 폼 검증 토스트 */
  idleValidationMs?: number;
  /** `handleSubmit(() => {}, toastInvalid)`와 동일한 검증 토스트 */
  onValidateToast?: () => void;
};

/**
 * - blur: 해당 필드가 dirty일 때만 `onValidateToast`
 * - idle: 포커스 후 `idleValidationMs` 동안 입력 없으면 `onValidateToast` (빈 필드 검증용)
 */
export function useAuthFieldValidationHandlers<T extends FieldValues>({
  field,
  fieldState,
  idleValidationMs,
  onValidateToast,
}: UseAuthFieldValidationHandlersArgs<T>) {
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearIdle = useCallback(() => {
    if (idleRef.current) {
      clearTimeout(idleRef.current);
      idleRef.current = null;
    }
  }, []);

  useEffect(() => () => clearIdle(), [clearIdle]);

  /** idle 비활성·콜백 제거 후에도 예약된 타이머가 남지 않게 */
  useEffect(() => {
    if (!onValidateToast || !idleValidationMs) clearIdle();
  }, [onValidateToast, idleValidationMs, clearIdle]);

  const onFocus = useCallback(() => {
    if (!onValidateToast || !idleValidationMs) return;
    clearIdle();
    idleRef.current = setTimeout(() => {
      onValidateToast();
      idleRef.current = null;
    }, idleValidationMs);
  }, [onValidateToast, idleValidationMs, clearIdle]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearIdle();
      field.onChange(e);
    },
    [field, clearIdle],
  );

  const onBlur = useCallback(() => {
    clearIdle();
    field.onBlur();
    if (onValidateToast && fieldState.isDirty) onValidateToast();
  }, [field, fieldState.isDirty, onValidateToast, clearIdle]);

  return { onFocus, onChange, onBlur };
}
