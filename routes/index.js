const express = require("express");
const router = express.Router();
const { getDB } = require("../db/database");

// 테스트 라우트
router.get("/test", (req, res) => {
  res.json({ message: "서버가 정상적으로 작동합니다!", timestamp: new Date() });
});

// 메인 페이지
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

// 시간 표시 페이지
router.get("/time", async (req, res) => {
  res.render("time.ejs", { data: new Date() });
});

module.exports = router;
