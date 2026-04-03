'use client';

import { useState } from 'react';
import Image from 'next/image';

interface WriterAvatarProps {
  name: string;
  image: string | null;
}

export function WriterAvatar({ name, image }: WriterAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [prevImage, setPrevImage] = useState(image);

  if (image !== prevImage) {
    setPrevImage(image);
    setImageError(false);
  }

  return (
    <div className="size-5 shrink-0 overflow-hidden rounded-full bg-gray-200">
      {image && !imageError ? (
        <Image
          src={image}
          alt={name}
          width={20}
          height={20}
          unoptimized
          className="size-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="font-xs-regular flex size-full items-center justify-center text-gray-500">
          {name.charAt(0)}
        </div>
      )}
    </div>
  );
}
