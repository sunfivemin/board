const express = require("express");
const path = require("path");

// 환경 변수 로딩
require("dotenv").config();

// 환경 변수 확인
console.log("🔧 환경 변수 확인:");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- DB_URL:", process.env.DB_URL ? "설정됨" : "설정되지 않음");
console.log(
  "- SESSION_SECRET:",
  process.env.SESSION_SECRET ? "설정됨" : "설정되지 않음"
);

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

app.get("/", (req, res) => {
  res.send("메인 페이지 - 서버가 작동합니다!");
});

// 📡 DB 연결 및 서버 시작
connectDB
  .then((client) => {
    console.log("✅ DB 연결 성공!");
    setDB(client.db("forum"));

    // 💾 세션 설정
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "alstjsdh1",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: process.env.DB_URL,
          dbName: "forum",
        }),
        cookie: {
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000, // 24시간
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
    app.use("/new", require("./routes/post"));
    app.use("/list", require("./routes/post"));
    app.use("/users", require("./routes/user"));
    app.use("/search", require("./routes/search"));

    // 🚫 404 처리 (라우터들보다 항상 아래에 위치)
    app.use((req, res) => {
      res.status(404).render("404", { path: req.path });
    });

    console.log("✅ 서버 설정 완료!");
  })
  .catch((err) => {
    console.error("❌ 서버 실행 실패:", err);
  });

// Vercel 서버리스 함수를 위한 핸들러
module.exports = app;
