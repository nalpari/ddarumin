# 힘이나는 커피생활 홈페이지 개발 요구사항

## 프로젝트 개요

- **프로젝트명**: #힘이나는커피생활 홈페이지 v2.0
- **회사명**: ㈜따름인
- **기술 스택**: Next.js + Supabase + Prisma + Shadcn UI + Tailwind CSS
- **참고 디자인**: http://www.heemina.com/

## 기술 스펙

### Frontend

- **Framework**: Next.js (App Router 사용)
- **UI 라이브러리**: Shadcn UI
- **스타일링**: Tailwind CSS
- **언어**: TypeScript

### Backend

- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **인증**: Supabase Auth
- **파일 저장**: Supabase Storage

## 라우팅 구조

### 관리자 시스템 (/admin)

#### 1.1 인증 관련

- `GET /admin/login` - 관리자 로그인 페이지
- `POST /api/admin/auth/login` - 로그인 처리
- `POST /api/admin/auth/logout` - 로그아웃 처리

#### 1.2 게시물 관리

**가맹문의 관리**

- `GET /admin/posts/franchise-inquiries` - 가맹문의 목록
- `GET /admin/posts/franchise-inquiries/[id]` - 가맹문의 상세/수정
- `GET /api/admin/franchise-inquiries` - 가맹문의 목록 API
- `PUT /api/admin/franchise-inquiries/[id]` - 가맹문의 수정 API

**창업설명회 관리**

- `GET /admin/posts/startup-sessions` - 창업설명회 목록
- `GET /admin/posts/startup-sessions/create` - 창업설명회 등록
- `GET /admin/posts/startup-sessions/[id]` - 창업설명회 상세/수정
- `GET /api/admin/startup-sessions` - 창업설명회 목록 API
- `POST /api/admin/startup-sessions` - 창업설명회 등록 API
- `PUT /api/admin/startup-sessions/[id]` - 창업설명회 수정 API
- `DELETE /api/admin/startup-sessions/[id]` - 창업설명회 삭제 API

**FAQ 관리**

- `GET /admin/posts/faqs` - FAQ 목록
- `GET /admin/posts/faqs/create` - FAQ 등록
- `GET /admin/posts/faqs/[id]` - FAQ 상세/수정
- `GET /api/admin/faqs` - FAQ 목록 API
- `POST /api/admin/faqs` - FAQ 등록 API
- `PUT /api/admin/faqs/[id]` - FAQ 수정 API
- `DELETE /api/admin/faqs/[id]` - FAQ 삭제 API

#### 1.3 메뉴 관리

**카테고리 관리**

- `GET /admin/menus/categories` - 카테고리 목록
- `GET /admin/menus/categories/create` - 카테고리 등록
- `GET /admin/menus/categories/[id]` - 카테고리 상세/수정
- `GET /api/admin/categories` - 카테고리 목록 API
- `POST /api/admin/categories` - 카테고리 등록 API
- `PUT /api/admin/categories/[id]` - 카테고리 수정 API
- `DELETE /api/admin/categories/[id]` - 카테고리 삭제 API

**메뉴 관리**

- `GET /admin/menus/items` - 메뉴 목록
- `GET /admin/menus/items/create` - 메뉴 등록
- `GET /admin/menus/items/[id]` - 메뉴 상세/수정
- `GET /api/admin/menus` - 메뉴 목록 API
- `POST /api/admin/menus` - 메뉴 등록 API
- `PUT /api/admin/menus/[id]` - 메뉴 수정 API
- `DELETE /api/admin/menus/[id]` - 메뉴 삭제 API

**신메뉴 관리**

- `GET /admin/menus/new-menus` - 신메뉴 목록
- `GET /admin/menus/new-menus/create` - 신메뉴 등록
- `GET /admin/menus/new-menus/[id]` - 신메뉴 상세/수정
- `GET /api/admin/new-menus` - 신메뉴 목록 API
- `POST /api/admin/new-menus` - 신메뉴 등록 API
- `PUT /api/admin/new-menus/[id]` - 신메뉴 수정 API
- `DELETE /api/admin/new-menus/[id]` - 신메뉴 삭제 API

