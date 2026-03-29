'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { Icon } from '@/components/icon/Icon';

export interface KebabMenuItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface KebabMenuProps {
  items: KebabMenuItem[];
  disabled?: boolean;
}

export function KebabMenu({ items, disabled = false }: KebabMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label="더보기"
        disabled={disabled}
        className="flex cursor-pointer items-center justify-center rounded-lg p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="more" size={24} />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className="absolute top-full right-0 z-10 mt-1 w-[120px] overflow-hidden rounded-2xl bg-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsOpen(false);
              }}
              className={`font-base-medium w-full px-5 py-4 text-left hover:bg-gray-50 ${
                item.variant === 'danger' ? 'text-red-500' : 'text-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
