// express 라이브러리 사용하겠다.
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const MongoStore = require("connect-mongo");
require("dotenv").config();

// 미들웨어 설정
app.use(methodOverride("_method"));
// app.use(express.static(__dirname + "/public"));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session & Passport 설정
app.use(passport.initialize());
app.use(
  session({
    secret: "alstjsdh1",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      dbName: "forum",
    }),
  })
);

// Passport 초기화는 session 미들웨어 이후에
app.use(passport.initialize());
app.use(passport.session());

// locals 설정도 passport 초기화 이후에
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// MongoDB 연결
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

let db;
const url = process.env.DB_URL;

async function connectDB() {
  try {
    const client = await new MongoClient(url).connect();
    console.log("DB 연결 성공!");
    return client.db("forum");
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// 서버 시작 전에 DB 연결
(async () => {
  try {
    db = await connectDB();
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.log("서버 시작 실패:", err);
  }
})();

// s3
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "sunohforum",
    key: function (요청, file, cb) {
      cb(null, Date.now().toString()); //업로드시 파일명 변경가능
    },
  }),
});

/*
public폴더안에 있는 파일들을 html에서 가져다가 쓰고 싶으면 
서버파일에 app.use라는 문법으로 public 폴더를 등록해놔야합니다. 
그럼 이제 public 폴더안에 있는 css파일 이미지파일 js파일은 전부 html에서 가져다가 쓸 수 있습니다. 
참고로 css, js, 이미지 파일들을 static 파일들이라고 부릅니다. 
*/

// ------------------------------------
// 기본 페이지 라우트
// ------------------------------------

// 메인 페이지 (게시글 목록)
app.get("/", async function (요청, 응답) {
  try {
    const page = parseInt(요청.query.page) || 1;
    const perPage = 5;

    const totalPosts = await db.collection("new").countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    let result = await db
      .collection("new")
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    응답.render("posts/new", {
      // 경로 수정
      posts: result,
      currentPage: page,
      totalPages: totalPages,
      perPage: perPage,
      totalPosts: totalPosts,
    });
  } catch (error) {
    console.error("메인 페이지 로드 중 에러:", error);
    응답.status(500).send("서버 에러가 발생했습니다.");
  }
});

app.get("/time", async (요청, 응답) => {
  응답.render("time.ejs", { data: new Date() });
});

// ------------------------------------
// 메인 게시판 라우트 (/list)
// ------------------------------------
app.get("/list", async (요청, 응답) => {
  try {
    const page = parseInt(요청.query.page) || 1;
    const perPage = 6; // 한 페이지당 6개 표시

    const totalPosts = await db.collection("new").countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    let result = await db
      .collection("new")
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    응답.render("list/list", {
      posts: result,
      currentPage: page,
      totalPages: totalPages,
      user: 요청.user,
    });
  } catch (error) {
    console.error("리스트 조회 중 에러:", error);
    응답.status(500).send("서버 에러가 발생했습니다.");
  }
});

app.post("/add", upload.single("img1"), async (요청, 응답) => {
  if (!요청.user) {
    return 응답.send(`
      <script>
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
      </script>
    `);
  }

  try {
    if (!요청.body.title || !요청.body.content) {
      return 응답.send(`
        <script>
          alert('제목과 내용을 모두 입력해주세요!');
          window.location.href = '/list';
        </script>
      `);
    }

    const post = {
      title: 요청.body.title.trim(),
      content: 요청.body.content.trim(),
      category: 요청.body.category || "일반",
      createdAt: new Date(),
      author: 요청.user._id,
      authorName: 요청.user.username,
      img: 요청.file ? 요청.file.location : null, // S3에 업로드된 이미지 URL
    };

    await db.collection("new").insertOne(post);
    응답.redirect("/list");
  } catch (error) {
    console.error("글 작성 중 에러 발생:", error);
    응답.status(500).send("글 작성 중 에러가 발생했습니다.");
  }
});

// ------------------------------------
// NEW 게시판 라우트 (/new)
// ------------------------------------
app.get("/new", async (요청, 응답) => {
  try {
    const page = parseInt(요청.query.page) || 1;
    const perPage = 5;

    const totalPosts = await db.collection("new").countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    let result = await db
      .collection("new")
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    응답.render("posts/new", {
      posts: result,
      currentPage: page,
      totalPages: totalPages,
      perPage: perPage,
      totalPosts: totalPosts,
    });
  } catch (error) {
    console.error("new 리스트 조회 중 에러:", error);
    응답.status(500).send("서버 에러가 발생했습니다.");
  }
});

app.get("/new/write", ensureAuthenticated, (요청, 응답) => {
  응답.render("posts/new-write.ejs");
});

