'use client';

import React from 'react';

import { Icon } from '@/components/icon/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DeleteDialogProps {
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // 공통
  title: string;
  description: string;
  onConfirm: () => void;
}
/**
 * @description 삭제 확인 다이얼로그 공통 컴포넌트
 * @constructor 최서윤
 *
 * ## 비제어 모드 (trigger 전달)
 * 버튼이 직접 다이얼로그를 여는 방식. `trigger`에 ReactElement를 전달하면
 * DialogTrigger로 자동 연결됩니다.
 * ```tsx
 * <DeleteDialog
 *   trigger={<Button>삭제</Button>}
 *   title="정말 삭제하시겠어요?"
 *   description="삭제된 노트는 복구할 수 없습니다."
 *   onConfirm={handleDelete}
 * />
 * ```
 *
 * ## 제어 모드 (open/onOpenChange 전달)
 * 외부 state로 다이얼로그를 제어하는 방식. Select나 다른 트리거와 연동할 때 사용합니다.
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <DeleteDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="정말 삭제하시겠어요?"
 *   description="삭제된 목표는 복구할 수 없습니다."
 *   onConfirm={handleDelete}
 * />
 * ```
 *
 * @param trigger - 비제어 모드용. 클릭 시 다이얼로그를 여는 ReactElement 다이얼로그를 여는 버튼 같은것을 넣어주면 됩니다.
 * @param open - 제어 모드용. 다이얼로그 열림 상태
 * @param onOpenChange - 제어 모드용. 다이얼로그 열림 상태 변경 핸들러
 * @param title - 다이얼로그 제목
 * @param description - 다이얼로그 경고 설명 (주황색으로 표시됨)
 * @param onConfirm - 확인 버튼 클릭 핸들러
 */
export function DeleteDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: Readonly<DeleteDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent
        showCloseButton={false}
        className="w-86 space-y-8 pt-8 md:w-114 md:space-y-10 md:pt-8"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="font-xs-regular md:font-base-regular flex items-center text-orange-600">
            <Icon name="warning" variant="orange" size={18} />
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button type="button" variant="ghost" className="w-1/2">
                취소
              </Button>
            }
          />
          <DialogClose
            render={
              <Button onClick={onConfirm} type="button" variant="default" className="w-1/2">
                확인
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
