'use client';

import Image from 'next/image';
import Link from 'next/link';

import AlertPopover from '../AlertPopover';
import { Icon } from '../icon/Icon';
import { SidebarHeader, SidebarTrigger, useSidebar } from '../ui/sidebar';

export default function AppSidebarHeader() {
  const { state, isMobile, openMobile } = useSidebar();
  return (
    <SidebarHeader className="relative mt-8 px-8 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
      {isMobile ? (
        openMobile ? (
          <>
            <div className="flex w-full justify-end">
              <SidebarTrigger />
            </div>
            <Link href="/dashboard">
              <Image
                src="/images/logo-large.svg"
                width={335}
                height={48}
                alt="Logo"
                priority
                style={{ width: 'auto', height: 'auto' }}
                className="max-w-full"
              />
            </Link>
          </>
        ) : (
          <div className="flex w-full justify-end">
            <SidebarTrigger />
          </div>
        )
      ) : (
        <SidebarTrigger className="absolute top-0 md:right-4 lg:right-6" />
      )}
      {!isMobile && (
        <Link href="/dashboard" className="mt-8">
          {state === 'expanded' ? (
            <Image
              src="/images/logo-large.svg"
              width={276}
              height={48}
              alt="Logo"
              priority
              style={{ width: 'auto', height: 'auto' }}
              className="max-w-full"
            />
          ) : (
            <>
              <Image
                src="/images/logo-symbol.svg"
                className="mt-8 hidden lg:block"
                width={48}
                height={48}
                alt="Logo"
              />
              <Image
                src="/images/logo-symbol.svg"
                className="mt-10 block lg:hidden"
                width={32}
                height={32}
                alt="Logo"
              />
            </>
          )}
        </Link>
      )}
      {!isMobile && state === 'collapsed' && <AlertPopover collapsed className="lg:hidden" />}
    </SidebarHeader>
  );
}
