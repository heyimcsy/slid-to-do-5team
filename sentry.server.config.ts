// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // 서버 성능 모니터링 수집 비율
  // 서버에서 발생하는 API 요청, DB 쿼리 등의 성능 데이터를 10%만 수집합니다.
  tracesSampleRate: 0.1,

  // 사용자 개인 식별 정보(IP, 이메일 등) 전송 여부
  // true일 경우 에러 발생 시 해당 유저의 IP나 관련 정보를 함께 기록합니다.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
});
