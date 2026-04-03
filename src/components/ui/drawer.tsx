'use client';

import * as React from 'react';
import { cn } from '@/lib';
import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';

function Drawer({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Backdrop>) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        'transition-opacity duration-300',
        'data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Popup>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Viewport
        className="fixed inset-0 z-50 flex items-end"
        // TODO: 모바일 버전의 할 일 상세 Drawer가 화면에 나타나지 않는 버그로 인한 임시 추가
        style={{ minHeight: '100dvh' }}
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-content"
          className={cn(
            'bg-background flex flex-col outline-none',
            'w-full rounded-t-lg border-t',
            'transition-transform duration-300 ease-out',
            'data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full',
            // TODO: 모바일 버전의 할 일 상세 Drawer가 화면에 나타나지 않는 버그로 인한 임시 삭제
            // 'mb-[-100vh] pb-[100vh]',
            className,
          )}
          {...props}
        >
          {/* <div className="bg-muted mx-auto mt-4 mb-2 h-1.5 w-[100px] shrink-0 rounded-full" /> */}
          <DrawerPrimitive.Content className="relative flex h-full flex-col overflow-y-auto">
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn('flex flex-col gap-1.5 p-4 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn('text-foreground leading-none font-semibold', className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};

// 'use client';

// import * as React from 'react';
// import { cn } from '@/lib';
// import { Drawer as DrawerPrimitive } from 'vaul';

// function Drawer({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) {
//   return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
// }

// function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
//   return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
// }

// function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
//   return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
// }

// function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
//   return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
// }

// function DrawerOverlay({
//   className,
//   ...props
// }: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
//   return (
//     <DrawerPrimitive.Overlay
//       data-slot="drawer-overlay"
//       className={cn(
//         'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs',
//         className,
//       )}
//       {...props}
//     />
//   );
// }

// function DrawerContent({
//   className,
//   children,
//   ...props
// }: React.ComponentProps<typeof DrawerPrimitive.Content>) {
//   return (
//     <DrawerPortal data-slot="drawer-portal">
//       <DrawerOverlay />
//       <DrawerPrimitive.Content
//         data-slot="drawer-content"
//         className={cn(
//           'group/drawer-content bg-popover text-popover-foreground fixed z-50 flex h-auto flex-col text-sm data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm',
//           className,
//         )}
//         {...props}
//       >
//         <div className="bg-muted mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
//         {children}
//       </DrawerPrimitive.Content>
//     </DrawerPortal>
//   );
// }

// function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
//   return (
//     <div
//       data-slot="drawer-header"
//       className={cn(
//         'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left',
//         className,
//       )}
//       {...props}
//     />
//   );
// }

// function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
//   return (
//     <div
//       data-slot="drawer-footer"
//       className={cn('mt-auto flex flex-col gap-2 p-4', className)}
//       {...props}
//     />
//   );
// }

// function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
//   return (
//     <DrawerPrimitive.Title
//       data-slot="drawer-title"
//       className={cn('cn-font-heading text-foreground text-base font-medium', className)}
//       {...props}
//     />
//   );
// }

// function DrawerDescription({
//   className,
//   ...props
// }: React.ComponentProps<typeof DrawerPrimitive.Description>) {
//   return (
//     <DrawerPrimitive.Description
//       data-slot="drawer-description"
//       className={cn('text-muted-foreground text-sm', className)}
//       {...props}
//     />
//   );
// }

// export {
//   Drawer,
//   DrawerPortal,
//   DrawerOverlay,
//   DrawerTrigger,
//   DrawerClose,
//   DrawerContent,
//   DrawerHeader,
//   DrawerFooter,
//   DrawerTitle,
//   DrawerDescription,
// };
