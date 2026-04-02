describe('constants/api', () => {
  describe('ALLOWED_ORIGINS', () => {
    it('NODE_ENV=development일 때 localhost 포함', async () => {
      const origEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true });
      jest.resetModules();
      const { ALLOWED_ORIGINS } = await import('@/constants/api');
      expect(ALLOWED_ORIGINS).toContain('http://localhost:3000');
      expect(ALLOWED_ORIGINS).toContain('http://127.0.0.1:3000');
      Object.defineProperty(process.env, 'NODE_ENV', { value: origEnv, writable: true });
      jest.resetModules();
    });
  });
});
