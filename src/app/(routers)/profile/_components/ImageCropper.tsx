'use client';

import type { Crop } from 'react-image-crop';

import React, { useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

import type { ImageCropperProps } from '@/app/(routers)/profile/types';

import { PROFILE_TEXT } from '@/app/(routers)/profile/constants';

import { DIALOG_VALUE } from '@/constants/ui-label';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';

const MAX_SIZE = 400;
const COMPRESS_QUALITY = 0.8;

export default function ImageCropper({ onCropComplete }: ImageCropperProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [open, setOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const originalFileRef = useRef<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    originalFileRef.current = file;
    const url = URL.createObjectURL(file);
    setSrc(url);
    setOpen(true);

    e.target.value = '';
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 80 }, 1, width, height),
      width,
      height,
    );
    setCrop(crop);
  };

  const handleCropConfirm = () => {
    if (!imgRef.current || !crop) return;

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = (crop.x / 100) * image.width * scaleX;
    const cropY = (crop.y / 100) * image.height * scaleY;
    const cropWidth = (crop.width / 100) * image.width * scaleX;
    const cropHeight = (crop.height / 100) * image.height * scaleY;

    // 최대 크기 제한으로 압축
    const scale = Math.min(1, MAX_SIZE / Math.max(cropWidth, cropHeight));
    const canvasWidth = Math.round(cropWidth * scale);
    const canvasHeight = Math.round(cropHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 원형 클리핑
    ctx.beginPath();
    ctx.arc(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, canvasWidth, canvasHeight);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], 'profile.webp', { type: 'image/webp' });
        onCropComplete(file);
        setOpen(false);
        setSrc(null);
      },
      'image/webp',
      COMPRESS_QUALITY,
    );
  };

  return (
    <>
      <label htmlFor="profile" className="cursor-pointer">
        <Icon name="pencil" variant="white" size={21} />
      </label>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="profile"
        onChange={handleFileChange}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-86 md:w-114" aria-label={PROFILE_TEXT.IMAGE_EDIT}>
          <p className="font-base-semibold pb-2 text-gray-800">{PROFILE_TEXT.IMAGE_EDIT}</p>
          {src && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              aspect={1}
              circularCrop
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
          <DialogFooter className="pt-4">
            <Button variant="ghost" className="w-1/2" onClick={() => setOpen(false)}>
              {DIALOG_VALUE.BUTTON.CANCEL}
            </Button>
            <Button variant="default" className="w-1/2" onClick={handleCropConfirm}>
              {DIALOG_VALUE.BUTTON.CONFIRM}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
