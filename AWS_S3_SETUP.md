# AWS S3 설정 가이드 (영구 해결책)

## 1. AWS S3 버킷 생성

### 1.1 AWS 콘솔 접속

1. [AWS 콘솔](https://aws.amazon.com/ko/)에 로그인
2. S3 서비스로 이동

### 1.2 버킷 생성

1. **"버킷 만들기"** 클릭
2. **버킷 이름**: `sunohforum` (또는 원하는 이름)
3. **리전**: `아시아 태평양 (서울) ap-northeast-2`
4. **퍼블릭 액세스 차단**: **해제** (이미지 공개 접근 필요)
5. **버킷 만들기** 클릭

### 1.3 버킷 정책 설정

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sunohforum/*"
    }
  ]
}
```

## 2. IAM 사용자 생성

### 2.1 IAM 서비스로 이동

1. AWS 콘솔에서 IAM 서비스 선택
2. **"사용자"** → **"사용자 생성"**

### 2.2 사용자 정보 입력

1. **사용자 이름**: `forum-upload-user`
2. **액세스 키**: **프로그래밍 방식 액세스** 선택
3. **다음** 클릭

### 2.3 권한 설정

1. **"기존 정책 직접 연결"** 선택
2. **`AmazonS3FullAccess`** 검색 후 선택
3. **다음** → **사용자 생성**

### 2.4 액세스 키 저장

- **액세스 키 ID** 복사
- **비밀 액세스 키** 복사 (한 번만 표시됨!)

## 3. Render 환경 변수 설정

### 3.1 Render 대시보드 접속

1. [Render.com](https://render.com) 로그인
2. 해당 서비스 선택

### 3.2 환경 변수 추가

**Environment** → **Environment Variables**에서 추가:

| Key         | Value                    |
| ----------- | ------------------------ |
| `NODE_ENV`  | `production`             |
| `S3_KEY`    | `your_access_key_id`     |
| `S3_SECRET` | `your_secret_access_key` |

## 4. 코드 수정 (S3 재활성화)

### 4.1 upload.js 수정

```javascript
// 임시 해제를 위해 false를 true로 변경
if (isProduction && hasS3Credentials) {
```

### 4.2 서버 재시작

```bash
git add .
git commit -m "feat: AWS S3 재활성화"
git push origin main
```

## 5. 테스트

### 5.1 이미지 업로드 테스트

1. 배포사이트에서 게시글 작성
2. 이미지 업로드
3. AWS S3 버킷에서 이미지 확인

### 5.2 이미지 URL 확인

- 업로드된 이미지 URL이 S3 URL 형식인지 확인
- 예: `https://sunohforum.s3.ap-northeast-2.amazonaws.com/1753600781746-653840266.png`

## 6. 비용 예상

### 6.1 S3 Standard 스토리지

- **첫 5GB**: 무료
- **추가**: $0.023/GB/월

### 6.2 데이터 전송

- **첫 1GB**: 무료
- **추가**: $0.09/GB

### 6.3 요청

- **월 20,000개**: 무료
- **추가**: $0.0004/1,000개

**예상 월 비용**: 소규모 사용 시 거의 무료
