// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const url = searchParams.get('url');
//
//   if (!url) return Response.json({ image: null });
//
//   try {
//     const res = await fetch(url);
//     const html = await res.text();
//
//     const match =
//       html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/) ||
//       html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/);
//
//     return Response.json({ image: match?.[1] ?? null });
//   } catch {
//     return Response.json({ image: null });
//   }
// }
// 비용이 안든다

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) return Response.json({ image: null, title: null, description: null, favicon: null });

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }, // 봇 차단 우회
    });
    const html = await res.text();
    const origin = new URL(url).origin;

    // OG 이미지
    const ogImage =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/);

    // 제목
    const ogTitle =
      html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/) ??
      html.match(/<title[^>]*>([^<]+)<\/title>/);

    // 설명
    const ogDescription =
      html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/) ??
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/);

    // 파비콘
    const faviconMatch =
      html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/) ??
      html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/);

    // 파비콘 상대경로 처리
    const faviconHref = faviconMatch?.[1];
    const favicon = faviconHref
      ? faviconHref.startsWith('http')
        ? faviconHref
        : `${origin}${faviconHref.startsWith('/') ? '' : '/'}${faviconHref}`
      : `${origin}/favicon.ico`; // 없으면 기본 경로 시도

    return Response.json({
      image: ogImage?.[1] ?? null,
      title: ogTitle?.[1] ?? null,
      description: ogDescription?.[1] ?? null,
      favicon,
    });
  } catch {
    return Response.json({ image: null, title: null, description: null, favicon: null });
  }
}
