# 우리 반 실시간 칭찬 보드 — 완성본 소스코드

책 Part 4의 실전 프로젝트 **"우리 반 실시간 칭찬 보드"**의 완성 예시 코드입니다.
책을 따라 AI(Antigravity)에게 만들게 한 결과물과 비교하거나, 막혔을 때 참고용으로 사용하세요.

> 🎮 설치 없이 완성 모습을 먼저 보고 싶다면 → [체험판 데모](https://lifeofpi-ux.github.io/vibecode-for-teacher/praise-board/)

## 기술 스택

React + Vite + Supabase (PostgreSQL, Realtime)

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 테이블 준비

책의 안내에 따라 Supabase 프로젝트를 만들고, `praises` 테이블을 생성합니다.
(MCP로 생성하거나, 아래 SQL을 Supabase SQL Editor에 붙여넣고 Run)

```sql
create table praises (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Realtime 활성화
alter publication supabase_realtime add table praises;

-- 테스트 목적으로 RLS 비활성화 (실제 배포 전에는 책의 안내대로 RLS를 설정하세요!)
alter table praises disable row level security;
```

### 3. 환경변수 설정

`.env.example` 파일을 복사해 `.env` 파일을 만들고, 본인의 Supabase 값으로 채웁니다.

```bash
VITE_SUPABASE_URL=https://여러분의프로젝트.supabase.co
VITE_SUPABASE_ANON_KEY=여러분의_anon_key
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저 창을 **2개** 열고 둘 다 `http://localhost:5173`에 접속한 뒤,
한쪽 창에서 칭찬을 입력해 보세요. 다른 창에도 실시간으로 나타납니다! ✨

## 주요 파일

| 파일 | 역할 |
|---|---|
| `src/App.jsx` | 메인 화면 (입력 폼 + 칭찬 카드 보드 + Realtime 구독) |
| `src/supabaseClient.js` | Supabase 연결 설정 (환경변수 사용) |
| `src/App.css` | 파스텔 톤 카드 디자인 |
| `.env.example` | 필요한 환경변수 안내 (실제 키는 `.env`에만!) |

> ⚠️ `.env` 파일은 절대 GitHub에 올리지 마세요. 이 프로젝트의 `.gitignore`에 이미 등록되어 있습니다.
