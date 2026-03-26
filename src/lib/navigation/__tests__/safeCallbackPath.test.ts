import { getSafeCallbackPath } from '@/lib/navigation/safeCallbackPath';

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
  });

  it('오픈 리다이렉트 차단', () => {
    expect(getSafeCallbackPath('https://evil.com')).toBeNull();
    expect(getSafeCallbackPath('//evil.com')).toBeNull();
    expect(getSafeCallbackPath('%2F%2Fevil.com')).toBeNull();
    expect(getSafeCallbackPath('javascript:alert(1)')).toBeNull();
  });
});
