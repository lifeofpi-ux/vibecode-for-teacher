# Ch 4. MCP로 Supabase 실시간 협업 보드 만들기

> 🖥 **완성 모습이 궁금하다면?** → [체험판 데모 보기](https://lifeofpi-ux.github.io/vibecode-for-teacher/praise-board/)
> (체험판은 Supabase 없이 동작합니다. 창을 2개 열면 실시간 반영을 체험할 수 있어요!)

Antigravity IDE에서 MCP(Supabase 연결)를 설정한 뒤, 아래 프롬프트를 순서대로 사용합니다.

> 📌 **Antigravity 2.0 안내** — 2.0 발표 이후 Agent Manager는 IDE에서 분리되어 독립 앱이 되었고,
> Antigravity IDE 안에서는 우측 **에이전트 패널(Ctrl+L, macOS는 Cmd+L)**로 통합되었습니다.
> 아래 세 프롬프트는 모두 이 에이전트 패널에 입력합니다.
> 새 대화를 시작하려면 패널 우측 상단의 [+] 버튼(New Conversation, Ctrl+Shift+L)을 클릭하세요.

## 1. PRD 작성 프롬프트 (에이전트 패널, Ctrl+L)

```
우리 반 실시간 칭찬 보드 앱의 PRD(제품 요구사항 문서)를 작성해줘.

앱 설명:
- 학생 이름과 칭찬 메시지를 입력할 수 있는 폼이 있다
- 입력하면 칭찬 카드가 보드에 추가된다
- Supabase를 사용해 데이터를 저장한다
- Supabase Realtime 기능으로 여러 브라우저 창에서 동시에 칭찬이 실시간 반영된다
- React + Vite로 개발한다
- 디자인은 깔끔하고 밝은 느낌으로 (교육 환경에 맞게)

문서는 PRD.md 파일로 프로젝트 루트에 저장해줘.
```

## 2. MCP로 Supabase 테이블 생성 프롬프트 (에이전트 패널, Ctrl+L)

```
Supabase에 칭찬 보드 앱을 위한 테이블을 만들어줘.

테이블 이름: praises
필드:
- id: UUID, 기본 키, 자동 생성
- student_name: TEXT, 필수
- message: TEXT, 필수
- created_at: TIMESTAMP WITH TIME ZONE, 기본값 now()

그리고 이 테이블에 Supabase Realtime을 활성화해줘.
Row Level Security는 일단 비활성화해줘 (테스트 목적).
```

## 3. 앱 구현 프롬프트 (에이전트 패널, Ctrl+L)

```
@PRD.md 를 참고해서 실시간 칭찬 보드 앱을 만들어줘.

기술 스택:
- React + Vite (현재 프로젝트)
- Supabase (이미 설정된 MCP로 연결된 상태)

구현 내용:
1. App.jsx 메인 화면 구성
   - 학생 이름 입력 필드
   - 칭찬 메시지 입력 필드
   - 칭찬 추가 버튼
   - 칭찬 목록 표시 영역 (카드 형태)

2. Supabase 연동 (src/supabaseClient.js 파일 생성)
   - supabase-js 패키지 사용
   - 환경 변수로 URL과 key 관리

3. 실시간 기능
   - Supabase Realtime 구독으로 새 칭찬 즉시 반영

4. 스타일
   - App.css에 깔끔하고 밝은 디자인 적용

환경 변수 파일(.env)도 만들어줘. 변수명은:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
```

> ⚠️ RLS를 비활성화한 상태는 테스트 목적입니다. 실제 배포 전에는 반드시 책에서 안내하는 RLS 설정을 적용하세요.
