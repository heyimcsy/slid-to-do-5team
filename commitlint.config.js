/**
 * Commitlint 설정
 *
 * 커밋 메시지 형식:
 * ⚠️ conventional commit의 description === commitlint의 subject
 * <:gitmoji:> <type>[optional scope]: <subject>
 * [optional body]
 * [optional footer]
 *
 * 예시: ✨ feat(auth): 로그인 기능 추가
 */
module.exports = {
  // gitmoji와 conventional commit 규칙을 함께 적용
  extends: ['gitmoji', '@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새로운 기능 추가
        'fix', // 버그 수정
        'docs', // 문서 수정
        'style', // 코드 스타일 변경 (코드 포매팅, 세미콜론 누락 등)
        'refactor', // 코드 리팩토링
        'test', // 테스트 코드 추가
        'chore', // 빌드 프로세스 또는 보조 도구 및 라이브러리 수정
        'perf', // 성능 개선
        'revert', // 이전 커밋으로 되돌림
        'ci', // CI/CD 관련 변경
        'build', // 빌드 시스템 또는 외부 종속성 영향을 미치는 변경
      ],
    ],
    'start-with-gitmoji': [2, 'always'], // 커밋 메시지는 반드시 gitmoji로 시작
    'type-case': [2, 'always', 'lower-case'], // 타입은 항상 소문자로
    'scope-case': [2, 'always', 'lower-case'], // scope는 항상 소문자로
    'subject-empty': [2, 'never'], // 빈 제목 금지
    'subject-case': [0], // 제목 대소문자 구분 안함
    'subject-full-stop': [2, 'never', '.'], // 제목 끝에 마침표 금지
    'subject-max-length': [2, 'always', 50], // 제목 길이 50자 제한
    'subject-min-length': [2, 'always', 1], // 제목 길이 1자 이상

    // 아래 규칙들은 현재 비활성화되어 있습니다
    // 'scope-empty': [0, 'never'],           // scope는 비워둘 수 없음
    // 'body-leading-blank': [2, 'always'],   // 본문 앞뒤에 빈 줄 추가
  },
  parserPreset: {
    parserOpts: {
      // gitmoji 이모지 + conventional commit 형식 파싱을 위한 정규식
      headerPattern:
        /^(?::\w*:|[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\p{Emoji_Component}]+)\s(?<type>\w+)(?:\((?<scope>.*)\))?!?:\s(?<subject>(?:(?!#).)*(?:(?!\s).))$/u,
      // gitmoji 이모지 + conventional commit 형식 헤더 파싱을 위한 그룹 정의
      headerCorrespondence: ['type', 'scope', 'subject', 'body', 'footer'],
    },
  },
};
