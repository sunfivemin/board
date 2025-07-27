# Render 배포 가이드

## 1. 기본 설정

### 환경 변수 설정

Render 대시보드 → Environment Variables에서 다음을 설정:

```
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database
SESSION_SECRET=your_session_secret_key
```

## 2. AWS S3 설정 (이미지 업로드용)

### AWS S3 버킷 생성

1. AWS S3 콘솔에서 새 버킷 생성
2. 버킷 이름: `sunohforum` (또는 원하는 이름)
3. 리전: `ap-northeast-2` (서울)

### IAM 사용자 생성

1. AWS IAM 콘솔에서 새 사용자 생성
2. 권한: `AmazonS3FullAccess` 또는 커스텀 정책
3. Access Key ID와 Secret Access Key 생성

### 환경 변수 추가

Render 대시보드에서 추가 환경 변수 설정:

```
S3_KEY=your_aws_access_key_id
S3_SECRET=your_aws_secret_access_key
NODE_ENV=production
```

## 3. 배포 후 확인

### 이미지 업로드 테스트

1. 게시글 작성 시 이미지 업로드
2. 게시글 수정 시 이미지 변경
3. AWS S3 버킷에서 업로드된 이미지 확인

### 로그 확인

Render 대시보드 → Logs에서 오류 메시지 확인

## 4. 문제 해결

### S3 인증 오류

- 환경 변수 `S3_KEY`, `S3_SECRET` 확인
- IAM 사용자 권한 확인
- 버킷 이름과 리전 확인

### 이미지 업로드 실패

- `NODE_ENV=production` 설정 확인
- S3 버킷 접근 권한 확인
