import type { useLinkEmbedProps } from '@/app/(routers)/(todo)/goals/[goalId]/notes/types';

import React, { useState } from 'react';

export const useLinkEmbed = ({ editor, linkData, setLinkUrl }: useLinkEmbedProps) => {
  const [showEmbed, setShowEmbed] = useState(false);

  const handleLinkDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLinkUrl('');
    editor?.chain().focus().unsetLink().run();
  };

  const handleLinkClick = () => {
    if (linkData?.image) setShowEmbed((prev) => !prev);
  };

  return { showEmbed, setShowEmbed, handleLinkDelete, handleLinkClick };
};
