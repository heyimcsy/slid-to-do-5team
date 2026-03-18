import type { PersistStore } from '@/providers/PersistRehydrationProvider';

import { PersistRehydrationProvider } from '@/providers/PersistRehydrationProvider';
import { render, screen } from '@testing-library/react';

describe('PersistRehydrationProvider', () => {
  it('stores가 비어있으면 children 즉시 렌더', () => {
    // Arrange
    const stores = [] as never[];
    const children = <span>Content</span>;
    // Act
    render(<PersistRehydrationProvider stores={stores}>{children}</PersistRehydrationProvider>);
    // Assert
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  it('fallback이 있으면 stores rehydrate 전에 fallback 표시', async () => {
    // Arrange
    const mockStore: PersistStore = {
      persist: { rehydrate: () => Promise.resolve(), getOptions: () => ({ name: 'test-store' }) },
    };
    const fallback = <div>Loading</div>;
    const children = <span>Content</span>;
    // Act
    render(
      <PersistRehydrationProvider stores={[mockStore]} fallback={fallback}>
        {children}
      </PersistRehydrationProvider>,
    );
    // Assert
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(await screen.findByText('Content')).toBeInTheDocument();
  });
});