import type { OgInfoResponse } from '@/components/common/LinkEmbed';
import type { Editor } from '@tiptap/react';

import React, { useState } from 'react';

export const useLinkEmbed = ({
  editor,
  linkData,
  setLinkUrl,
}: {
  editor: Editor | null;
  linkData: OgInfoResponse | undefined;
  setLinkUrl: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
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
