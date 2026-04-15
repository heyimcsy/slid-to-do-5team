import type { Metadata } from 'next';

import AppSidebarHeader from '@/components/sidebar/AppSidebarHeader';
import MobileHeader from '@/components/sidebar/MobileHeader';
import SidebarNav from '@/components/sidebar/SidebarNav';
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: '슬리드 투두',
  description:
    '슬리드 투두는 다양한 콘텐츠를 할 일 목록으로 관리하고 학습 진도, 프로젝트 진행 상황 등을 대시보드로 보여주며, 각 할일에 대한 노트를 작성해 관리해주는 서비스입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh w-full bg-gray-100 md:flex">
      <SidebarProvider>
        <Sidebar variant="floating" collapsible="icon" className="rounded-tr-3xl rounded-br-3xl">
          <AppSidebarHeader />
          <SidebarContent className="px-8">
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="sticky top-0 z-10 border-b border-black/5 bg-white/40 p-2 backdrop-blur-lg duration-150 md:hidden">
            <MobileHeader />
          </div>
          <div className="flex h-dvh min-h-0 w-full min-w-[375px] flex-1 justify-center overflow-y-auto bg-gray-100">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
