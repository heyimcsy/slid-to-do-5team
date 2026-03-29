import type { PaginatedResponse } from '@/api/response';
import type { Todo } from '@/api/todos';
import type { QueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/apiClient.browser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export interface Notes {
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
const NOTES = 'NOTES';
const NOTES_URL = '/notes';

interface GetNotesParams {
  todoId?: number;
  goalId?: number;
  cursor?: number;
  limit?: number;
}

export type NotesGetResponse = PaginatedResponse<Notes, 'notes'>;
type CreateNotePayload = Pick<Notes, 'todoId' | 'title'> &
  Partial<Pick<Notes, 'content' | 'linkUrl'>>;

type PatchNotePayload = Pick<Notes, 'id'> & Partial<Pick<Notes, 'title' | 'content' | 'linkUrl'>>;
export const useGetNotes = ({ todoId, goalId, cursor, limit }: GetNotesParams = {}) => {
  return useQuery({
    queryKey: [NOTES, { todoId, goalId, cursor, limit }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (todoId !== undefined) params.append('todoId', String(todoId));
      if (goalId !== undefined) params.append('goalId', String(goalId));
      if (cursor !== undefined) params.append('cursor', String(cursor));
      if (limit !== undefined) params.append('limit', String(limit));

      const queryString = params.toString();
      const url = queryString ? `${NOTES_URL}?${queryString}` : NOTES_URL;

      return await apiClient<NotesGetResponse>(url);
    },
    enabled: !!goalId,
  });
};

export const useGetNote = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: [NOTE, id],
    queryFn: async () => {
      return await apiClient<Notes>(`${NOTES_URL}/${id}`);
    },
    enabled: !!id,
  });
};

export const usePostNote = () => {
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateNotePayload) => {
      return await apiClient<Notes>(NOTES_URL, {
        method: 'POST',
        body: payload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTES] });
    },
  });
};

export const usePatchNote = () => {
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: PatchNotePayload) => {
      const { id, ...rest } = payload;
      const body = Object.fromEntries(Object.entries(rest).filter(([_, v]) => v !== undefined));
      return await apiClient<Notes>(`${NOTES_URL}/${id}`, {
        method: 'PATCH',
        body,
      });
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [NOTES] });
      queryClient.invalidateQueries({ queryKey: [NOTE, payload.id] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return await apiClient(`${NOTES_URL}/${id}`, { method: 'DELETE' });
    },
    onMutate: async ({ id }: { id: number }) => {
      await queryClient.cancelQueries({ queryKey: [NOTES] });
      const previousTodos = queryClient.getQueriesData({ queryKey: [NOTES] });
      queryClient.setQueriesData(
        { queryKey: [NOTES] },
        (old: PaginatedResponse<Notes, 'notes'>) => {
          if (!old) return old;
          return {
            ...old,
            notes: old.notes.filter((note: Notes) => note.id !== id),
            totalCount: old.totalCount - 1,
          };
        },
      );
      return { previousTodos };
    },
    onError: (_: Error, __, context) => {
      context?.previousTodos.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: (_, __, payload) => {
      queryClient.invalidateQueries({ queryKey: [NOTES] });
      queryClient.invalidateQueries({ queryKey: [NOTE, payload.id] });
    },
  });
};
