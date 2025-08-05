const express = require("express");
const path = require("path");
require("dotenv").config();

const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const { connectDB, setDB } = require("./db/database");

const app = express();

// 📦 기본 미들웨어
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// 🧪 간단한 테스트 라우트 (DB 연결 전에 추가)
app.get("/ping", (req, res) => {
  res.json({ message: "서버가 작동합니다!", timestamp: new Date() });
});

app.get("/test", (req, res) => {
  res.json({
    message: "테스트 성공!",
    env: process.env.NODE_ENV,
    hasDB: !!process.env.DB_URL,
    timestamp: new Date(),
  });
});

// 📡 DB 연결 및 서버 시작 (더 빠른 시작)
(async () => {
  try {
    console.log("🚀 서버 시작 중...");
    
    // 💾 세션 설정 (DB 연결 전에 먼저 설정)
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "alstjsdh1",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: process.env.DB_URL,
          dbName: "forum",
          // 세션 스토어 최적화
          touchAfter: 24 * 3600, // 24시간마다 터치
          ttl: 24 * 60 * 60, // 24시간 TTL
        }),
        cookie: {
          secure: false, // Render에서 세션 문제 해결을 위해 false로 설정
          maxAge: 24 * 60 * 60 * 1000, // 24시간
          httpOnly: true,
          sameSite: "lax",
        },
      })
    );

    // 🔐 패스포트 설정
    app.use(passport.initialize());
    app.use(passport.session());
    require("./config/passport")();

    // 🌍 user 전역으로 전달
    app.use((req, res, next) => {
      res.locals.user = req.user;
      next();
    });

    // 🛣️ 라우터 등록
    app.use("/", require("./routes/index"));
    app.use("/auth", require("./routes/auth"));
    app.use("/post", require("./routes/post"));
    app.use("/new", require("./routes/new"));
    app.use("/list", require("./routes/post"));
    app.use("/users", require("./routes/user"));
    app.use("/search", require("./routes/search"));

    // 🚫 404 처리 (라우터들보다 항상 아래에 위치)
    app.use((req, res) => {
      res.status(404).render("404", { path: req.path });
    });

    console.log("✅ 기본 서버 설정 완료!");

    // DB 연결 시도 (비동기로 처리)
    const client = await connectDB();
    if (client) {
      console.log("✅ DB 연결 성공!");
      setDB(client.db("forum"));
    } else {
      console.log("⚠️ DB 연결 실패, 기본 모드로 실행");
    }

    console.log("✅ 전체 서버 설정 완료!");
  } catch (err) {
    console.error("❌ 서버 설정 중 오류:", err);
    console.log("⚠️ 기본 설정으로 서버를 실행합니다.");
  }
})();

// 🚀 서버 시작
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🌐 Server is running on http://localhost:${PORT}`);
});

// Vercel 서버리스 함수를 위한 핸들러
module.exports = app;
