import Image from 'next/image';

interface FeatureCardProps {
  id: number;
  icon: string;
  title: string;
  content: string;
}

export function FeatureCard({ id, icon, title, content }: FeatureCardProps) {
  return (
    <div className="jusitfy-center flex flex-1 flex-col items-center gap-2.5 rounded-[2rem] bg-white p-8 shadow-[0px_0px_32px_0px_rgba(0,0,0,0.05)] *:text-center dark:bg-black">
      {/* FeatureCard */}
      {/* 번호 아이콘 */}
      <div className="font-xl-bold size-8 rounded-full bg-orange-500 text-white dark:bg-orange-300 dark:text-black">
        {id}
      </div>
      {/* 설명 아이콘 */}
      <Image src={icon} alt={title} width={24} height={24} className="m-4 size-30" priority />
      {/* 제목 */}
      <h3 className="font-xl-semibold text-gray-700 dark:text-gray-200">{title}</h3>
      {/* 본문 */}
      <p className="font-base-medium max-w-50 text-balance break-keep text-gray-400 dark:text-gray-600">
        {content}
      </p>
    </div>
  );
}
