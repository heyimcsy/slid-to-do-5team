'use client';

import { useState } from 'react';

interface WriterAvatarProps {
  name: string;
  image: string | null;
}

export function WriterAvatar({ name, image }: WriterAvatarProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="size-5 shrink-0 overflow-hidden rounded-full bg-gray-200">
      {image && !imageError ? (
        <img
          src={image}
          alt={name}
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