app.post("/new/post", ensureAuthenticated, async (요청, 응답) => {
  try {
    // 이미지 업로드 처리
    upload.single("img1")(요청, 응답, async (err) => {
      if (err) {
        console.error("이미지 업로드 에러:", err);
        return 응답.send(`
          <script>
            alert('이미지 업로드 중 오류가 발생했습니다.');
            history.back();
          </script>
        `);
      }

      try {
        // 필수 입력값 검증
        if (!요청.body.title || !요청.body.content) {
          return 응답.send(`
            <script>
              alert('제목과 내용을 모두 입력해주세요!');
              window.location.href = '/new/write';
            </script>
          `);
        }

        // 게시글 데이터 구성
        const post = {
          title: 요청.body.title.trim(),
          content: 요청.body.content.trim(),
          category: 요청.body.category || "일반",
          createdAt: new Date(),
          author: 요청.user._id,
          authorName: 요청.user.username,
          img: 요청.file ? 요청.file.location : null, // 이미지가 있는 경우에만 저장
        };

        // DB에 저장
        await db.collection("new").insertOne(post);
        응답.redirect("/new");
      } catch (error) {
        console.error("게시글 저장 중 에러:", error);
        응답.send(`
          <script>
            alert('게시글 저장 중 오류가 발생했습니다.');
            history.back();
          </script>
        `);
      }
    });
  } catch (error) {
    console.error("전체 처리 중 에러:", error);
    응답.status(500).send("서버 에러가 발생했습니다.");
  }
});
app.get("/new/:id", async (요청, 응답) => {
  try {
    let result = await db.collection("new").findOne({
      // db에서 게시물 하나만 찾아오려면 db.collection().findOne({ })
      // _id:ObjectId(678c82bcb59bc2cd8042f9c4) 이런식으로 ObjectId로 감싸져 있기 때문에
      _id: new ObjectId(요청.params.id),
    });

    if (!result) {
      return 응답.status(404).send("게시글을 찾을 수 없습니다.");
    }

    응답.render("posts/detail.ejs", { post: result });
  } catch (error) {
    console.error("상세 페이지 조회 중 에러:", error);
    응답.status(500).send("서버 에러가 발생했습니다.");
  }
});

// 수정 페이지 보여주기
app.get("/new/edit/:id", async (요청, 응답) => {
  try {
    let result = await db.collection("new").findOne({
      _id: new ObjectId(요청.params.id),
    });

    if (!result) {
      return 응답.status(404).send("게시글을 찾을 수 없습니다.");
    }

    응답.render("posts/edit", { post: result });
  } catch (error) {
    console.error("수정 페이지 로드 중 에러:", error);
    응답.status(500).send("서버 에러가 발생했습니다.");
  }
});

// 수정 처리하기
app.post("/new/edit/:id", ensureAuthenticated, async (요청, 응답) => {
  try {
    // 이미지 업로드 처리
    upload.single("img1")(요청, 응답, async (err) => {
      if (err) {
        console.error("이미지 업로드 에러:", err);
        return 응답.send(`
          <script>
            alert('이미지 업로드 중 오류가 발생했습니다.');
            history.back();
          </script>
        `);
      }

      try {
        // 1. id 파라미터 검증
        if (!요청.params.id || !ObjectId.isValid(요청.params.id)) {
          return 응답.send(`
            <script>
              alert('잘못된 게시글 ID입니다.');
              history.back();
            </script>
          `);
        }

        // 2. 제목과 내용이 비어있는지 체크
        if (!요청.body.title || !요청.body.content) {
          return 응답.send(`
            <script>
              alert('제목과 내용을 모두 입력해주세요!');
              history.back();
            </script>
          `);
        }

        // 3. 제목과 내용의 길이 제한
        if (요청.body.title.length > 100) {
          return 응답.send(`
            <script>
              alert('제목은 100자 이내로 작성해주세요.');
              history.back();
            </script>
          `);
        }

        if (요청.body.content.length > 10000) {
          return 응답.send(`
            <script>
              alert('내용은 10000자 이내로 작성해주세요.');
              history.back();
            </script>
          `);
        }

        // 4. 카테고리 유효성 검사
        const validCategories = ["일반", "공지", "질문"];
        if (!validCategories.includes(요청.body.category)) {
          return 응답.send(`
            <script>
              alert('유효하지 않은 카테고리입니다.');
              history.back();
            </script>
          `);
        }

        // 5. 기존 게시글 조회
        const existingPost = await db.collection("new").findOne({
          _id: new ObjectId(요청.params.id),
        });

        if (!existingPost) {
          return 응답.send(`
            <script>
              alert('게시글을 찾을 수 없습니다.');
              history.back();
            </script>
          `);
        }

        // 6. 업데이트할 데이터 구성
        const updateData = {
          title: 요청.body.title.trim(),
          content: 요청.body.content.trim(),
          category: 요청.body.category,
          updatedAt: new Date(),
        };

        // 새로운 이미지가 업로드된 경우에만 이미지 정보 업데이트
        if (요청.file) {
          updateData.img = 요청.file.location;
        }

        // 7. DB 업데이트 수행
        const result = await db
          .collection("new")
          .updateOne(
            { _id: new ObjectId(요청.params.id) },
            { $set: updateData }
          );

        // 8. 수정 결과 확인
        if (result.matchedCount === 0) {
          return 응답.send(`
            <script>
              alert('해당 게시글을 찾을 수 없습니다.');
              history.back();
            </script>
          `);
        }

        if (result.modifiedCount === 0) {
          return 응답.send(`
            <script>
              alert('게시글 수정에 실패했습니다.');
              history.back();
            </script>
          `);
        }

        응답.redirect("/new/" + 요청.params.id);
      } catch (error) {
        console.error("게시글 수정 중 에러:", error);
        응답.send(`
          <script>
            alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            history.back();
          </script>
        `);
      }
    });
  } catch (error) {
    console.error("전체 처리 중 에러:", error);
    응답.status(500).send("서버 에러가 발생했습니다.");
  }
});

