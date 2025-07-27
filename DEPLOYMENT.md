# 🚀 Render 배포 가이드

## 📋 사전 준비

### 1. MongoDB Atlas 설정

- MongoDB Atlas 계정 생성
- 클러스터 생성 (무료 티어 가능)
- 데이터베이스 사용자 생성
- IP 화이트리스트 설정 (0.0.0.0/0으로 모든 IP 허용)
- 연결 문자열 복사

### 2. GitHub 저장소 준비

- 코드를 GitHub에 푸시
- 저장소가 public이거나 Render에서 접근 가능해야 함

## 🔧 Render 배포 단계

### 1. Render 계정 생성

- [render.com](https://render.com)에서 계정 생성
- GitHub 계정으로 로그인

### 2. 새 Web Service 생성

1. **Dashboard** → **New** → **Web Service**
2. **Connect repository**에서 GitHub 저장소 선택
3. **Configure service** 설정:
   - **Name:** `seonoh-forum`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

### 3. 환경 변수 설정

**Environment Variables** 섹션에서 추가:

| Key              | Value                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------- |
| `NODE_ENV`       | `production`                                                                            |
| `DB_URL`         | `mongodb+srv://username:password@cluster.mongodb.net/forum?retryWrites=true&w=majority` |
| `SESSION_SECRET` | `your-secret-key-here`                                                                  |

### 4. 배포 실행

- **Create Web Service** 클릭
- 자동으로 빌드 및 배포 시작
- 배포 완료 후 제공되는 URL로 접속

## 🔍 배포 확인

### 1. 헬스 체크

```
https://your-app-name.onrender.com/ping
```

### 2. 메인 페이지

```
https://your-app-name.onrender.com
```

## 🛠️ 문제 해결

### 빌드 실패

- **로그 확인:** Render Dashboard → Logs
- **Node.js 버전:** package.json의 engines 확인
- **의존성 문제:** npm install 로그 확인

### 데이터베이스 연결 실패

- **DB_URL 확인:** MongoDB Atlas 연결 문자열 정확성
- **IP 화이트리스트:** 0.0.0.0/0으로 설정
- **사용자 권한:** 데이터베이스 사용자 권한 확인

### 세션 문제

- **SESSION_SECRET:** 충분히 긴 랜덤 문자열 사용
- **HTTPS:** Render는 자동으로 HTTPS 제공

## 📊 무료 티어 제한

- **월 사용량:** 750시간
- **자동 슬립:** 15분 비활성 시 슬립
- **첫 요청 시:** 약 30초 대기 시간
- **동시 요청:** 제한적

## 🔄 자동 배포

- **GitHub 푸시 시:** 자동 배포
- **브랜치:** main/master 브랜치 변경 시
- **롤백:** 이전 배포로 쉽게 되돌리기 가능

## 💰 비용

- **무료 티어:** 월 750시간
- **유료 플랜:** $7/월부터 (항상 온라인)
