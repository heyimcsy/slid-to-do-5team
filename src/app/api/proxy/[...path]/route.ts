import { forwardToBackend } from '@/proxy';

type RouteContext = { params: Promise<{ path: string[] }> };

async function handleRequest(request: Request, pathSegments: string[]): Promise<Response> {
  const path = pathSegments.join('/');
  /** 쿼리는 `request.url`로 `forwardToBackend`에서 백엔드 URL에 이어붙임 */
  return forwardToBackend(request, path);
}

export async function GET(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return handleRequest(request, path);
}

export async function POST(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return handleRequest(request, path);
}

export async function PUT(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return handleRequest(request, path);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return handleRequest(request, path);
}

export async function DELETE(request: Request, context: RouteContext) {
  const { path } = await context.params;
  return handleRequest(request, path);
}
