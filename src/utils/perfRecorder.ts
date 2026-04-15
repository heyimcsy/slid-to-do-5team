import 'server-only';

import { appendFile, mkdir, open } from 'fs/promises';
import { join } from 'path';

interface PerfRecorderOptions {
  route: string;
  warnThreshold?: number; // 이 값(ms) 초과 시 Note 컬럼에 ⚠️ 표시 (기본값: 300ms)
}

export class PerfRecorder {
  private route: string;
  private warnThreshold: number;
  private pageStartTime: number;

  constructor({ route, warnThreshold = 300 }: PerfRecorderOptions) {
    this.route = route;
    this.warnThreshold = warnThreshold;
    this.pageStartTime = performance.now();
  }

  async flush(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') return;

    try {
      const duration = performance.now() - this.pageStartTime;
      const note = duration > this.warnThreshold ? '⚠️' : '';

      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0];

      const category = this.route.split('/')[1] ?? 'unknown';
      const filePath = join(process.cwd(), 'docs', 'performance', `${category}.md`);
      const row = `| ${date} | ${time} | ${this.route} | ${duration.toFixed(2)} | ${note} |\n`;

      await mkdir(join(process.cwd(), 'docs', 'performance'), { recursive: true });

      try {
        const fh = await open(filePath, 'wx');
        try {
          const header =
            `# SSR Performance Log — ${category}\n\n` +
            '| Date | Time | Route | Duration (ms) | Note |\n' +
            '|------|------|-------|---------------|------|\n';
          await fh.writeFile(header + row, 'utf-8');
        } finally {
          await fh.close();
        }
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'EEXIST') {
          await appendFile(filePath, row, 'utf-8');
        } else {
          throw err;
        }
      }
    } catch (err) {
      console.warn('[PerfRecorder] 기록 실패:', err);
    }
  }
}
