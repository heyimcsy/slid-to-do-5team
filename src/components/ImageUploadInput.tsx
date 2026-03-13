'use client';

import { Input } from '@/components/ui/input';

interface ImageUploadInputProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export function ImageUploadInput({ value, onChange }: ImageUploadInputProps) {
  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (!selected) return;
    onChange(selected);
    e.target.value = '';
  };

  const handleImageRemove = () => {
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        id="image-upload-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageAdd}
      />

      {!value && (
        <label
          htmlFor="image-upload-input"
          className="flex h-[101px] w-[424px] cursor-pointer items-center justify-center gap-[10px] rounded-[16px] border border-dashed border-gray-300 bg-gray-50 p-3"
        >
          <div className="flex w-[91px] flex-shrink-0 flex-col items-center justify-center gap-[2px]">
            <img src="/icons/ic_upload.svg" alt="" width={24} height={24} />
            <span className="text-base-medium tracking-[-0.48px] text-gray-400">이미지 첨부</span>
          </div>
        </label>
      )}

      {value && (
        <div
          className="relative flex h-[101px] w-[160px] items-center justify-center gap-[10px] rounded-[16px] p-3"
          style={{
            background: `url(${URL.createObjectURL(value)}) lightgray 50% / cover no-repeat`,
          }}
        >
          <button
            type="button"
            onClick={handleImageRemove}
            className="absolute top-[10px] right-[10px] flex h-[18px] w-[18px] items-center justify-center rounded-[100px] border border-gray-300 bg-white"
            aria-label="이미지 삭제"
          >
            <img src="/icons/ic_delete_gray.svg" alt="" width={13} height={13} />
          </button>
        </div>
      )}
    </div>
  );
}
