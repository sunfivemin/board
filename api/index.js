const express = require("express");

const app = express();

console.log("🚀 서버 시작!");

// 📦 기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🧪 기본 라우트
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>포럼 서버</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        .status { background: #f0f8ff; padding: 20px; border-radius: 8px; }
        .link { color: #0066cc; text-decoration: none; }
        .link:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>🎉 포럼 서버가 성공적으로 배포되었습니다!</h1>
      <div class="status">
        <p><strong>상태:</strong> 정상 작동 중</p>
        <p><strong>시간:</strong> ${new Date().toLocaleString("ko-KR")}</p>
        <p><strong>환경:</strong> ${process.env.NODE_ENV || "development"}</p>
      </div>
      <h2>테스트 링크:</h2>
      <ul>
        <li><a href="/ping" class="link">/ping - JSON 응답 테스트</a></li>
        <li><a href="/test" class="link">/test - 서버 정보</a></li>
        <li><a href="/health" class="link">/health - 상태 확인</a></li>
      </ul>
    </body>
    </html>
  `);
});

app.get("/ping", (req, res) => {
  res.json({
    message: "서버가 정상적으로 작동합니다!",
    timestamp: new Date(),
    status: "success",
  });
});

app.get("/test", (req, res) => {
  res.json({
    message: "테스트 성공!",
    server: "Vercel Serverless",
    node_version: process.version,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date(),
    memory: process.memoryUsage(),
    version: "1.0.0",
  });
});

// 🚫 404 처리
app.use((req, res) => {
  res.status(404).json({
    error: "페이지를 찾을 수 없습니다",
    path: req.path,
    timestamp: new Date(),
  });
});

console.log("✅ 서버 설정 완료!");

// Vercel 서버리스 함수를 위한 핸들러
module.exports = app;
