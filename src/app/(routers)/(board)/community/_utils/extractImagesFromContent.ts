interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  attrs?: Record<string, unknown>;
}

interface TiptapDoc {
  type: string;
  content: TiptapNode[];
}

export function extractImagesFromContent(contentJson: string): {
  contentWithoutImages: string;
  imageUrls: string[];
} {
  try {
    const json = JSON.parse(contentJson) as TiptapDoc;
    const imageUrls: string[] = [];

    const filteredContent = (json.content ?? []).filter((node) => {
      if (
        node.type === 'paragraph' &&
        node.content?.length === 1 &&
        node.content[0].type === 'image'
      ) {
        const src = node.content[0].attrs?.src;
        if (typeof src === 'string') imageUrls.push(src);
        return false;
      }
      return true;
    });

    return {
      contentWithoutImages: JSON.stringify({ ...json, content: filteredContent }),
      imageUrls,
    };
  } catch {
    return { contentWithoutImages: contentJson, imageUrls: [] };
  }
}
