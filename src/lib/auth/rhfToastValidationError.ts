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

export type ToastRhfValidationOptions = {
  /** 폼별 네임스페이스 — 같은 문구라도 폼이 다르면 토스트 id가 달라짐 */
  toastId?: string;
};

function messageDedupeToastId(scope: string, message: string): string {
  return `${scope}:msg:${encodeURIComponent(message)}`;
}

/** `handleSubmit(onValid, onInvalid)`의 `onInvalid`에서 호출 — Zod·RHF 검증 실패를 토스트로만 노출 (문구별 토스트, 동일 문구는 id로 중복 방지) */
export function toastRhfValidationErrors<T extends FieldValues>(
  errors: FieldErrors<T>,
  options?: ToastRhfValidationOptions,
): void {
  const msgs = collectErrorMessages(errors as FieldErrors<FieldValues>);
  const scope = options?.toastId ?? 'rhf-validation';
  if (msgs.length === 0) {
    toast.error('입력값을 확인해 주세요', { id: `${scope}:generic` });
    return;
  }
  const unique = [...new Set(msgs)];
  for (const msg of unique) {
    toast.error(msg, { id: messageDedupeToastId(scope, msg) });
  }
}
