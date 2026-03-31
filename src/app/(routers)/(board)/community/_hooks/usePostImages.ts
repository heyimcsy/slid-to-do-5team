'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const IMAGE_LIMIT = 2;

type ImageItem = { type: 'existing'; url: string } | { type: 'new'; url: string; file: File };

export function usePostImages(initialImageUrls: string[] = []) {
  const [images, setImages] = useState<ImageItem[]>(
    initialImageUrls.map((url) => ({ type: 'existing', url })),
  );
  const [hasImagesChanged, setHasImagesChanged] = useState(false);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => {
        if (item.type === 'new') URL.revokeObjectURL(item.url);
      });
    };
  }, []);

  const handleImageSizeExceeded = useCallback(() => {
    toast.error('이미지 크기는 10MB를 초과할 수 없습니다.');
  }, []);

  const handleImageLimitExceeded = useCallback(() => {
    toast.error(`이미지는 최대 ${IMAGE_LIMIT}개까지 첨부할 수 있습니다.`);
  }, []);

  const handleImageSelected = useCallback(
    (file: File) => {
      if (images.length >= IMAGE_LIMIT) {
        handleImageLimitExceeded();
        return;
      }
      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, { type: 'new', url, file }]);
      setHasImagesChanged(true);
    },
    [images.length, handleImageLimitExceeded],
  );

  const handleImageRemove = useCallback((index: number) => {
    setImages((prev) => {
      const item = prev[index];
      if (item.type === 'new') URL.revokeObjectURL(item.url);
      return prev.filter((_, i) => i !== index);
    });
    setHasImagesChanged(true);
  }, []);

  return {
    images,
    IMAGE_LIMIT,
    hasImagesChanged,
    handleImageSelected,
    handleImageRemove,
    handleImageSizeExceeded,
    handleImageLimitExceeded,
  };
}