#### 1.4 매장 관리

- `GET /admin/stores` - 매장 목록
- `GET /admin/stores/create` - 매장 등록
- `GET /admin/stores/[id]` - 매장 상세/수정
- `GET /api/admin/stores` - 매장 목록 API
- `POST /api/admin/stores` - 매장 등록 API
- `PUT /api/admin/stores/[id]` - 매장 수정 API
- `DELETE /api/admin/stores/[id]` - 매장 삭제 API

#### 1.5 이벤트 관리

- `GET /admin/events` - 이벤트 목록
- `GET /admin/events/create` - 이벤트 등록
- `GET /admin/events/[id]` - 이벤트 상세/수정
- `GET /api/admin/events` - 이벤트 목록 API
- `POST /api/admin/events` - 이벤트 등록 API
- `PUT /api/admin/events/[id]` - 이벤트 수정 API
- `DELETE /api/admin/events/[id]` - 이벤트 삭제 API

#### 1.6 시스템 관리

**관리자 관리**

- `GET /admin/system/admins` - 관리자 목록
- `GET /admin/system/admins/create` - 관리자 등록
- `GET /admin/system/admins/[id]` - 관리자 상세/수정
- `GET /api/admin/admins` - 관리자 목록 API
- `POST /api/admin/admins` - 관리자 등록 API
- `PUT /api/admin/admins/[id]` - 관리자 수정 API
- `DELETE /api/admin/admins/[id]` - 관리자 삭제 API

### 공용 홈페이지 (/)

- `GET /` - 메인 페이지
- `GET /menus` - 메뉴 소개
- `GET /stores` - 매장 찾기
- `GET /events` - 이벤트
- `GET /franchise` - 가맹 문의
- `GET /startup-session` - 창업설명회

#### 1.1 인증 시스템

- **로그인 기능**
  - 관리자 ID/비밀번호 로그인
  - 아이디 저장 기능
  - 세션 관리
  - 비밀번호 변경 기능 (8자 이상 영문+숫자 조합)

#### 1.2 게시물 관리

- **가맹문의 관리**

  - 목록 조회 (검색: 문의자, 처리여부, 지역, 등록일/수정일)
  - 상세 조회/수정
  - 처리여부 관리 (처리전/처리완료)
  - 처리완료 시 이메일 자동 발송

- **창업설명회 관리**

  - 목록 조회 (검색: 상태, 장소, 신청자유무, 설명회일자)
  - 상세 등록/수정/삭제
  - 신청자 목록 관리
  - 신청자 엑셀 다운로드
  - 상태별 관리 (대기중/접수중/접수종료)

- **자주묻는 질문 (FAQ) 관리**
  - 목록 조회 (검색: 제목/내용, 분류)
  - 분류별 관리 (매장/메뉴/창업/스마트오더)
  - 등록/수정/삭제

#### 1.3 메뉴 관리

- **카테고리 관리**

  - 카테고리 등록/수정/삭제
  - 사용/미사용 상태 관리
  - 연결된 메뉴 수 표시

- **메뉴 관리**

  - 메뉴 등록/수정/삭제
  - 카테고리별 분류
  - 판매가/할인가 설정
  - 마케팅 태그 (New/Best/Event)
  - HOT/COLD 옵션
  - 상품 이미지 업로드
  - 사용/미사용 상태 관리

- **신메뉴 관리**
  - 신메뉴 포스터 등록/수정/삭제
  - 게시기간 설정
  - 상태 관리 (대기중/운영중/종료)

#### 1.4 매장 관리

- **매장 정보 관리**
  - 매장 등록/수정/삭제
  - 운영여부 관리 (운영/미운영/상담중)
  - 지역별 분류
  - 주소 검색 기능 (다음 우편번호 API)
  - 매장 위치 지도 연동
  - 매장 이미지 관리
  - 매장 옵션 (배달/주차/모바일앱주문)
  - 직영/가맹점 구분

#### 1.5 이벤트 관리

