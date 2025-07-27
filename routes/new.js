const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getDB } = require("../db/database");
const { upload } = require("../middleware/upload");

// 게시글 작성 페이지 (/new/write)
router.get("/write", async (req, res) => {
  res.render("posts/new-write");
});

// 게시글 작성 처리 (POST /new/add)
router.post("/add", upload.single("img1"), async (req, res) => {
  console.log("📝 게시글 작성 요청");
  console.log("📝 요청 바디:", req.body);
  console.log("📁 업로드된 파일:", req.file);

  try {
    const db = getDB();

    if (!req.body.title || !req.body.content) {
      return res.status(400).send("제목과 내용을 모두 입력해주세요!");
    }

    const postData = {
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      category: req.body.category || "일반",
      author: req.user ? req.user.username : "익명",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 이미지가 업로드된 경우에만 이미지 필드 추가
    if (req.file) {
      // 로컬 개발 환경에서는 상대 경로 사용
      if (process.env.NODE_ENV === "production") {
        postData.img = req.file.location; // S3 URL
      } else {
        postData.img = "/uploads/" + req.file.filename; // 로컬 경로
      }
    }

    const result = await db.collection("new").insertOne(postData);
    console.log("✅ 게시글 작성 완료:", result.insertedId);
    res.redirect("/new");
  } catch (error) {
    console.error("게시글 작성 중 에러:", error);
    res.status(500).send("서버 에러가 발생했습니다.");
  }
});

// /new 경로 - 게시판 목록
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
    console.error("간단한 목록 로드 중 에러:", error);
    res.status(500).send("서버 에러가 발생했습니다.");
  }
});

// 게시글 수정 페이지 (/new/edit/:id) - 더 구체적인 라우트를 먼저 정의
router.get("/edit/:id", async (req, res) => {
  console.log("🔧 수정 페이지 요청:", req.params.id);
  try {
    const db = getDB();
    let result = await db.collection("new").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!result) {
      console.log("❌ 게시글을 찾을 수 없음:", req.params.id);
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }

    console.log("✅ 수정 페이지 렌더링:", result.title);
    res.render("posts/edit", { post: result });
  } catch (error) {
    console.error("수정 페이지 로드 중 에러:", error);
    res.status(500).send("서버 에러가 발생했습니다.");
  }
});

// 게시글 상세 조회 (/new/:id) - 더 일반적인 라우트를 나중에 정의
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

// 게시글 수정 처리 (POST /new/edit/:id)
router.post(
  "/edit/:id",
  (req, res, next) => {
    // multipart/form-data인 경우에만 multer 사용
    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      upload.single("img1")(req, res, next);
    } else {
      next();
    }
  },
  async (req, res) => {
    console.log("🔧 수정 처리 요청:", req.params.id);
    console.log("📝 요청 바디:", req.body);
    console.log("📁 업로드된 파일:", req.file);

    try {
      const db = getDB();

      if (!req.body.title || !req.body.content) {
        console.log("❌ 제목 또는 내용이 없음:", {
          title: req.body.title,
          content: req.body.content,
        });
        return res.status(400).send("제목과 내용을 모두 입력해주세요!");
      }

      const updateData = {
        title: req.body.title.trim(),
        content: req.body.content.trim(),
        category: req.body.category || "일반",
        updatedAt: new Date(),
      };

      // 이미지가 업로드된 경우에만 이미지 필드 추가
      if (req.file) {
        // 로컬 개발 환경에서는 상대 경로 사용
        if (process.env.NODE_ENV === "production") {
          updateData.img = req.file.location; // S3 URL
        } else {
          updateData.img = "/uploads/" + req.file.filename; // 로컬 경로
        }
      }

      const updateResult = await db
        .collection("new")
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });

      if (updateResult.matchedCount === 0) {
        return res.status(404).send("게시글을 찾을 수 없습니다.");
      }

      console.log("✅ 게시글 수정 완료:", req.params.id);
      res.redirect(`/new/${req.params.id}`);
    } catch (error) {
      console.error("수정 처리 중 에러:", error);
      res.status(500).send("서버 에러가 발생했습니다.");
    }
  }
);

// 게시글 삭제 (/new/:id)
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const deleteResult = await db.collection("new").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (deleteResult.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "게시글을 찾을 수 없습니다." });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("삭제 중 에러:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
