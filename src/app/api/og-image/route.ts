export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) return new Response('Missing url', { status: 400 });

  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') ?? 'image/png';

    return new Response(buffer, {
      headers: { 'Content-Type': contentType },
    });
  } catch {
    return new Response('Failed', { status: 500 });
  }
}
