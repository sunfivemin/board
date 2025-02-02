const express = require("express");
const path = require("path");
require("dotenv").config();

const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const { connectDB, setDB } = require("./db/database");

const app = express();

// 기본 미들웨어 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// DB 연결 및 서버 시작
connectDB
  .then((client) => {
    console.log("DB연결성공");
    setDB(client.db("forum"));

    // Session 설정
    app.use(
      session({
        secret: "alstjsdh1",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: process.env.DB_URL,
          dbName: "forum",
        }),
      })
    );

    // Passport 설정
    app.use(passport.initialize());
    app.use(passport.session());

    // Passport 설정 불러오기
    require("./config/passport")();

    // 전역 미들웨어
    app.use((req, res, next) => {
      res.locals.user = req.user;
      next();
    });

    // 라우터 설정
    app.use("/", require("./routes/index")); // 메인 페이지
    app.use("/auth", require("./routes/auth")); // 로그인/회원가입
    app.use("/post", require("./routes/post")); // 게시글 관련
    app.use("/new", require("./routes/post")); // 기존 /new 경로도 post 라우터 사용
    app.use("/users", require("./routes/user")); // 사용자 관련
    app.use("/list", require("./routes/post")); // list도 post 라우터 사용

    // 404 에러 처리
    app.use((req, res) => {
      res.status(404).render("404", { path: req.path });
    });

    // 서버 시작
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("서버 실행 실패:", err);
    process.exit(1);
  });

module.exports = app;
