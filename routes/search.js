const express = require("express");
const router = express.Router();
const { getDB } = require("../db/database");

// 🔍 검색 라우트
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const keyword = req.query.val;

    if (!keyword || keyword.trim() === "") {
      return res.send(`
        <script>
          alert('검색어를 입력해주세요.');
          window.history.back();
        </script>
      `);
    }

    const results = await db
      .collection("new")
      .find({
        title: { $regex: keyword, $options: "i" }, // 대소문자 무시하고 검색
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.render("search", {
      posts: results,
      keyword,
    });
  } catch (error) {
    console.error("검색 중 에러:", error);
    res.status(500).send("검색 처리 중 서버 오류가 발생했습니다.");
  }
});

module.exports = router;
