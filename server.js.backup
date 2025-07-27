const express = require("express");
const path = require("path");

// 환경 변수 로딩
require("dotenv").config();

console.log("🔧 서버 시작...");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- DB_URL:", process.env.DB_URL ? "설정됨" : "설정되지 않음");

const app = express();

// 📦 기본 미들웨어
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// 🧪 기본 테스트 라우트
app.get("/ping", (req, res) => {
  res.json({ message: "서버가 작동합니다!", timestamp: new Date() });
});

app.get("/", (req, res) => {
  res.send(`
    <h1>포럼 서버가 작동합니다! 🎉</h1>
    <p>현재 시간: ${new Date().toLocaleString("ko-KR")}</p>
    <p>환경: ${process.env.NODE_ENV || "development"}</p>
    <p>MongoDB 연결: ${process.env.DB_URL ? "설정됨" : "설정되지 않음"}</p>
    <hr>
    <h2>테스트 링크:</h2>
    <ul>
      <li><a href="/ping">/ping - JSON 응답</a></li>
      <li><a href="/test">/test - 환경 변수 확인</a></li>
    </ul>
  `);
});

app.get("/test", (req, res) => {
  res.json({
    message: "테스트 성공!",
    env: process.env.NODE_ENV,
    hasDB: !!process.env.DB_URL,
    timestamp: new Date(),
  });
});

// 🚫 404 처리
app.use((req, res) => {
  res.status(404).send("페이지를 찾을 수 없습니다: " + req.path);
});

console.log("✅ 기본 서버 설정 완료!");

// MongoDB 연결은 나중에 수동으로 활성화
console.log("⚠️ MongoDB 연결은 비활성화되어 있습니다.");

// Vercel 서버리스 함수를 위한 핸들러
module.exports = app;
