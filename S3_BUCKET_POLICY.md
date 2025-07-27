# S3 버킷 정책 설정 가이드

## 문제 해결: AccessDenied 에러

### 1. S3 버킷 정책 설정

#### 1.1 AWS S3 콘솔 접속

1. [AWS S3 콘솔](https://s3.console.aws.amazon.com/) 접속
2. **`seonohforum`** 버킷 선택

#### 1.2 권한 탭으로 이동

1. **"권한"** 탭 클릭
2. **"버킷 정책"** 섹션 확인

#### 1.3 버킷 정책 추가

**"버킷 정책 편집"** 클릭 후 다음 정책 입력:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::seonohforum/*"
    },
    {
      "Sid": "AllowIAMUserUpload",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::522448739678:user/forum-upload-user"
      },
      "Action": ["s3:PutObject", "s3:PutObjectAcl", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::seonohforum/*"
    }
  ]
}
```

#### 1.4 정책 저장

1. **"변경사항 저장"** 클릭
2. **경고 메시지** 확인 후 **"확인"** 클릭

### 2. 퍼블릭 액세스 설정 확인

#### 2.1 퍼블릭 액세스 차단 설정

1. **"퍼블릭 액세스 차단(계정 설정)"** 섹션 확인
2. **모든 체크박스가 해제**되어 있는지 확인
3. 해제되어 있지 않으면 **"편집"** 클릭하여 해제

### 3. 테스트

#### 3.1 배포사이트에서 테스트

1. **게시글 작성** → 이미지 업로드
2. **게시글 수정** → 이미지 변경
3. **AWS S3 버킷**에서 업로드된 이미지 확인

### 4. 문제 해결

#### 4.1 여전히 AccessDenied 발생 시

1. **IAM 사용자 권한** 재확인
2. **액세스 키** 재생성
3. **Render 환경 변수** 재설정

#### 4.2 로그 확인

Render 대시보드 → Logs에서 오류 메시지 확인
