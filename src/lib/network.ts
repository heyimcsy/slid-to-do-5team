import { networkInterfaces } from 'os';

export const getLocalSubnetList = (): string[] => {
  const interfaces = networkInterfaces();
  const subnets: Set<string> = new Set();

  for (const networks of Object.values(interfaces)) {
    if (!networks) continue;
    for (const network of networks) {
      // IPv4, 내부(사설) 주소만 필터링
      if (network.family !== 'IPv4' || network.internal) continue;

      // 사설 대역 확인: 10.x, 172.16~31.x, 192.168.x
      const [a, b, c] = network.address.split('.').map(Number);
      const isPrivate = a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
      if (isPrivate) {
        subnets.add(`${a}.${b}.${c}`);
      }
    }
  }

  const result = [...subnets].flatMap((subnet) =>
    Array.from({ length: 256 }, (_, i) => `${subnet}.${i}`),
  );
  return result;
};
