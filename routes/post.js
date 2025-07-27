const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getDB } = require("../db/database");
const { upload } = require("../middleware/upload");
const { ensureAuthenticated } = require("../middleware/auth");

// 메인 페이지 (게시글 목록)
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
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

    res.render("posts/new", {
      posts: result,
      currentPage: page,
      totalPages: totalPages,
      perPage: perPage,
      totalPosts: totalPosts,
    });
  } catch (error) {
    console.error("메인 페이지 로드 중 에러:", error);
    res.status(500).send("서버 에러가 발생했습니다.");
  }
});

// 게시글 목록 조회
router.get("/list", async (req, res) => {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;

    const totalPosts = await db.collection("new").countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    let result = await db
      .collection("new")
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    res.render("list/list", {
      posts: result,
      currentPage: page,
      totalPages: totalPages,
      totalPosts: totalPosts,
      user: req.user,
    });
  } catch (error) {
    console.error("리스트 조회 중 에러:", error);
    res.status(500).send("서버 에러가 발생했습니다.");
  }
});

// 게시글 작성 페이지
router.get("/write", ensureAuthenticated, (req, res) => {
  res.render("posts/new-write.ejs");
});

// 게시글 작성 처리
router.post("/add", upload.single("img1"), async (req, res) => {
  if (!req.user) {
    return res.send(`
     <script>
       alert('로그인이 필요합니다.');
       window.location.href = '/auth/login';
     </script>
   `);
  }

  try {
    const db = getDB();
    if (!req.body.title || !req.body.content) {
      return res.send(`
       <script>
         alert('제목과 내용을 모두 입력해주세요!');
         window.location.href = '/list';
       </script>
     `);
    }

    const post = {
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      category: req.body.category || "일반",
      createdAt: new Date(),
      author: req.user._id,
      authorName: req.user.username,
      img: req.file ? req.file.location : null,
    };

    await db.collection("new").insertOne(post);
    res.redirect("/post/list");
  } catch (error) {
    console.error("글 작성 중 에러 발생:", error);
    res.status(500).send("글 작성 중 에러가 발생했습니다.");
  }
});

// 게시글 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    let result = await db.collection("new").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!result) {
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }

    res.render("posts/detail.ejs", { post: result });
  } catch (error) {
    console.error("상세 페이지 조회 중 에러:", error);
    res.status(500).send("서버 에러가 발생했습니다.");
  }
});

// 게시글 수정 페이지
router.get("/edit/:id", async (req, res) => {
  try {
    const db = getDB();
    let result = await db.collection("new").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!result) {
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }

    res.render("posts/edit", { post: result });
  } catch (error) {
    console.error("수정 페이지 로드 중 에러:", error);
    res.status(500).send("서버 에러가 발생했습니다.");
  }
});

// 게시글 수정 처리
router.post("/edit/:id", ensureAuthenticated, async (req, res) => {
  try {
    const db = getDB();
    upload.single("img1")(req, res, async (err) => {
      if (err) {
        console.error("이미지 업로드 에러:", err);
        return res.send(`
         <script>
           alert('이미지 업로드 중 오류가 발생했습니다.');
           history.back();
         </script>
       `);
      }

      try {
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
          return res.send(`
           <script>
             alert('잘못된 게시글 ID입니다.');
             history.back();
           </script>
         `);
        }

        // 유효성 검사
        if (!req.body.title || !req.body.content) {
          return res.send(`
           <script>
             alert('제목과 내용을 모두 입력해주세요!');
             history.back();
           </script>
         `);
        }

        // 게시글 수정 데이터
        const updateData = {
          title: req.body.title.trim(),
          content: req.body.content.trim(),
          category: req.body.category,
          updatedAt: new Date(),
        };

        if (req.file) {
          updateData.img = req.file.location;
        }

        const result = await db
          .collection("new")
          .updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
          );

        if (result.matchedCount === 0) {
          return res.send(`
           <script>
             alert('해당 게시글을 찾을 수 없습니다.');
             history.back();
           </script>
         `);
        }

        res.redirect("/post/" + req.params.id);
      } catch (error) {
        console.error("게시글 수정 중 에러:", error);
        res.send(`
         <script>
           alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
           history.back();
         </script>
       `);
      }
    });
  } catch (error) {
    console.error("전체 처리 중 에러:", error);
    res.status(500).send("서버 에러가 발생했습니다.");
  }
});

// 게시글 삭제
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  console.log("🗑️ 삭제 요청 받음:", req.params.id);
  console.log("👤 현재 사용자:", req.user);

  try {
    const db = getDB();

    // 게시글 작성자 확인
    const post = await db.collection("new").findOne({
      _id: new ObjectId(req.params.id),
    });

    console.log("📄 찾은 게시글:", post);

    if (!post) {
      console.log("❌ 게시글을 찾을 수 없음");
      return res
        .status(404)
        .json({ success: false, message: "게시글을 찾을 수 없습니다." });
    }

    console.log("🔍 작성자 비교:", {
      postAuthor: post.author.toString(),
      currentUser: req.user._id.toString(),
      isMatch: post.author.toString() === req.user._id.toString(),
    });

    // 작성자만 삭제 가능
    if (post.author.toString() !== req.user._id.toString()) {
      console.log("❌ 삭제 권한 없음");
      return res
        .status(403)
        .json({ success: false, message: "삭제 권한이 없습니다." });
    }

    const deleteResult = await db.collection("new").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    console.log("✅ 삭제 결과:", deleteResult);

    res.json({ success: true });
  } catch (error) {
    console.error("❌ 삭제 중 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
