# ⚡ 개발 노트 (Dev Note)

> 매일매일 새롭게 배운 기술과 면접 노하우를 기록하는 개인 학습 사이트

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=flat-square&logo=ejs&logoColor=black)
![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=flat-square&logo=amazonaws&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://board-fs9x.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/sunfivemin/board)

---

## 📖 프로젝트 소개

신입 개발자로서 매일 새롭게 배우는 기술과 면접 준비 과정을 체계적으로 기록하고 관리하기 위해 개발한 개인 학습 관리 시스템입니다.

### 🎯 개발 목적

- **학습 내용 체계적 정리**: 새로 배운 기술을 카테고리별로 분류하여 정리
- **면접 준비 도구**: 기술 면접 질문과 답변을 모아서 효율적인 면접 대비
- **성장 과정 기록**: 개발자로서의 성장 과정을 시각적으로 추적
- **포트폴리오 겸용**: 학습한 내용을 정리하면서 동시에 포트폴리오 역할

### ✨ 핵심 가치

```
"어제보다 나은 개발자가 되자"
```

---

## 🛠️ 기술 스택

### Backend

- **Node.js** - JavaScript 런타임 환경
- **Express.js** - 웹 애플리케이션 프레임워크
- **MongoDB** - NoSQL 데이터베이스
- **Mongoose** - MongoDB ODM
- **Passport.js** - 사용자 인증 미들웨어

### Frontend

- **EJS** - 서버 사이드 템플릿 엔진
- **HTML5/CSS3** - 마크업 및 스타일링
- **JavaScript (ES6+)** - 클라이언트 사이드 로직

### DevOps & Tools

- **Render** - 클라우드 배포 플랫폼
- **MongoDB Atlas** - 클라우드 데이터베이스
- **AWS S3** - 이미지 저장소
- **Git/GitHub** - 버전 관리
- **dotenv** - 환경 변수 관리

---

## 🚀 주요 기능

### 📝 게시글 관리

- **CRUD 기능**: 게시글 생성, 조회, 수정, 삭제
- **카테고리 분류**: 기술스택, 면접준비, 학습일지로 체계적 분류
- **이미지 업로드**: AWS S3를 통한 안정적인 이미지 저장
- **검색 기능**: 제목, 내용, 카테고리 기반 통합 검색

### 🎨 사용자 인터페이스

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **모던 UI/UX**: Glassmorphism 디자인과 부드러운 애니메이션
- **카드형 레이아웃**: 직관적이고 아름다운 카드 디자인
- **스티키 푸터**: 콘텐츠 양에 관계없이 하단 고정

### 🔐 사용자 인증

- **회원가입/로그인**: Passport.js 기반 인증 시스템
- **세션 관리**: 안전한 세션 기반 로그인 유지
- **권한 관리**: 본인 글만 수정/삭제 가능

### 📊 학습 추적

- **학습 통계**: 작성한 글 수, 카테고리별 분포
- **실시간 카운터**: 메인 페이지에서 학습 기록 수 표시
- **카테고리별 분류**: 체계적인 학습 내용 관리

---

## 📁 프로젝트 구조

```
📦 forum/
├── 📂 config/          # 설정 파일
│   └── passport.js     # Passport.js 인증 설정
├── 📂 db/              # 데이터베이스
│   └── database.js     # MongoDB 연결 설정
├── 📂 middleware/      # 미들웨어
│   ├── auth.js         # 인증 미들웨어
│   └── upload.js       # 파일 업로드 설정 (S3/로컬)
├── 📂 routes/          # Express 라우팅
│   ├── auth.js         # 인증 관련 라우트
│   ├── index.js        # 메인 페이지 라우트
│   ├── new.js          # 게시판 라우트
│   ├── post.js         # 메인 게시판 라우트
│   ├── search.js       # 검색 라우트
│   └── user.js         # 사용자 관련 라우트
├── 📂 views/           # EJS 템플릿
│   ├── list/           # 메인 페이지 템플릿
│   │   └── list.ejs    # 히어로 섹션 포함 메인
│   ├── posts/          # 게시글 관련 템플릿
│   │   ├── detail.ejs  # 게시글 상세
│   │   ├── edit.ejs    # 게시글 수정
│   │   ├── new-write.ejs # 글 작성
│   │   └── new.ejs     # 게시판 목록
│   ├── auth/           # 인증 관련 템플릿
│   │   ├── login.ejs   # 로그인
│   │   └── signup.ejs  # 회원가입
│   ├── partials/       # 공통 템플릿
│   │   ├── head.ejs    # HTML head
│   │   ├── nav.ejs     # 네비게이션
│   │   └── modal.ejs   # 모달 컴포넌트
│   ├── search.ejs      # 검색 결과
│   ├── time.ejs        # 시간 관련 페이지
│   └── 404.ejs         # 404 에러 페이지
├── 📂 public/          # 정적 파일
│   ├── css/           # 스타일시트
│   │   ├── main.css   # 메인 스타일
│   │   ├── modal.css  # 모달 스타일
│   │   └── timer.css  # 타이머 스타일
│   ├── js/            # 클라이언트 JavaScript
│   │   ├── modal.js   # 모달 기능
│   │   ├── nav.js     # 네비게이션 기능
│   │   ├── search.js  # 검색 기능
│   │   └── timer.js   # 타이머 기능
│   ├── images/        # 이미지 파일
│   │   ├── favicon.ico # 파비콘
│   │   ├── site.webmanifest # PWA 매니페스트
│   │   └── ...        # 기타 이미지들
│   └── uploads/       # 로컬 업로드 파일 (개발용)
├── 📄 server.js       # 메인 서버 파일
├── 📄 package.json    # 의존성 관리
├── 📄 render.yaml     # Render 배포 설정
└── 📄 vercel.json     # Vercel 배포 설정
```

---

## 🖥️ 스크린샷

### 메인 페이지

![메인 페이지](https://via.placeholder.com/800x400/2563eb/ffffff?text=SEONOH+개발+노트)
_깔끔한 히어로 섹션과 카드형 레이아웃으로 최신 학습 기록을 한눈에 확인_

### 게시판 페이지

![게시판](https://via.placeholder.com/800x400/3b82f6/ffffff?text=학습+기록+게시판)
_카테고리별 분류와 검색 기능을 통한 효율적인 학습 내용 관리_

### 글 작성 페이지

![글 작성](https://via.placeholder.com/800x400/1d4ed8/ffffff?text=학습+기록+작성)
_이미지 업로드와 카테고리 선택으로 편리한 학습 기록 작성_

---

## ⚙️ 설치 및 실행

### 사전 요구사항

- Node.js (v14 이상)
- MongoDB (로컬 또는 MongoDB Atlas)
- Git

### 1. 저장소 클론

```bash
git clone https://github.com/sunfivemin/board.git
cd board
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

```bash
# .env 파일 생성
touch .env

# 환경 변수 편집
DB_URL=mongodb://localhost:27017/forum
# 또는 MongoDB Atlas 연결 문자열
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/forum

SESSION_SECRET=your-session-secret
NODE_ENV=development

# AWS S3 설정 (선택사항)
S3_KEY=your-s3-access-key
S3_SECRET=your-s3-secret-key
```

### 4. 데이터베이스 초기 설정

```bash
# MongoDB 로컬 서버 실행 (로컬 MongoDB 사용 시)
mongod

# 또는 MongoDB Atlas 사용 시 별도 설정 불필요
```

### 5. 애플리케이션 실행

```bash
# 개발 모드
npm run dev

# 또는 직접 실행
node server.js
```

### 6. 브라우저에서 확인

```
http://localhost:8080
```

---

## 🔧 주요 API 엔드포인트

### 인증 API

```javascript
// 회원가입
POST /auth/signup
{
  "username": "사용자명",
  "password": "비밀번호"
}

// 로그인
POST /auth/login
{
  "username": "사용자명",
  "password": "비밀번호"
}

// 로그아웃
GET /auth/logout
```

### 게시글 API

```javascript
// 메인 페이지 (히어로 섹션)
GET /

// 게시판 목록
GET /new

// 게시글 상세
GET /new/:id

// 글 작성 페이지
GET /new/write

// 글 작성
POST /new/add
{
  "title": "제목",
  "content": "내용",
  "category": "기술스택|면접준비|학습일지",
  "image": "파일"
}

// 글 수정
POST /new/edit/:id

// 글 삭제
DELETE /new/:id
```

### 검색 API

```javascript
// 통합 검색
GET /search?keyword=검색어
```

---

## 🎯 주요 학습 포인트

### 1. 풀스택 개발 경험

- **Backend**: Node.js + Express로 RESTful API 설계 및 구현
- **Database**: MongoDB를 활용한 NoSQL 데이터 모델링
- **Frontend**: EJS 템플릿 엔진으로 서버 사이드 렌더링 구현

### 2. 사용자 인증 시스템

```javascript
// Passport.js를 활용한 로컬 인증 전략
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
```

### 3. 파일 업로드 시스템

```javascript
// AWS S3와 로컬 스토리지 조건부 사용
const storage =
  isProduction && hasS3Credentials
    ? multerS3({
        s3: s3Client,
        bucket: "seonohforum",
        acl: "public-read",
        key: (req, file, cb) => {
          cb(
            null,
            Date.now() +
              "-" +
              Math.round(Math.random() * 1e9) +
              path.extname(file.originalname)
          );
        },
      })
    : multer.diskStorage({
        destination: "./public/uploads/",
        filename: (req, file, cb) => {
          cb(
            null,
            Date.now() +
              "-" +
              Math.round(Math.random() * 1e9) +
              path.extname(file.originalname)
          );
        },
      });
```

### 4. 반응형 디자인

```css
/* Glassmorphism 효과와 모던한 UI */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
  border-radius: 0 0 30px 30px;
  overflow: hidden;
}

.featured-card {
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}
```

---

## 🐛 트러블슈팅

### 1. MongoDB 연결 이슈

**문제**: MongoDB Atlas 연결 시 네트워크 타임아웃 발생

```javascript
// 해결책: 연결 옵션 최적화
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});
```

### 2. AWS S3 이미지 업로드 이슈

**문제**: `AccessControlListNotSupported` 에러

```javascript
// 해결책: S3 버킷 설정에서 ACL 활성화
// AWS S3 콘솔 → 버킷 → 권한 → 객체 소유권 → ACL 활성화
```

### 3. Render 배포 시 세션 이슈

**문제**: 로컬에서는 정상 작동하지만 배포 후 로그인 실패

```javascript
// 해결책: 세션 설정 최적화
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Render에서는 false로 설정
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
```

### 4. 라우팅 충돌 이슈

**문제**: `/new`와 `/post` 라우트 간 충돌

```javascript
// 해결책: 라우트 순서와 전용 라우터 파일 분리
app.use("/new", require("./routes/new")); // 더 구체적인 라우트를 먼저
app.use("/post", require("./routes/post"));
```

---

## 📈 향후 개선 계획

### 🎯 단기 계획 (1-2주)

- [ ] **마크다운 에디터**: 글 작성 시 마크다운 지원 및 실시간 미리보기
- [ ] **댓글 시스템**: 게시글별 댓글 기능 추가
- [ ] **좋아요/북마크**: 유용한 글 저장 기능
- [ ] **태그 시스템**: 다중 태그를 통한 세분화된 분류

### 🚀 중기 계획 (1-2개월)

- [ ] **사용자 프로필**: 개인 프로필 페이지 및 설정
- [ ] **소셜 로그인**: GitHub, Google OAuth 연동
- [ ] **알림 시스템**: 새 댓글, 좋아요 알림
- [ ] **RSS 피드**: 블로그 구독 기능

### 🔥 장기 계획 (3개월+)

- [ ] **모바일 앱**: React Native를 활용한 모바일 버전
- [ ] **AI 추천**: 머신러닝 기반 개인 맞춤 학습 콘텐츠 추천
- [ ] **스터디 그룹**: 함께 공부할 수 있는 커뮤니티 기능
- [ ] **포트폴리오 연동**: 학습 내용을 자동으로 포트폴리오로 변환

---

## 🤝 기여하기

이 프로젝트는 개인 학습용이지만, 피드백과 제안은 언제나 환영합니다!

### 기여 방법

1. 이 저장소를 Fork 합니다
2. 새 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

### 개선 제안

- 💡 새로운 기능 아이디어
- 🐛 버그 리포트
- 📝 문서 개선
- 🎨 UI/UX 개선 제안

---

## 📞 연락처

**SEONOH** - 신입 개발자

- 📧 Email: [sunfivemin@gmail.com](mailto:sunfivemin@gmail.com)
- 🐱 GitHub: [@sunfivemin](https://github.com/sunfivemin)
- 🌐 Live Demo: [board-fs9x.onrender.com](https://board-fs9x.onrender.com)

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 🙏 감사 인사

- **Node.js 커뮤니티**: 풍부한 생태계와 문서 제공
- **MongoDB**: 유연한 NoSQL 데이터베이스 솔루션
- **Render**: 간편한 배포 플랫폼 제공
- **AWS**: 안정적인 클라우드 서비스 제공
- **오픈소스 기여자들**: 사용된 모든 라이브러리의 개발자들

---

<div align="center">

**⚡ 매일 성장하는 개발자 되기 ⚡**

`console.log('Thanks for visiting my project! 🎯');`

[![GitHub stars](https://img.shields.io/github/stars/sunfivemin/board?style=social)](https://github.com/sunfivemin/board/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sunfivemin/board?style=social)](https://github.com/sunfivemin/board/network)

</div>
