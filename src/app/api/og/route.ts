export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) return Response.json({ image: null });

  try {
    const res = await fetch(url);
    const html = await res.text();

    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/);

    return Response.json({ image: match?.[1] ?? null });
  } catch {
    return Response.json({ image: null });
  }
}
// 비용이 안든다
