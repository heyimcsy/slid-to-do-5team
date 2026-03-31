'use client';

import type { Crop } from 'react-image-crop';

import { useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';

interface ImageCropperProps {
  onCropComplete: (croppedFile: File) => void;
}

export function ImageCropper({ onCropComplete }: ImageCropperProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [open, setOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrc(url);
    setOpen(true);
  };

  // 이미지 로드 시 기본 크롭 영역 설정
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 80 }, 1, width, height), // 1:1 비율
      width,
      height,
    );
    setCrop(crop);
  };

  const handleCropConfirm = () => {
    if (!imgRef.current || !crop) return;

    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = (crop.x / 100) * image.width * scaleX;
    const cropY = (crop.y / 100) * image.height * scaleY;
    const cropWidth = (crop.width / 100) * image.width * scaleX;
    const cropHeight = (crop.height / 100) * image.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 동그랗게 자르기
    ctx.beginPath();
    ctx.arc(cropWidth / 2, cropHeight / 2, cropWidth / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'profile.png', { type: 'image/png' });
      onCropComplete(file);
      setOpen(false);
    }, 'image/png');
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="profile"
        onChange={handleFileChange}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-86 md:w-114">
          <p className="font-base-semibold text-gray-800">프로필 이미지 편집</p>
          {src && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              aspect={1}
              circularCrop // ← 동그란 크롭 UI
            >
              <img
                ref={imgRef}
                src={src}
                alt="crop"
                onLoad={onImageLoad}
                className="max-h-96 w-full object-contain"
              />
            </ReactCrop>
          )}
          <DialogFooter>
            <Button variant="ghost" className="w-1/2" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button variant="default" className="w-1/2" onClick={handleCropConfirm}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
