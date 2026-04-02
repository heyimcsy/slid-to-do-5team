import { Suspense } from 'react';

import { DashboardClient } from './_components/DashboardClient';

export default function DashboardPage() {
  return (
    <>
      <Suspense fallback={null}>
        <DashboardClient />
      </Suspense>
    </>
  );
}
