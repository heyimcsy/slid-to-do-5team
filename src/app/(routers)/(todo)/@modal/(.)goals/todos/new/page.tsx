'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import CancelConfirmModal from './_components/CancelConfirm';
import NewForm from './_components/newForm';

export default function NewPage() {
  const router = useRouter();
  const [showCancel, setShowCancel] = useState(false);

  return (
    <>
      {showCancel && (
        <CancelConfirmModal onConfirm={() => router.back()} onCancel={() => setShowCancel(false)} />
      )}
      <NewForm onCancel={() => setShowCancel(true)} />
    </>
  );
}
