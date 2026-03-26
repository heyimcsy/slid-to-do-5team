type TipTapNode = { type?: string; text?: string; content?: TipTapNode[] };

const BLOCK_NODES = new Set(['paragraph', 'heading', 'listItem', 'blockquote', 'codeBlock']);

const extractText = (node: TipTapNode): string => {
  if (node.type === 'text') return node.text ?? '';
  const text = (node.content ?? []).map(extractText).join('');
  return BLOCK_NODES.has(node.type ?? '') ? text + '\n' : text;
};

const sliceParagraphs = (text: string): string =>
  text.split('\n').filter(Boolean).slice(0, 2).join('\n');

export function extractPlainText(content: string): string {
  try {
    return sliceParagraphs(extractText(JSON.parse(content) as TipTapNode));
  } catch {
    const paragraphs = content
      .split('</p>')
      .map((p) => p.replace(/<[^>]*>/g, '').trim())
      .filter(Boolean);
    return paragraphs.slice(0, 2).join('\n');
  }
}
