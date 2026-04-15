import { buildCsp } from '@/config/csp';

describe('buildCsp', () => {
  it('nonce·strict-dynamic·공백 정리 포함', () => {
    const value = buildCsp({ nonce: 'abc123', isDev: false });
    expect(value).not.toMatch(/\n/);
    expect(value).toContain("script-src 'self' 'nonce-abc123' 'strict-dynamic'");
    expect(value).toContain('https://vercel.live');
    expect(value).not.toContain('unsafe-eval');
  });

  it('isDev일 때 unsafe-eval 포함', () => {
    const value = buildCsp({ nonce: 'n', isDev: true });
    expect(value).toContain("'unsafe-eval'");
  });
});
