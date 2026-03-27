import type { Todo } from '@/api/todos';

import { apiClient } from '@/lib/apiClient.browser';
import { useQuery } from '@tanstack/react-query';

// ── 마크(인라인 스타일) ──────────────────────────
type BoldMark = { type: 'bold' };
type ItalicMark = { type: 'italic' };
type UnderlineMark = { type: 'underline' };
type StrikeMark = { type: 'strike' };
type CodeMark = { type: 'code' };
type HighlightMark = { type: 'highlight'; attrs?: { color: string } };
type LinkMark = { type: 'link'; attrs: { href: string; target?: string } };

type TipTapMark =
  | BoldMark
  | ItalicMark
  | UnderlineMark
  | StrikeMark
  | CodeMark
  | HighlightMark
  | LinkMark;

// ── 텍스트 노드 ──────────────────────────────────
interface TextNode {
  type: 'text';
  text: string;
  marks?: TipTapMark[];
}

// ── 인라인 노드 ──────────────────────────────────
interface HardBreakNode {
  type: 'hardBreak'; // 강제 줄바꿈 <br>
}

// ── 블록 노드 ────────────────────────────────────
interface ParagraphNode {
  type: 'paragraph';
  content?: (TextNode | HardBreakNode)[];
}

interface HeadingNode {
  type: 'heading';
  attrs: { level: 1 | 2 | 3 | 4 | 5 | 6 };
  content?: TextNode[];
}

interface BulletListNode {
  type: 'bulletList';
  content: ListItemNode[];
}

interface OrderedListNode {
  type: 'orderedList';
  attrs?: { start: number };
  content: ListItemNode[];
}

interface ListItemNode {
  type: 'listItem';
  content: (ParagraphNode | BulletListNode | OrderedListNode)[]; // 중첩 가능
}

interface BlockquoteNode {
  type: 'blockquote';
  content: ParagraphNode[];
}

interface CodeBlockNode {
  type: 'codeBlock';
  attrs?: { language: string };
  content: TextNode[];
}

interface HorizontalRuleNode {
  type: 'horizontalRule'; // 구분선 <hr>
}

interface ImageNode {
  type: 'image';
  attrs: {
    src: string;
    alt?: string;
    title?: string;
  };
}

type TipTapNode =
  | ParagraphNode
  | HeadingNode
  | BulletListNode
  | OrderedListNode
  | ListItemNode
  | BlockquoteNode
  | CodeBlockNode
  | HorizontalRuleNode
  | ImageNode;

// ── 최상위 Doc ───────────────────────────────────

export interface TipTapDoc {
  type: 'doc';
  content: TipTapNode[];
}

export interface Note {
  id: number;
  content: string;
  createdAt: string;
  linkUrl: string;
  teamId: string;
  title: string;
  todo: Pick<Todo, 'id' | 'title' | 'done'>;
  todoId: number;
  updatedAt: string;
  userId: number;
}
const NOTE = 'NOTE';
const NOTES_URL = '/notes';
export const useGetNote = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: [NOTE, id],
    queryFn: async () => {
      const data = await apiClient<Note>(`${NOTES_URL}/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
