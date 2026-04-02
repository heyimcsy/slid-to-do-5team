export const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  })
    .format(new Date(dateStr))
    .replace(/\. /g, '.') // "2024. 04. 29." → "2024.04.29."
    .replace(/\.$/, ''); // 마지막 점 제거
};
