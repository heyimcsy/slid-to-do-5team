import type { Metadata } from 'next';

import { cn } from '@/lib';
import { AppProviders } from '@/providers';

import { Toaster } from '@/components/ui/sonner';

import { pretendard } from './fonts';

import './globals.css';

import { ThemeProvider } from 'next-themes';

import { SettingsModal } from '@/components/SettingsModal';

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
    <html
      lang="ko"
      className={cn('font-pretendard antialiased', pretendard.variable)}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {/*
          Toaster는 React Query 등 AppProviders 내부 리렌더와 분리함
          toast()는 모듈 단위 큐로 동작하므로 형제 배치여도 동일하게 표시됨
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProviders>
            {children}
            <SettingsModal />
          </AppProviders>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
