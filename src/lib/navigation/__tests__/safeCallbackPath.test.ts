import {
  getSafeCallbackPath,
  SAFE_CALLBACK_PATH_MAX_LENGTH,
  SAFE_CALLBACK_RAW_MAX_LENGTH,
} from '@/lib/navigation/safeCallbackPath';

describe('getSafeCallbackPath', () => {
  it('null·빈 문자열 → null', () => {
    expect(getSafeCallbackPath(null)).toBeNull();
    expect(getSafeCallbackPath('')).toBeNull();
    expect(getSafeCallbackPath('   ')).toBeNull();
  });

  it('내부 경로 허용', () => {
    expect(getSafeCallbackPath('/todos')).toBe('/todos');
    expect(getSafeCallbackPath('/todos?tab=1')).toBe('/todos?tab=1');
    expect(getSafeCallbackPath('%2Fprofile%2Fedit')).toBe('/profile/edit');
    expect(getSafeCallbackPath('/share?url=https://example.com')).toBe(
      '/share?url=https://example.com',
    );
  });

  it('pathname에만 `://` 차단 (쿼리의 절대 URL은 허용)', () => {
    expect(getSafeCallbackPath('/http://weird-path')).toBeNull();
  });

  it('오픈 리다이렉트 차단', () => {
    expect(getSafeCallbackPath('https://evil.com')).toBeNull();
    expect(getSafeCallbackPath('//evil.com')).toBeNull();
    expect(getSafeCallbackPath('%2F%2Fevil.com')).toBeNull();
    expect(getSafeCallbackPath('javascript:alert(1)')).toBeNull();
  });

  it('길이 상한: 원문(encoded 기준) 초과 → null', () => {
    const tooLongRaw = `/${'a'.repeat(SAFE_CALLBACK_RAW_MAX_LENGTH)}`;
    expect(tooLongRaw.length).toBe(SAFE_CALLBACK_RAW_MAX_LENGTH + 1);
    expect(getSafeCallbackPath(tooLongRaw)).toBeNull();
  });

  it('길이 상한: 디코딩 후 경로 초과 → null', () => {
    const path = `/${'a'.repeat(SAFE_CALLBACK_PATH_MAX_LENGTH)}`;
    expect(path.length).toBe(SAFE_CALLBACK_PATH_MAX_LENGTH + 1);
    expect(getSafeCallbackPath(path)).toBeNull();
  });

  it('길이 상한: 디코딩 경로가 정확히 상한 이하이면 허용', () => {
    const path = `/${'a'.repeat(SAFE_CALLBACK_PATH_MAX_LENGTH - 1)}`;
    expect(path.length).toBe(SAFE_CALLBACK_PATH_MAX_LENGTH);
    expect(getSafeCallbackPath(path)).toBe(path);
  });

  it('%25 포함 시 null (이중 인코딩·우회 시도 차단)', () => {
    expect(getSafeCallbackPath('/x%252Fy')).toBeNull();
    expect(getSafeCallbackPath('%25')).toBeNull();
  });

  it('CRLF·null byte 포함 시 null', () => {
    expect(getSafeCallbackPath('/a\r\n/b')).toBeNull();
    expect(getSafeCallbackPath('/a\n/b')).toBeNull();
    expect(getSafeCallbackPath('/a\0/b')).toBeNull();
  });

  it('isAlreadyDecoded: true면 decodeURIComponent를 건너뜀', () => {
    expect(getSafeCallbackPath('/plain', { isAlreadyDecoded: true })).toBe('/plain');
    expect(getSafeCallbackPath('  /trim  ', { isAlreadyDecoded: true })).toBe('/trim');
  });
});
