// src/providers/__tests__/AppProviders.test.tsx
import { AppProviders } from '@/providers/AppProviders';
import { act, render, screen } from '@testing-library/react';

describe('AppProviders', () => {
  it('children 렌더', async () => {
    // Arrange
    const children = <div data-testid="child">Child</div>;
    // Act
    render(<AppProviders>{children}</AppProviders>);
    await act(async () => {
      await new Promise<void>((resolve) => queueMicrotask(resolve));
    });
    // Assert
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
  it('persistStores가 비어있어도 children 렌더', async () => {
    // Arrange
    const children = <span>Content</span>;
    const persistStores = [] as never[];
    // Act
    render(<AppProviders persistStores={persistStores}>{children}</AppProviders>);
    await act(async () => {
      await new Promise<void>((resolve) => queueMicrotask(resolve));
    });
    // Assert
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