- **이벤트 관리**
  - 이벤트 등록/수정/삭제
  - 이벤트 기간 설정
  - 적용 매장 선택 (전체/개별 매장)
  - 이벤트 이미지 업로드
  - 대기중 홈페이지 노출 옵션
  - 상태 관리 (대기중/운영중/종료)

#### 1.6 시스템 관리

- **관리자 관리**
  - 관리자 계정 등록/수정
  - 관리자 ID 중복 체크 (6자 이상 영문+숫자)
  - 비밀번호 초기화 기능
  - 사용/미사용 상태 관리

### 2. 공통 기능

#### 2.1 파일 관리

- **이미지 업로드**
  - Drag & Drop 방식
  - JPG, PNG, GIF 지원
  - 파일 개수 표시
  - 개별/전체 삭제 기능
  - 이미지 미리보기

#### 2.2 검색 및 필터링

- **공통 검색 기능**
  - 등록자/수정자 검색
  - 등록일/수정일 기간 검색
  - 상태별 필터링
  - 검색 조건 초기화

#### 2.3 페이지네이션

- **목록 페이징**
  - 기본 20건씩 표시
  - 페이지 네비게이션

## 데이터베이스 설계 요구사항

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 관리자
model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  name      String
  status    AdminStatus @default(ACTIVE)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("admins")
}

enum AdminStatus {
  ACTIVE
  INACTIVE
}

// 가맹문의
model FranchiseInquiry {
  id               String   @id @default(cuid())
  name             String
  ageGroup         String   @map("age_group")
  phone            String
  email            String?
  storeOwnership   StoreOwnership @map("store_ownership")
  region           String
  brandAwareness   String[] @map("brand_awareness")
  availableTime    String   @map("available_time")
  content          String
  status           InquiryStatus @default(PENDING)
  response         String?
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@map("franchise_inquiries")
}

enum StoreOwnership {
  OWN
  NONE
}

enum InquiryStatus {
  PENDING
  COMPLETED
}

// 창업설명회
model StartupSession {
  id                 String   @id @default(cuid())
  round              Int      @unique
  sessionDate        DateTime @map("session_date")
  sessionTime        String   @map("session_time")
  location           SessionLocation
  additionalLocation String?  @map("additional_location")
  registrationStart  DateTime @map("registration_start")
  registrationEnd    DateTime @map("registration_end")
  status             SessionStatus @default(WAITING)
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  applicants SessionApplicant[]

  @@map("startup_sessions")
}

enum SessionLocation {
  HEADQUARTERS
  SEOUL_OFFICE
  MUGYO_BRANCH
  YEOUIDO_BRANCH
}

enum SessionStatus {
  WAITING
  ACCEPTING
  CLOSED
}

// 창업설명회 신청자
model SessionApplicant {
  id             String   @id @default(cuid())
  sessionId      String   @map("session_id")
  name           String
  ageGroup       String   @map("age_group")
  phone          String
  email          String
  storeOwnership StoreOwnership @map("store_ownership")
  attendeeCount  Int      @map("attendee_count")
  desiredRegion  String   @map("desired_region")
  availableTime  String   @map("available_time")
  createdAt      DateTime @default(now()) @map("created_at")

  session StartupSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@map("session_applicants")
}

// FAQ
model FAQ {
  id        String     @id @default(cuid())
  category  FAQCategory
  title     String
  content   String
  status    ContentStatus @default(ACTIVE)
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  @@map("faqs")
}

enum FAQCategory {
  STORE
  MENU
  STARTUP
  SMART_ORDER
}

enum ContentStatus {
  ACTIVE
  INACTIVE
}

// 카테고리
model Category {
  id        String        @id @default(cuid())
  name      String        @unique
  status    ContentStatus @default(ACTIVE)
  createdAt DateTime      @default(now()) @map("created_at")
  updatedAt DateTime      @updatedAt @map("updated_at")

  menus Menu[]

  @@map("categories")
}

