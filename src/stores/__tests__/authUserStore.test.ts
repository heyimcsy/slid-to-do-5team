import { authUserStore } from '@/stores/authUserStore';





describe('authUserStore', () => {
  beforeEach(() => {
    authUserStore.getState().clearUser();
  });

  it('setUser로 유효한 User 설정', () => {
    const u = { id: '1', email: 'test@example.com', name: '테스트' };
    authUserStore.getState().setUser(u);
    expect(authUserStore.getState().user).toEqual(u);
  });

  it('스키마에 맞지 않으면 setUser 무시', () => {
    authUserStore.getState().setUser({
      id: '',
      email: 'bad',
      name: 'x',
    } as never);
    expect(authUserStore.getState().user).toBeNull();
  });

  it('clearUser로 초기화', () => {
    authUserStore.getState().setUser({ id: '1', email: 'a@b.com', name: 'N' });
    authUserStore.getState().clearUser();
    expect(authUserStore.getState().user).toBeNull();
  });
});
