import type { ProfileImageSectionProps } from '@/app/(routers)/profile/types';

import Image from 'next/image';
import profileImage from '@/../public/images/user-yellow.svg';
import { ImageCropper } from '@/app/(routers)/profile/_components/index';
import { PROFILE_IMAGE } from '@/app/(routers)/profile/constants';

export default function ProfileImageSection({
  imageUrl,
  onCropComplete,
}: ProfileImageSectionProps) {
  return (
    <div className="relative h-fit w-fit">
      <div className="relative size-[132px] overflow-hidden rounded-full">
        <Image
          src={imageUrl ?? profileImage}
          alt={PROFILE_IMAGE.ALT}
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute right-3 bottom-0 flex size-9 items-center justify-center rounded-[18px] bg-orange-500">
        <ImageCropper onCropComplete={onCropComplete} />
      </div>
    </div>
  );
}