// 메뉴
model Menu {
  id              String        @id @default(cuid())
  categoryId      String        @map("category_id")
  name            String
  price           Int
  discountPrice   Int?          @map("discount_price")
  marketingTags   MarketingTag[] @map("marketing_tags")
  hotColdOptions  Temperature[] @map("hot_cold_options")
  description     String
  imageUrl        String?       @map("image_url")
  status          ContentStatus @default(ACTIVE)
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  category Category @relation(fields: [categoryId], references: [id])

  @@map("menus")
}

enum MarketingTag {
  NEW
  BEST
  EVENT
}

enum Temperature {
  HOT
  COLD
}

// 신메뉴
model NewMenu {
  id        String           @id @default(cuid())
  title     String
  startDate DateTime         @map("start_date")
  endDate   DateTime         @map("end_date")
  imageUrl  String           @map("image_url")
  status    NewMenuStatus    @default(WAITING)
  createdAt DateTime         @default(now()) @map("created_at")
  updatedAt DateTime         @updatedAt @map("updated_at")

  @@map("new_menus")
}

enum NewMenuStatus {
  WAITING
  ACTIVE
  EXPIRED
}

// 매장
model Store {
  id              String          @id @default(cuid())
  name            String
  region          StoreRegion
  address         String
  additionalAddress String?       @map("additional_address")
  phone           String
  operatingStatus OperatingStatus @map("operating_status")
  storeType       StoreType       @map("store_type")
  options         StoreOption[]
  images          String[]
  createdAt       DateTime        @default(now()) @map("created_at")
  updatedAt       DateTime        @updatedAt @map("updated_at")

  eventStores EventStore[]

  @@map("stores")
}

enum StoreRegion {
  SEOUL
  GYEONGGI
  GANGWON
  CHUNGBUK
  CHUNGNAM
  JEONBUK
  JEONNAM
  GYEONGBUK
  GYEONGNAM
}

enum OperatingStatus {
  OPERATING
  CLOSED
  CONSULTING
}

enum StoreType {
  DIRECTLY_MANAGED
  FRANCHISE
}

enum StoreOption {
  DELIVERY
  PARKING
  MOBILE_ORDER
}

// 이벤트
model Event {
  id              String        @id @default(cuid())
  title           String
  startDate       DateTime      @map("start_date")
  endDate         DateTime      @map("end_date")
  content         String
  imageUrl        String        @map("image_url")
  homepagePreview Boolean       @default(false) @map("homepage_preview")
  status          EventStatus   @default(WAITING)
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  eventStores EventStore[]

  @@map("events")
}

enum EventStatus {
  WAITING
  ACTIVE
  EXPIRED
}

