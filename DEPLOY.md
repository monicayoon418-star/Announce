# 어나운스 배포 가이드

## 배포 전 준비사항 (총 4개 서비스)

---

### 1. Supabase (데이터베이스)

1. [supabase.com](https://supabase.com) → 무료 계정 생성
2. New Project 클릭 → 프로젝트 이름 입력 → DB 비밀번호 설정 (저장 필수!)
3. Settings → Database → Connection string 복사
   - **Transaction pooler** → `DATABASE_URL`
   - **Direct connection** → `DIRECT_URL`

---

### 2. Kakao Developers (지도 API)

1. [developers.kakao.com](https://developers.kakao.com) → 카카오 계정으로 로그인
2. 내 애플리케이션 → 애플리케이션 추가하기
3. 앱 이름 "어나운스" 입력 → 저장
4. 앱 설정 → 플랫폼 → Web → 사이트 도메인 추가:
   - `http://localhost:3000`
   - 배포 후 실제 도메인도 추가
5. 앱 키 → **JavaScript 키** 복사 → `NEXT_PUBLIC_KAKAO_MAP_KEY`
6. 제품 설정 → 지도 → 활성화

---

### 3. GitHub (코드 업로드)

```bash
cd /Users/yoon/Desktop/Announce
git init
git add .
git commit -m "initial commit"
```
- github.com → New repository → 이름 입력 → Create
- 화면에 나오는 명령어 복사해서 터미널에 실행

---

### 4. Vercel (배포)

1. [vercel.com](https://vercel.com) → GitHub로 로그인
2. New Project → GitHub 저장소 선택 → Import
3. **Environment Variables** 섹션에서 아래 변수 입력:

| 변수명 | 값 |
|--------|-----|
| `DATABASE_URL` | Supabase Transaction pooler URL |
| `DIRECT_URL` | Supabase Direct connection URL |
| `NEXTAUTH_URL` | `https://[vercel-domain].vercel.app` |
| `NEXTAUTH_SECRET` | 랜덤 문자열 (아래 생성법 참고) |
| `NEXT_PUBLIC_KAKAO_MAP_KEY` | 카카오 JavaScript 키 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 토큰 (아래 참고) |

4. Deploy 클릭!

---

### NEXTAUTH_SECRET 생성

터미널에서:
```bash
openssl rand -base64 32
```
출력된 값을 `NEXTAUTH_SECRET`에 입력

---

### Vercel Blob 설정 (이미지 업로드)

1. Vercel 대시보드 → Storage → Create Database → Blob
2. Connect to Project
3. .env.local에 `BLOB_READ_WRITE_TOKEN` 자동 추가됨
4. Vercel 환경변수에도 추가

---

### 데이터베이스 초기화

배포 후 터미널에서:
```bash
npm install
npx prisma db push
```

---

## 로컬 개발

```bash
# 1. 환경변수 설정
cp .env.example .env.local
# .env.local 파일 열어서 값 입력

# 2. 패키지 설치
npm install

# 3. DB 스키마 적용
npx prisma db push

# 4. 개발 서버 실행
npm run dev
# → http://localhost:3000
```

---

## 주요 페이지

| URL | 설명 |
|-----|------|
| `/` | 지도 메인 |
| `/explore` | 이벤트 탐색 목록 |
| `/events/[id]` | 이벤트 상세 |
| `/wishlist` | 찜 목록 |
| `/operator/register` | 운영자 회원가입 |
| `/operator/login` | 운영자 로그인 |
| `/operator/dashboard` | 이벤트 관리 대시보드 |
| `/operator/events/new` | 새 이벤트 등록 |
