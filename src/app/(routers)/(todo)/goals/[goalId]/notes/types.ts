import type { Notes } from '@/api/notes';
import type { Todo, TodoResponse } from '@/api/todos';
import type { OgInfoResponse } from '@/components/common/LinkEmbed';
import type { Ref } from 'react';

import React from 'react';
import { Editor } from '@tiptap/react';

export interface NoteListProps {
  notes: Notes[];
  goalId: number;
  observerRef: Ref<HTMLDivElement>;
  hasNextPage: boolean;
}

export interface NoteCardProps {
  goalId: number;
  id: number;
  title: string;
  todo: Pick<Todo, 'id' | 'title' | 'done'>;
  createdAt: string;
}

export interface NoteDraft {
  title: string;
  content: string;
  linkUrl: string;
  savedAt: string;
}

export interface NoteFormHeaderProps {
  titleLength: number;
  saveDraft: () => void;
  handleSubmit: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
  edit?: boolean;
  noteId?: number;
}

export interface NoteEditorProps {
  editor: Editor | null;
  setLinkUrl: React.Dispatch<React.SetStateAction<string | null>>;
  title: string;
  onHandleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  titleLength: number;
  todoData: Pick<TodoResponse, 'id' | 'title' | 'done' | 'tags' | 'goal' | 'createdAt'>;
  linkUrl: string | null;
  linkData: OgInfoResponse | undefined;
  handleLinkDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleLinkClick: () => void;
}

export interface SpeechComponentProps {
  loadDraft: () => void;
  clearDraft: () => void;
  className: string;
  edit?: boolean;
  noteId?: number;
}

export interface SaveCheckToastProps {
  saveCheck: boolean;
  elapsedSeconds: number;
}
export interface LinkEmbedOgImageProps {
  showEmbed: boolean;
  linkUrl: string | null;
  linkData: OgInfoResponse | undefined;
  linkSuccess: boolean;
  handleLinkClick: () => void;
}
export interface useLinkEmbedProps {
  editor: Editor | null;
  linkData: OgInfoResponse | undefined;
  setLinkUrl: React.Dispatch<React.SetStateAction<string | null>>;
}
export interface UseNoteDraftProps {
  type: 'note-create' | 'note-edit';
  title: string;
  linkUrl: string | null;
  editor: Editor | null;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setTitleLength: React.Dispatch<React.SetStateAction<number>>;
  setLinkUrl: React.Dispatch<React.SetStateAction<string | null>>;
  noteId?: number;
}

export interface NoteEditContainerProps {
  noteId: number;
}
