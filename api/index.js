const express = require("express");
const path = require("path");
require("dotenv").config();

const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

const app = express();

console.log("🚀 포럼 서버 시작!");

// 📦 기본 미들웨어
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));

// 🧪 테스트 라우트
app.get("/ping", (req, res) => {
  res.json({ message: "서버가 정상적으로 작동합니다!", timestamp: new Date() });
});

app.get("/test", (req, res) => {
  res.json({
    message: "테스트 성공!",
    server: "Vercel Serverless",
    timestamp: new Date(),
  });
});

// MongoDB 연결 시도 (Vercel에서는 환경 변수로)
try {
  if (process.env.DB_URL) {
    const { connectDB, setDB } = require("../db/database");

    connectDB
      .then((client) => {
        console.log("✅ DB 연결 성공!");
        setDB(client.db("forum"));

        // 세션 설정
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
              maxAge: 24 * 60 * 60 * 1000,
            },
          })
        );

        // 패스포트 설정
        app.use(passport.initialize());
        app.use(passport.session());
        require("../config/passport")();

        // user 전역으로 전달
        app.use((req, res, next) => {
          res.locals.user = req.user;
          next();
        });

        // 라우터 등록
        app.use("/", require("../routes/index"));
        app.use("/auth", require("../routes/auth"));
        app.use("/post", require("../routes/post"));
        app.use("/new", require("../routes/post"));
        app.use("/list", require("../routes/post"));
        app.use("/users", require("../routes/user"));
        app.use("/search", require("../routes/search"));

        console.log("✅ 전체 서버 설정 완료!");
      })
      .catch((err) => {
        console.error("❌ DB 연결 실패:", err);
        setupBasicRoutes();
      });
  } else {
    console.log("⚠️ MongoDB 환경 변수 없음 - 기본 라우트만 설정");
    setupBasicRoutes();
  }
} catch (error) {
  console.error("❌ 모듈 로드 실패:", error);
  setupBasicRoutes();
}

// 기본 라우트 설정 (MongoDB 없을 때)
function setupBasicRoutes() {
  // 메인 페이지 (원래 디자인 유지)
  app.get("/", (req, res) => {
    try {
      res.render("posts/new", {
        posts: [],
        currentPage: 1,
        totalPages: 1,
        perPage: 5,
        totalPosts: 0,
      });
    } catch (error) {
      res.send(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <title>SEONOH 포럼</title>
          <link rel="stylesheet" href="/css/main.css">
        </head>
        <body>
          <nav>
            <div class="nav-container">
              <h1>SEONOH</h1>
              <div class="nav-links">
                <a href="/">게시판</a>
                <a href="/post/write">글쓰기</a>
                <a href="/auth/login">로그인</a>
              </div>
            </div>
          </nav>
          <main>
            <div class="hero">
              <h1>디지털 매거진</h1>
              <p>트렌드와 라이프스타일을 담아내는 새로운 디지털 매거진</p>
            </div>
            <div class="container">
              <p>게시글이 없습니다. 첫 번째 글을 작성해보세요!</p>
              <a href="/post/write" class="write-btn">글쓰기</a>
            </div>
          </main>
        </body>
        </html>
      `);
    }
  });

  // 게시글 목록
  app.get("/post/list", (req, res) => {
    try {
      res.render("list/list", {
        posts: [],
        currentPage: 1,
        totalPages: 1,
        user: null,
      });
    } catch (error) {
      res.send("게시글 목록을 불러올 수 없습니다.");
    }
  });

  // 글쓰기 페이지
  app.get("/post/write", (req, res) => {
    try {
      res.render("posts/new-write");
    } catch (error) {
      res.send(`
        <h1>글쓰기</h1>
        <form method="POST" action="/post/add">
          <input type="text" name="title" placeholder="제목" required>
          <textarea name="content" placeholder="내용" required></textarea>
          <button type="submit">작성하기</button>
        </form>
      `);
    }
  });
}

// 404 처리
app.use((req, res) => {
  try {
    res.status(404).render("404", { path: req.path });
  } catch (error) {
    res.status(404).send("페이지를 찾을 수 없습니다: " + req.path);
  }
});

console.log("✅ 포럼 서버 설정 완료!");

// Vercel 서버리스 함수를 위한 핸들러
module.exports = app;
