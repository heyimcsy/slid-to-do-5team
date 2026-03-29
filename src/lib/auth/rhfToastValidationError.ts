import type { FieldErrors, FieldValues } from 'react-hook-form';

import { toast } from 'sonner';

function collectErrorMessages(errors: FieldErrors<FieldValues>): string[] {
  const out: string[] = [];
  for (const v of Object.values(errors)) {
    if (!v || typeof v !== 'object') continue;
    if ('message' in v && typeof v.message === 'string' && v.message) {
      out.push(v.message);
      continue;
    }
    out.push(...collectErrorMessages(v as FieldErrors<FieldValues>));
  }
  return out;
}

/** `handleSubmit(onValid, onInvalid)`의 `onInvalid`에서 호출 — Zod·RHF 검증 실패를 토스트로만 노출할 때 사용 (메시지당 토스트 1개) */
export function toastRhfValidationErrors<T extends FieldValues>(errors: FieldErrors<T>): void {
  const msgs = collectErrorMessages(errors as FieldErrors<FieldValues>);
  if (msgs.length === 0) {
    toast.error('입력값을 확인해 주세요');
    return;
  }
  for (const msg of msgs) {
    toast.error(msg);
  }
}
