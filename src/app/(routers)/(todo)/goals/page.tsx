'use client';

import type { GoalResponse } from '@/api/goals';

import { useState } from 'react';
import { useDeleteGoals, useGetGoal, useGetGoals, usePatchGoals, usePostGoals } from '@/api/goals';

import { Button } from '@/components/ui/button';

export default function Page() {
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [goalId, setGoalId] = useState<number | null>(null);

  const { data } = useGetGoals();
  const { data: goalDetail, isLoading: isDetailLoading } = useGetGoal({ id: goalId! });
  const { mutate } = usePostGoals({
    onSuccess: (data: GoalResponse) => alert(`Goal ${data.title} 셍성 완료`),
  });
  const { mutate: patchGoals } = usePatchGoals();
  const { mutate: deleteGoals } = useDeleteGoals({
    onSuccess: () => {
      alert(`Goal 삭제 완료`);
    },
  });

  return (
    <div className="h-full w-fit space-y-2 bg-white p-4">
      goal page
      <div className="h-fit w-fit space-y-2 p-4">
        {data?.goals.map((item) => (
          <div
            className="flex h-20 w-200 items-center space-x-2 rounded-sm border border-orange-500"
            key={item.id}
          >
            <p>{item.id}</p>
            {editId !== item.id ? (
              <>
                <p>{item.title}</p>
                <Button onClick={() => setGoalId(goalId === item.id ? null : item.id)}>
                  {goalId === item.id ? '닫기' : '상세보기'}
                </Button>
                <Button onClick={() => deleteGoals({ id: item.id })}>삭제하기</Button>
                <Button
                  onClick={() => {
                    setEditId(item.id);
                    setEditTitle(item.title);
                  }}
                >
                  값 수정하기
                </Button>
              </>
            ) : (
              <>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <Button
                  onClick={() => {
                    patchGoals({ id: item.id, title: editTitle });
                    setEditId(null);
                  }}
                >
                  변경하기
                </Button>
                <Button onClick={() => setEditId(null)}>취소</Button>
              </>
            )}

            {/* 상세보기 영역 */}
            {goalId === item.id && (
              <div className="ml-4 rounded border border-gray-300 p-2 text-sm">
                {isDetailLoading ? (
                  <p>로딩 중...</p>
                ) : (
                  <>
                    <p>ID: {goalDetail?.id}</p>
                    <p>제목: {goalDetail?.title}</p>
                    <p>생성일: {String(goalDetail?.createdAt)}</p>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <Button onClick={() => mutate({ title: '전교 1등하기' })}>추가하기</Button>
    </div>
  );
}
