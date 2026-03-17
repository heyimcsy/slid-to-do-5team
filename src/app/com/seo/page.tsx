'use client';

import type { KeyboardEvent } from 'react';

import { useEffect, useRef, useState } from 'react';

import { CategoryTabs } from '@/components/common/CategoryTabs';
import { Chips } from '@/components/common/Chips';
import { DonutProgress } from '@/components/common/DonutProgress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const COLORS = ['gray', 'green', 'yellow', 'red', 'purple'] as const;
type TagColor = (typeof COLORS)[number];

interface Tag {
  name: string;
  color: TagColor;
}

export default function Seo() {
  const [tags, setTags] = useState<Tag[]>([
    { name: '코딩', color: 'green' },
    { name: '자기계발', color: 'yellow' },
    { name: '공부', color: 'red' },
  ]);

  const [activeTab, setActiveTab] = useState('ALL');
  const [inputValue, setInputValue] = useState('');
  const [count, setCount] = useState(50);

  const inputRef = useRef<HTMLInputElement>(null);
  const colorIndexRef = useRef(0); // 순차 컬러용

  const getNextColor = (): TagColor => {
    const color = COLORS[colorIndexRef.current % COLORS.length];
    colorIndexRef.current += 1;
    return color;
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setTags((prev) => [...prev, { name: trimmed, color: getNextColor() }]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // ↓ 한글 IME 조합 중 Enter는 무시
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  useEffect(() => {
    console.log(tags);
  }, [tags]);

  useEffect(() => {
    console.log(activeTab);
  }, [activeTab]);

  return (
    <main className="flex h-dvh w-full max-w-3xl flex-col gap-6 bg-white p-10">
      <h1 className="font-xl-bold sm:font-2xl-bold">with X icon</h1>
      <div
        className="flex min-h-14 w-full cursor-text flex-wrap items-center gap-1.5 rounded-[16px] border border-gray-200 bg-white px-3 py-2 transition-colors focus-within:border-orange-500 focus-within:ring-[1px] focus-within:ring-orange-500/30"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, index) => (
          <Badge key={index} color={tag.color} state="delete" onClick={() => removeTag(index)}>
            {tag.name}
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? '태그를 입력하고 Enter' : ''}
          className="font-sm-regular min-w-24 flex-1 border-none bg-transparent text-gray-700 outline-none placeholder:text-gray-300"
        />
      </div>
      <h1 className="font-xl-bold sm:font-2xl-bold">without X icon</h1>
      <div className="h-20 w-full space-x-2 rounded-sm border border-gray-100 px-3 py-2">
        {tags.map((tag, index) => (
          <Badge key={index} color={tag.color} onClick={() => removeTag(index)}>
            {tag.name}
          </Badge>
        ))}
      </div>

      <h1 className="font-xl-bold sm:font-2xl-bold">category tabs</h1>
      <CategoryTabs tabs={['ALL', '진행중', '완료']} active={activeTab} onChange={setActiveTab} />
      <h1 className="font-xl-bold sm:font-2xl-bold">chips</h1>
      <div className="flex h-fit w-fit space-x-2">
        <Chips variant="todo" />
        <Chips variant="done" />
      </div>

      <h1 className="font-xl-bold sm:font-2xl-bold">donut progress</h1>
      <div className="flex h-77 w-160 items-center justify-center space-x-4 rounded-lg bg-[#00D4BE]">
        <Button onClick={() => setCount((count) => count + 10)}>+</Button>
        <DonutProgress value={count} responsive />
        <Button onClick={() => setCount((count) => count - 10)}>-</Button>
      </div>
      <p>반응형에 따라 크기가 변동되는 차트는 isReacted를 true로 넣어주세요</p>
    </main>
  );
}
