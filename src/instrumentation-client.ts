// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // 추가 기능을 위한 설정 (여기서는 세션 리플레이 기능 활성화)
  integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],

  // 성능 모니터링(트레이싱) 수집 비율
  // 0.1은 10%의 트래픽만 수집한다는 뜻입니다. (비용/데이터 아끼기 위해 조절 가능)
  tracesSampleRate: 0.1,

  // 일반적인 사용자 세션 녹화 비율
  // 0으로 설정하면 평소에는 녹화하지 않습니다.
  replaysSessionSampleRate: 0,

  // 에러가 발생했을 때만 세션을 녹화할 비율
  // 1.0은 에러 발생 시 100% 확률로 그 직전 상황을 녹화하여 보여줍니다.
  replaysOnErrorSampleRate: 1.0,

  // 사용자 개인 식별 정보(IP, 이메일 등) 전송 여부
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
