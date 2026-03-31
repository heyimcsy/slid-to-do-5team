import imageCompression from 'browser-image-compression';

export const compressImage = (file: File): Promise<File> => {
  return imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });
};