// 게시글 삭제
app.delete("/new/:id", async (요청, 응답) => {
  try {
    await db.collection("new").deleteOne({
      _id: new ObjectId(요청.params.id), // 유저가 보낸 아이디
    });
    응답.json({ success: true });
  } catch (error) {
    console.error("삭제 중 에러:", error);
    응답.status(500).json({ success: false });
  }
});

// app.get("/shop", (요청, 응답) => {
// console.log(result[0].title);
//   응답.send("쇼핑페이지임");
// });

/*
function 함수1(){ } 
=== 
var 함수2 = () => { }
*/

// ------------------------------------
// 로그인
// ------------------------------------

// 로그인성공시 세션만들어주고 유저 브라우저 쿠키에 저장해주는건 serializeUser
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// 유저가 쿠키 제출한걸 확인해보는건 deserializeUser
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Passport 전략 설정
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.collection("users").findOne({ username: username });

      if (!user) {
        return done(null, false, { message: "존재하지 않는 아이디입니다." });
      }

      // 비밀번호가 해시되어 있는 경우
      if (
        user.password.startsWith("$2b$") ||
        user.password.startsWith("$2a$")
      ) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, {
            message: "비밀번호가 일치하지 않습니다.",
          });
        }
      }
      // 비밀번호가 평문인 경우
      else if (password !== user.password) {
        return done(null, false, { message: "비밀번호가 일치하지 않습니다." });
      }

      // 로그인 성공시 평문 비밀번호를 해시화하여 업데이트 (선택사항)
      if (
        !user.password.startsWith("$2b$") &&
        !user.password.startsWith("$2a$")
      ) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db
          .collection("users")
          .updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// 로그인 페이지 렌더링
app.get("/login", (req, res) => {
  res.render("auth/login", {
    error: req.session.messages && req.session.messages[0],
  });
});

// 로그인 처리
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

// 회원가입 페이지 렌더링
app.get("/signup", (req, res) => {
  res.render("auth/signup", { error: null });
});

// 회원가입 처리
app.post("/signup", async (req, res) => {
  try {
    const { username, password, confirmPassword, email } = req.body;

    // 기본적인 입력값 검증
    if (!username || !password || !confirmPassword || !email) {
      return res.render("auth/signup", {
        error: "모든 필드를 입력해주세요.",
      });
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      return res.render("auth/signup", {
        error: "비밀번호가 일치하지 않습니다.",
      });
    }

    // 아이디 중복 체크
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return res.render("auth/signup", {
        error: "이미 사용중인 아이디입니다.",
      });
    }

    // 비밀번호 해시화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 정보 저장 (해시화된 비밀번호 저장)
    await db.collection("users").insertOne({
      username,
      password: hashedPassword, // 해시화된 비밀번호 저장
      email,
      createdAt: new Date(),
    });

    res.redirect("/login");
  } catch (error) {
    console.error("회원가입 에러:", error);
    res.render("auth/signup", {
      error: "회원가입 처리 중 오류가 발생했습니다.",
    });
  }
});

// 로그아웃
app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// 로그인 필요한 페이지를 위한 미들웨어
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// profile
app.get("/users/profile", ensureAuthenticated, (요청, 응답) => {
  try {
    응답.render("users/profile", { user: 요청.user });
  } catch (error) {
    응답.status(500).send("프로필 페이지 로드 중 오류가 발생했습니다.");
  }
});
