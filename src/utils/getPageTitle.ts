export const getPageTitle = (pathname: string, name?: string) => {
  const p = name ? `${name}님의 ` : '';

  if (pathname.startsWith('/calendar')) return `${p}캘린더`;
  if (pathname.startsWith('/dashboard/todos')) return '모든 할 일';
  if (pathname.startsWith('/dashboard')) return `${p}대시보드`;
  if (pathname.includes('/notes')) return '노트 모아보기';
  if (pathname.startsWith('/goals')) return `${p}목표`;
  if (pathname.startsWith('/community')) return '소통 게시판';
  if (pathname.startsWith('/favorites')) return '찜한 할 일';
  if (pathname.startsWith('/profile')) return '내 정보 관리';

  return '';
};
