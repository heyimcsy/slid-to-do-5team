/**
 * next/image `images.remotePatterns` 항목과 동일한 형태(구조적 호환).
 * @see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
 */
export type ImageRemotePattern = {
  protocol?: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname?: string;
  search?: string;
};

/**
 * next/image `remotePatterns`용 출처 목록.
 * 형식: `{protocol}://{hostname}[/pathname]`
 * - hostname: 리터럴 또는 `*.example.com` 와일드카드
 * - pathname: 생략 시 모든 경로 허용. 필요 시 `/prefix/**` 등으로 제한
 */
export const REMOTE_IMAGE_SOURCES = [
  'https://placehold.co',
  'https://example.com',
  'https://*.googleusercontent.com',
  'https://*.kakaocdn.net',
  // TODO: Kakao CDN이 현재 HTTP로 이미지를 제공하므로 유지 필요.
  // Kakao CDN이 HTTPS로 마이그레이션되면 이 항목을 제거하세요.
  'http://*.kakaocdn.net',
  'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/slid-todo/**',
] as const;

export type RemoteImageSource = (typeof REMOTE_IMAGE_SOURCES)[number];

/**
 * 단일 출처 문자열을 `ImageRemotePattern`으로 변환한다.
 * @throws 프로토콜이 없거나 비어 있는 경우
 */
export function remoteImageSourceToPattern(source: string): ImageRemotePattern {
  const trimmed = source.trim();
  const protoMatch = /^(https?):\/\//i.exec(trimmed);
  if (!protoMatch) {
    throw new Error(`원격 이미지 출처에 프로토콜(https:// 또는 http://)이 없습니다: ${source}`);
  }

  const protocol = protoMatch[1].toLowerCase() as 'http' | 'https';
  const rest = trimmed.slice(protoMatch[0].length);
  const withoutHashQuery = rest.split('?')[0]?.split('#')[0] ?? rest;
  const slashIdx = withoutHashQuery.indexOf('/');

  const authority = slashIdx === -1 ? withoutHashQuery : withoutHashQuery.slice(0, slashIdx);
  const rawPathname = slashIdx === -1 ? undefined : withoutHashQuery.slice(slashIdx);

  const { hostname, port } = splitHostPort(authority);

  if (!hostname) {
    throw new Error(`원격 이미지 출처에 호스트명이 없습니다: ${source}`);
  }

  const pattern: ImageRemotePattern = { protocol, hostname, port: port ?? '' };
  if (rawPathname !== undefined && rawPathname !== '' && rawPathname !== '/') {
    pattern.pathname = rawPathname;
  }

  return pattern;
}

function splitHostPort(authority: string): { hostname: string; port?: string } {
  if (authority.startsWith('[')) {
    const end = authority.indexOf(']');
    if (end !== -1 && authority[end + 1] === ':') {
      return {
        hostname: authority.slice(0, end + 1),
        port: authority.slice(end + 2),
      };
    }
    return { hostname: authority };
  }

  const colonIdx = authority.lastIndexOf(':');
  if (colonIdx > 0 && /^[0-9]+$/.test(authority.slice(colonIdx + 1))) {
    return {
      hostname: authority.slice(0, colonIdx),
      port: authority.slice(colonIdx + 1),
    };
  }

  return { hostname: authority };
}

/** `REMOTE_IMAGE_SOURCES` 전체를 `images.remotePatterns`에 넘길 배열로 변환한다. */
export function getImageRemotePatterns(): ImageRemotePattern[] {
  return REMOTE_IMAGE_SOURCES.map((src) => remoteImageSourceToPattern(src));
}
