# 슬리드 투두

## 프로젝트 소개

- 슬리드 투두는 다양한 콘텐츠를 할 일 목록으로 관리하고 학습 진도, 프로젝트 진행 상황 등을 대시보드로 보여주며, 각 할일에 대한 노트를 작성해 관리해주는 서비스입니다.
- 🗓️ 프로젝트 기간 : 2025. 3.10. ~ 4.17. (38일)
- 🎥 시연영상 및 발표자료(Google Drive)

## 팀원 구성

| 이름 | 역할 | Github |
| --- | --- | --- |
| 최서윤 | 팀장 | [@heyimcsy](https://github.com/heyimcsy) |
| 이수지 | 팀원 | [@suwojiii](https://github.com/suwojiii) |
| 이현우 | 팀원 | [@gealot](https://github.com/gealot) |
| 조승기 | 팀원 | [@jojosg](https://github.com/jojosg) |

## 기술 스택

| 종류 | 기술 |
| --- | --- |
| 언어 | Typescript |
| 프레임워크 | NextJS 16 App Router |
| 서버 상태 관리 | Tanstack Query 5 |
| 클라이언트 상태 관리 | Zustand |
| 스타일링 | Tailwind CSS 4, shadcn/ui |
| 폼 관리 및 유효성 검사 | React Hook Form + Zod |
| 애니메이션 | Motion |
| 리치 텍스트 에디터 | Tiptap |
| CI/CD | Github Actions |
| 테스팅 | Jest(or Vitest) |
| Quality | ESLint/Prettier |

## 요구사항

- PNPM을 패키지 매니저로 사용할 것이므로 아래 명령어를 통해 전역 설치

```bash
# npm을 사용하여 pnpm 전역 설치
npm i -g pnpm@latest
# macOS의 경우
brew install pnpm
```

### 사용방법

- 스크립트 실행 시 `npm run` 자리에 `pnpm`을 사용해주세요.

```bash
npm run dev   -> pnpm dev
npm run start -> pnpm start
npm run build -> pnpm build
npm run lint  -> pnpm lint
...
```

### 디렉터리 구조

```tree
/
├── .github/
│   └── workflows/
│       ├── ci.yml                        # PR 검증 (lint, type-check, test)
│       └── deploy.yml                    # main 머지 → Vercel 배포
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (auth)/                       # Route Group: 인증 불필요 레이아웃
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/                  # Route Group: 인증 필요 레이아웃
│   │   │   ├── todos/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx          # 투두 상세
│   │   │   │   └── page.tsx              # 투두 목록
│   │   │   └── layout.tsx                # 공통 헤더/사이드바
│   │   ├── globals.css
│   │   ├── layout.tsx                    # RootLayout (Provider 주입)
│   │   └── not-found.tsx
│   │
│   ├── shared/                           # 도메인 무관 공통 유틸리티
│   │   └── index.ts
│   │
│   ├── constants/                        # 전역 상수
│   │   ├── api.ts                        # API endpoint, base URL
│   │   ├── query-keys.ts                 # TanStack Query key factory
│   │   └── routes.ts                     # 라우트 경로 상수
│   │
│   ├── types/                            # 전역 TypeScript 타입
│   │   ├── api.ts                        # API 요청/응답 공통 타입
│   │   ├── auth.ts
│   │   └── todo.ts
│   │
│   ├── utils/                            # 순수 함수 유틸리티
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── validator.ts
│   │
│   ├── lib/                              # 외부 라이브러리 설정/래핑
│   │   ├── axios.ts                      # Axios 인스턴스 + 인터셉터
│   │   ├── query-client.ts               # TanStack Query client 설정
│   │   └── zod.ts                        # 공통 Zod schema 유틸
│   │
│   ├── services/                         # API 통신 레이어 (도메인별)
│   │   ├── auth.service.ts
│   │   └── todo.service.ts
│   │
│   ├── stores/                           # Zustand 스토어 (도메인별)
│   │   ├── auth.store.ts                 # 인증 상태 (user, token)
│   │   ├── todo-filter.store.ts          # 필터/정렬 상태
│   │   └── ui.store.ts                   # 모달, 사이드바 등 UI 상태
│   │
│   ├── hooks/                            # 커스텀 훅 (도메인별)
│   │   ├── auth/
│   │   │   └── use-auth.ts
│   │   └── todo/
│   │       ├── use-todo-list.ts          # TanStack Query 래핑
│   │       ├── use-todo-detail.ts
│   │       └── use-todo-mutations.ts     # create / update / delete
│   │
│   ├── components/                       # UI 컴포넌트 (Feature-by-Domain)
│   │   ├── ui/                           # 범용 원자 컴포넌트 (shadcn 등)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── modal.tsx
│   │   ├── layout/                       # 레이아웃 컴포넌트
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   ├── auth/                         # 인증 도메인 컴포넌트
│   │   │   └── login-form.tsx
│   │   └── todo/                         # 할일 도메인 컴포넌트
│   │       ├── todo-list.tsx
│   │       ├── todo-item.tsx
│   │       ├── todo-create-form.tsx
│   │       ├── todo-detail.tsx           # Tiptap 에디터 포함
│   │       └── todo-filter-bar.tsx
│   │
│   └── proxy.ts                     # JWT 인증 라우트 프록시
│
├── .coderabbit.yaml
├── .eslintrc.json
├── .prettierrc
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

### Good to Know

- 아래는 팀 프로젝트 협업 시 필요한 VSCode 확장이므로 설치하여 주시기 바랍니다.

- Tailwind CSS IntelliSense <https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss>
- PostCSS Sorting <https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-postcss-sorting>
- Gitmoji <https://marketplace.visualstudio.com/items?itemName=seatonjiang.gitmoji-vscode>

### References

- npm 각종 scripts 관련 <https://docs.npmjs.com/cli/v11/using-npm/scripts>
- css classname 명명할 때 참고 <https://classnames.paulrobertlloyd.com/>
- Design System Token Glossary 참고 <https://martacondedesign.gumroad.com/l/tokens_glossary?layout=profile>
