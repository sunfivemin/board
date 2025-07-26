const { MongoClient } = require("mongodb");
require("dotenv").config();

const url = process.env.DB_URL;

if (!url) {
  console.error("❌ DB_URL 환경 변수가 설정되지 않았습니다!");
  throw new Error("DB_URL environment variable is not set");
}

console.log("🔗 MongoDB 연결 시도:", url.replace(/\/\/.*@/, "//***:***@")); // 비밀번호 숨김

let db;

const connectDB = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}).connect();

const getDB = () => {
  if (!db) {
    console.error("❌ 데이터베이스가 초기화되지 않았습니다!");
    throw new Error("Database not initialized");
  }
  return db;
};

const setDB = (database) => {
  db = database;
  console.log("✅ 데이터베이스 설정 완료");
};

module.exports = { connectDB, getDB, setDB };
