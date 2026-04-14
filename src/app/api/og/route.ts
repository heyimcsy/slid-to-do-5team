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
      : `${origin}/favicon.ico`;

    // 외부 URL을 프록시 URL로 변환
    const proxiedFavicon = `/api/og-image?url=${encodeURIComponent(favicon)}`;
    console.log(ogImage?.[1]);
    const proxiedImage = ogImage?.[1]
      ? `/api/og-image?url=${encodeURIComponent(ogImage[1])}`
      : null;

    return Response.json({
      image: proxiedImage,
      title: ogTitle?.[1] ?? null,
      description: ogDescription?.[1] ?? null,
      favicon: proxiedFavicon,
    });
  } catch {
    return Response.json({ image: null, title: null, description: null, favicon: null });
  }
}
