const express = require("express");
const path = require("path");

const app = express();

console.log("🚀 포럼 서버 시작!");

// 📦 기본 미들웨어
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// 🏠 메인 페이지 (게시글 목록)
app.get("/", (req, res) => {
  // 임시 게시글 데이터
  const posts = [
    {
      _id: "1",
      title: "포럼에 오신 것을 환영합니다!",
      content: "이것은 첫 번째 게시글입니다.",
      category: "공지",
      createdAt: new Date("2025-01-26"),
      authorName: "관리자",
    },
    {
      _id: "2",
      title: "게시글 작성 테스트",
      content: "포럼이 정상적으로 작동하고 있습니다.",
      category: "일반",
      createdAt: new Date("2025-01-25"),
      authorName: "사용자1",
    },
  ];

  // EJS 템플릿이 없을 경우 HTML로 직접 렌더링
  res.send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SEONOH 포럼</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem 0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .logo { font-size: 2rem; font-weight: bold; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a { color: white; text-decoration: none; }
        .nav-links a:hover { text-decoration: underline; }
        .hero { text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; opacity: 0.9; }
        .main { padding: 3rem 0; }
        .posts-container { display: grid; gap: 1.5rem; }
        .post-item { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-left: 4px solid #667eea; transition: transform 0.2s; cursor: pointer; }
        .post-item:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .post-header { display: flex; justify-content: between; align-items: center; margin-bottom: 1rem; }
        .post-category { background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; }
        .post-date { color: #666; font-size: 0.9rem; }
        .post-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #333; }
        .post-content { color: #666; margin-bottom: 1rem; }
        .post-author { color: #888; font-size: 0.9rem; }
        .write-btn { position: fixed; bottom: 2rem; right: 2rem; background: #667eea; color: white; padding: 1rem 1.5rem; border-radius: 50px; text-decoration: none; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); transition: all 0.3s; }
        .write-btn:hover { background: #5a6fd8; transform: scale(1.05); }
        .footer { background: #f8f9fa; padding: 2rem 0; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <header class="header">
        <div class="container">
          <nav class="nav">
            <div class="logo">SEONOH</div>
            <div class="nav-links">
              <a href="/">게시판</a>
              <a href="/write">글쓰기</a>
              <a href="/login">로그인</a>
            </div>
          </nav>
          <div class="hero">
            <h1>디지털 매거진</h1>
            <p>트렌드와 라이프스타일을 담아내는 새로운 디지털 매거진</p>
          </div>
        </div>
      </header>

      <main class="main">
        <div class="container">
          <div class="posts-container">
            ${posts
              .map(
                (post) => `
              <article class="post-item" onclick="location.href='/post/${
                post._id
              }'">
                <div class="post-header">
                  <span class="post-category">${post.category}</span>
                  <span class="post-date">${new Date(
                    post.createdAt
                  ).toLocaleDateString("ko-KR")}</span>
                </div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-content">${post.content.substring(0, 100)}${
                  post.content.length > 100 ? "..." : ""
                }</p>
                <div class="post-author">작성자: ${post.authorName}</div>
              </article>
            `
              )
              .join("")}
          </div>
        </div>
      </main>

      <a href="/write" class="write-btn">✏️ 글쓰기</a>

      <footer class="footer">
        <div class="container">
          <p>&copy; 2025 SEONOH 포럼. All rights reserved.</p>
        </div>
      </footer>
    </body>
    </html>
  `);
});

// 📝 글쓰기 페이지
app.get("/write", (req, res) => {
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

  // 임시 게시글 데이터
  const posts = {
    1: {
      title: "포럼에 오신 것을 환영합니다!",
      content:
        "이것은 첫 번째 게시글입니다.\n\n포럼이 정상적으로 작동하고 있습니다. 자유롭게 글을 작성하고 소통해보세요!",
      category: "공지",
      createdAt: new Date("2025-01-26"),
      authorName: "관리자",
    },
    2: {
      title: "게시글 작성 테스트",
      content:
        "포럼이 정상적으로 작동하고 있습니다.\n\n다양한 주제로 자유롭게 글을 작성해보세요.",
      category: "일반",
      createdAt: new Date("2025-01-25"),
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
              작성자: ${post.authorName} | 
              작성일: ${new Date(post.createdAt).toLocaleDateString("ko-KR")}
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

// 🧪 API 테스트 엔드포인트들
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
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>404 - 페이지를 찾을 수 없습니다</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 3rem; }
        h1 { color: #667eea; }
        a { color: #667eea; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>요청하신 페이지 "${req.path}"를 찾을 수 없습니다.</p>
      <a href="/">메인 페이지로 돌아가기</a>
    </body>
    </html>
  `);
});

console.log("✅ 포럼 서버 설정 완료!");

// Vercel 서버리스 함수를 위한 핸들러
module.exports = app;
