import type { PaginatedResponse } from '@/api/response';
import type { TodoResponse } from '@/api/todos';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import { GOALS } from '@/api/goals';
import { TODOS } from '@/api/todos';
import { NOTES_TEXT } from '@/app/(routers)/(todo)/constants';
import { favoritesQueryKeys } from '@/app/(routers)/favorites/_api/favoritesQueryKeys';
import { apiClient } from '@/lib/apiClient.browser';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

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
  content: TipTapDoc;
  createdAt: string;
  linkUrl: string;
  teamId: string;
  title: string;
  todo: Pick<TodoResponse, 'id' | 'title' | 'done' | 'tags' | 'goal' | 'createdAt'>;
  todoId: number;
  updatedAt: string;
  userId: number;
}
export const NOTE = 'NOTE';
export const NOTES = 'NOTES';
export const NOTES_URL = '/notes';

export type NotesGetResponse = PaginatedResponse<Notes, 'notes'>;
type CreateNotePayload = Pick<Notes, 'todoId' | 'title'> &
  Partial<Pick<Notes, 'content' | 'linkUrl'>>;

type PatchNotePayload = Pick<Notes, 'id'> & Partial<Pick<Notes, 'title' | 'content' | 'linkUrl'>>;

export const useGetNotesInfinite = ({
  goalId,
  limit = 5,
  sort,
  search,
}: {
  goalId: number;
  limit?: number;
  sort?: string;
  search?: string;
}) => {
  return useInfiniteQuery({
    queryKey: [NOTES, { goalId, limit, sort, search }],
    queryFn: async ({ pageParam }) =>
      await apiClient<NotesGetResponse>(
        `${NOTES_URL}?goalId=${goalId}&limit=${limit}${sort ? `&sort=${sort}` : ''}${search ? `&search=${search}` : ''}${pageParam ? `&cursor=${pageParam}` : ''}`,
      ),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    placeholderData: keepPreviousData,
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

export const usePostNote = (options: { onSuccess?: () => void }) => {
  const queryClient: QueryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateNotePayload) => {
      return await apiClient<Notes>(NOTES_URL, {
        method: 'POST',
        body: payload,
      });
    },

    onMutate: async (payload: CreateNotePayload) => {
      // 진행 중인 refetch 취소 (낙관적 업데이트 덮어씌워지는 거 방지)
      await queryClient.cancelQueries({ queryKey: [NOTES] });

      // 현재 캐시 스냅샷 저장 (롤백용)
      const previousNotes = queryClient.getQueriesData({ queryKey: [NOTES] });

      // 낙관적으로 캐시에 추가
      queryClient.setQueriesData(
        { queryKey: [NOTES] },
        (old: InfiniteData<NotesGetResponse> | undefined) => {
          if (!old) return old;
          const optimisticNote: Notes = {
            id: Date.now(), // 임시 id
            title: payload.title,
            content: payload.content ?? { type: 'doc', content: [] },
            linkUrl: payload.linkUrl ?? '',
            todoId: payload.todoId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            teamId: '',
            userId: 0,
            todo: {
              id: payload.todoId,
              title: '',
              done: false,
              tags: [],
              goal: { title: '', id: Date.now() },
              createdAt: new Date().toISOString(),
            },
          };

          return {
            ...old,
            pages: old.pages.map((page: NotesGetResponse, index: number) =>
              index === 0
                ? {
                    ...page,
                    notes: [optimisticNote, ...page.notes],
                    totalCount: page.totalCount + 1,
                  }
                : page,
            ),
          };
        },
      );

      return { previousNotes };
    },

    onError: (_, __, context) => {
      // 실패 시 롤백
      context?.previousNotes.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSuccess: () => {
      options?.onSuccess?.();
    },

    onSettled: () => {
      // 성공/실패 모두 진짜 서버 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: [NOTES] });
      queryClient.invalidateQueries({ queryKey: [GOALS] });
      queryClient.invalidateQueries({ queryKey: [TODOS] });
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
    },
  });
};

export const usePatchNote = (options: { onSuccess?: () => void }) => {
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
    ...options,
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: [NOTES] });
      queryClient.invalidateQueries({ queryKey: [NOTE, payload.id] });
      toast.success(NOTES_TEXT.NOTE_EDIT_SUCCESS);
      options?.onSuccess?.();
    },
    onError: (_, __, context) => {
      console.log('error', context);
      toast.error(NOTES_TEXT.NOTE_EDIT_ERROR);
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
        (old: InfiniteData<NotesGetResponse> | undefined) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: NotesGetResponse) => ({
              ...page,
              notes: page.notes.filter((note: Notes) => note.id !== id),
            })),
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
      queryClient.invalidateQueries({ queryKey: [GOALS] });
      queryClient.invalidateQueries({ queryKey: [TODOS] });
      queryClient.invalidateQueries({ queryKey: [NOTE, payload.id] });
      queryClient.invalidateQueries({ queryKey: favoritesQueryKeys.all });
    },
  });
};
