'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import CancelConfirmModal from './_components/CancelConfirm';
import NewForm from './_components/newForm';

export default function NewPage() {
  const router = useRouter();
  const [showCancel, setShowCancel] = useState(false);

  if (showCancel) {
    return (
      <CancelConfirmModal
        onConfirm={() => router.back()} // 나가기
        onCancel={() => setShowCancel(false)} // 돌아가기
      />
    );
  }

  return <NewForm onCancel={() => setShowCancel(true)} />;
}
