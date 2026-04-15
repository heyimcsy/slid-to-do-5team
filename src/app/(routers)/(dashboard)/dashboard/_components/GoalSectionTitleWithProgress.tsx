import { cn } from '@/lib/shadcn';

import ProgressBar from './ProgressBar';

export function GoalSectionTitleWithProgress({
  title,
  progress,
  className,
}: {
  title: string;
  progress: number;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <h2 className="font-base-semibold truncate text-gray-700">{title}</h2>
      <ProgressBar value={progress} max={100} />
      {/* <div className="block"></div>
      <div className="flex justify-between"></div> */}
    </div>
  );
}
