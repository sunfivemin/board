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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// 🏠 메인 페이지 (원래 디자인)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SEONOH 포럼</title>
      <link rel="stylesheet" href="/css/main.css">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .nav-container { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .nav-container h1 { font-size: 1.8rem; font-weight: bold; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a { color: white; text-decoration: none; font-weight: 500; }
        .nav-links a:hover { text-decoration: underline; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 2rem; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; opacity: 0.9; }
        .container { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
        .posts-container { display: grid; gap: 1.5rem; margin-bottom: 3rem; }
        .post-item { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-left: 4px solid #667eea; transition: transform 0.2s; cursor: pointer; }
        .post-item:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .post-category { background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; margin-bottom: 1rem; display: inline-block; }
        .post-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #333; }
        .post-content { color: #666; margin-bottom: 1rem; line-height: 1.6; }
        .post-meta { color: #888; font-size: 0.9rem; }
        .write-btn { position: fixed; bottom: 2rem; right: 2rem; background: #667eea; color: white; padding: 1rem 1.5rem; border-radius: 50px; text-decoration: none; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); transition: all 0.3s; }
        .write-btn:hover { background: #5a6fd8; transform: scale(1.05); }
        .empty-state { text-align: center; padding: 3rem; color: #666; }
        .footer { background: #f8f9fa; padding: 2rem; text-align: center; color: #666; margin-top: 3rem; }
      </style>
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
      
      <div class="hero">
        <h1>디지털 매거진</h1>
        <p>트렌드와 라이프스타일을 담아내는 새로운 디지털 매거진</p>
      </div>
      
      <div class="container">
        <div class="posts-container">
          <div class="post-item" onclick="location.href='/post/1'">
            <span class="post-category">공지</span>
            <h2 class="post-title">포럼에 오신 것을 환영합니다!</h2>
            <p class="post-content">이것은 첫 번째 게시글입니다. 포럼이 정상적으로 작동하고 있습니다.</p>
            <div class="post-meta">작성자: 관리자 | 2025. 1. 26.</div>
          </div>
          
          <div class="post-item" onclick="location.href='/post/2'">
            <span class="post-category">일반</span>
            <h2 class="post-title">게시글 작성 테스트</h2>
            <p class="post-content">포럼이 정상적으로 작동하고 있습니다. 다양한 주제로 자유롭게 글을 작성해보세요.</p>
            <div class="post-meta">작성자: 사용자1 | 2025. 1. 25.</div>
          </div>
        </div>
      </div>
      
      <a href="/post/write" class="write-btn">✏️ 글쓰기</a>
      
      <footer class="footer">
        <p>&copy; 2025 SEONOH 포럼. All rights reserved.</p>
      </footer>
    </body>
    </html>
  `);
});

// 📝 글쓰기 페이지
app.get("/post/write", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>글쓰기 - SEONOH 포럼</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .header { text-align: center; margin-bottom: 2rem; }
        .header h1 { color: #333; margin-bottom: 0.5rem; }
        .header p { color: #666; }
        .form-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
        .form-group textarea { height: 200px; resize: vertical; }
        .btn-group { display: flex; gap: 1rem; justify-content: center; }
        .btn { padding: 0.75rem 2rem; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; text-decoration: none; display: inline-block; text-align: center; }
        .btn-primary { background: #667eea; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
        .btn:hover { opacity: 0.9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>새 글 작성</h1>
          <p>포럼에 새로운 글을 작성해보세요</p>
        </div>
        
        <div class="form-container">
          <form method="POST" action="/post/add">
            <div class="form-group">
              <label for="category">카테고리</label>
              <select id="category" name="category" required>
                <option value="일반">일반</option>
                <option value="공지">공지</option>
                <option value="질문">질문</option>
                <option value="자유">자유</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="title">제목</label>
              <input type="text" id="title" name="title" required placeholder="제목을 입력하세요">
            </div>
            
            <div class="form-group">
              <label for="content">내용</label>
              <textarea id="content" name="content" required placeholder="내용을 입력하세요"></textarea>
            </div>
            
            <div class="btn-group">
              <button type="submit" class="btn btn-primary">작성하기</button>
              <a href="/" class="btn btn-secondary">취소</a>
            </div>
          </form>
        </div>
      </div>
    </body>
    </html>
  `);
});

// 📄 게시글 상세 페이지
app.get("/post/:id", (req, res) => {
  const postId = req.params.id;

  const posts = {
    1: {
      title: "포럼에 오신 것을 환영합니다!",
      content:
        "이것은 첫 번째 게시글입니다.\n\n포럼이 정상적으로 작동하고 있습니다. 자유롭게 글을 작성하고 소통해보세요!",
      category: "공지",
      createdAt: "2025. 1. 26.",
      authorName: "관리자",
    },
    2: {
      title: "게시글 작성 테스트",
      content:
        "포럼이 정상적으로 작동하고 있습니다.\n\n다양한 주제로 자유롭게 글을 작성해보세요.",
      category: "일반",
      createdAt: "2025. 1. 25.",
      authorName: "사용자1",
    },
  };

  const post = posts[postId];

  if (!post) {
    return res.status(404).send("게시글을 찾을 수 없습니다.");
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${post.title} - SEONOH 포럼</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8f9fa; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .back-btn { display: inline-block; margin-bottom: 2rem; color: #667eea; text-decoration: none; }
        .back-btn:hover { text-decoration: underline; }
        .post-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .post-header { border-bottom: 1px solid #eee; padding-bottom: 1rem; margin-bottom: 2rem; }
        .post-category { background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; }
        .post-title { font-size: 2rem; margin: 1rem 0; color: #333; }
        .post-meta { color: #666; }
        .post-content { font-size: 1.1rem; line-height: 1.8; white-space: pre-line; }
      </style>
    </head>
    <body>
      <div class="container">
        <a href="/" class="back-btn">← 목록으로 돌아가기</a>
        
        <div class="post-container">
          <div class="post-header">
            <span class="post-category">${post.category}</span>
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta">
              작성자: ${post.authorName} | 작성일: ${post.createdAt}
            </div>
          </div>
          
          <div class="post-content">
            ${post.content}
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// 404 처리
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>404 - 페이지를 찾을 수 없습니다</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 3rem; background: #f8f9fa; }
        h1 { color: #667eea; margin-bottom: 1rem; }
        p { color: #666; margin-bottom: 2rem; }
        a { color: #667eea; text-decoration: none; padding: 0.75rem 2rem; background: white; border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>요청하신 페이지 "${req.path}"를 찾을 수 없습니다. 😔</p>
      <a href="/">홈으로 돌아가기</a>
    </body>
    </html>
  `);
});

console.log("✅ 포럼 서버 설정 완료!");

module.exports = app;
