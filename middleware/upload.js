const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

// 환경 변수 확인
const isProduction = process.env.NODE_ENV === "production";
const hasS3Credentials = process.env.S3_KEY && process.env.S3_SECRET;

let upload;

if (isProduction && hasS3Credentials) {
  // 프로덕션 환경에서 S3 사용
  const s3 = new S3Client({
    region: "ap-northeast-2",
    credentials: {
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET,
    },
  });

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "sunohforum",
      key: function (req, file, cb) {
        cb(null, Date.now().toString());
      },
    }),
  });
} else {
  // 로컬 개발 환경에서 로컬 저장소 사용
  upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/uploads/");
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      },
    }),
    fileFilter: function (req, file, cb) {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("이미지 파일만 업로드 가능합니다."), false);
      }
    },
  });
}

module.exports = { upload };