// 이벤트-매장 중간 테이블
model EventStore {
  id       String @id @default(cuid())
  eventId  String @map("event_id")
  storeId  String @map("store_id")
  isAllStores Boolean @default(false) @map("is_all_stores")

  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
  store Store @relation(fields: [storeId], references: [id], onDelete: Cascade)

  @@unique([eventId, storeId])
  @@map("event_stores")
}
```

## UI/UX 요구사항

### 1. 디자인 가이드라인

- **참고 사이트**: http://www.heemina.com/
- **브랜드 컬러**: 민트/터키색 계열 (#87CEEB 기반)
- **타이포그래피**: 깔끔하고 읽기 쉬운 폰트
- **레이아웃**: 반응형 디자인

### 2. 관리자 페이지 디자인

- **네비게이션**: 좌측 사이드바 메뉴
- **헤더**: 로그아웃, 비밀번호 변경 버튼
- **테이블**: 정렬, 검색, 페이징 기능
- **폼**: 유효성 검사 및 에러 메시지 표시

### 3. 컴포넌트 구조

```
app/
├── admin/
│   ├── layout.tsx (관리자 전용 레이아웃)
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── posts/
│   │   ├── franchise-inquiries/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── startup-sessions/
│   │   │   ├── page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── faqs/
│   │       ├── page.tsx
│   │       ├── create/page.tsx
│   │       └── [id]/page.tsx
│   ├── menus/
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── items/
│   │   │   ├── page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── new-menus/
│   │       ├── page.tsx
│   │       ├── create/page.tsx
│   │       └── [id]/page.tsx
│   ├── stores/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx
│   ├── events/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx
│   └── system/
│       └── admins/
│           ├── page.tsx
│           ├── create/page.tsx
│           └── [id]/page.tsx
├── (public)/
│   ├── page.tsx (홈페이지 메인)
│   ├── menus/
│   │   └── page.tsx
│   ├── stores/
│   │   └── page.tsx
│   └── events/
│       └── page.tsx
├── api/
│   ├── admin/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── franchise-inquiries/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── startup-sessions/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── faqs/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── categories/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── menus/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── new-menus/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── stores/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── events/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── admins/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   └── upload/
│       └── route.ts
└── components/
    ├── ui/ (Shadcn UI 컴포넌트)
    ├── admin/
    │   ├── layout/
    │   │   ├── AdminHeader.tsx
    │   │   ├── AdminSidebar.tsx
    │   │   └── AdminLayout.tsx
    │   ├── forms/
    │   │   ├── LoginForm.tsx
    │   │   ├── PasswordChangeForm.tsx
    │   │   ├── FranchiseInquiryForm.tsx
    │   │   ├── StartupSessionForm.tsx
    │   │   ├── FAQForm.tsx
    │   │   ├── CategoryForm.tsx
    │   │   ├── MenuForm.tsx
    │   │   ├── NewMenuForm.tsx
    │   │   ├── StoreForm.tsx
    │   │   ├── EventForm.tsx
    │   │   └── AdminForm.tsx
    │   ├── tables/
    │   │   ├── DataTable.tsx
    │   │   ├── Pagination.tsx
    │   │   └── SearchForm.tsx
    │   └── common/
    │       ├── FileUpload.tsx
    │       ├── ImagePreview.tsx
    │       ├── ConfirmDialog.tsx
    │       └── StatusBadge.tsx
    └── public/
        ├── layout/
        │   ├── Header.tsx
        │   ├── Footer.tsx
        │   └── Navigation.tsx
        └── common/
            ├── MenuCard.tsx
            ├── StoreCard.tsx
            └── EventCard.tsx
```

## 기능별 상세 요구사항

### 1. 인증 및 보안

- JWT 토큰 기반 인증
- 세션 타임아웃 관리
- 비밀번호 암호화 (bcrypt)
- CSRF 보호

### 2. 파일 업로드

- Supabase Storage 연동
- 이미지 리사이징
- 파일 타입 검증
- 업로드 진행률 표시

### 3. 이메일 발송

- 가맹문의 처리완료 알림
- Supabase Edge Functions 활용

### 4. 외부 API 연동

- 다음 우편번호 API
- 카카오 지도 API

## 성능 및 최적화 요구사항

### 1. 성능 최적화

- Next.js Image 컴포넌트 활용
- 코드 스플리팅
- 지연 로딩 (Lazy Loading)
- 캐싱 전략

### 2. SEO 최적화

- 메타 태그 관리
- 구조화된 데이터
- 사이트맵 생성

### 3. 반응형 디자인

- 모바일 우선 설계
- 태블릿/데스크톱 최적화
- 터치 친화적 인터페이스

## 배포 및 운영 요구사항

### 1. 배포 환경

- Vercel 배포
- 환경변수 관리
- CI/CD 파이프라인

### 2. 모니터링

- 에러 추적 (Sentry)
- 성능 모니터링
- 사용자 분석

### 3. 백업 및 복구

- 데이터베이스 백업
- 이미지 파일 백업
- 재해 복구 계획

## 개발 일정 (예상)

### Phase 1: 기본 구조 (2주)

- 프로젝트 셋업
- 인증 시스템
- 기본 레이아웃

### Phase 2: 핵심 기능 (4주)

- 게시물 관리
- 메뉴 관리
- 매장 관리

### Phase 3: 고급 기능 (2주)

- 이벤트 관리
- 파일 업로드
- 이메일 발송

### Phase 4: 최적화 및 배포 (1주)

- 성능 최적화
- 테스트
- 배포
