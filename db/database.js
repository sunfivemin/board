const { MongoClient } = require("mongodb");
require("dotenv").config();

const url = process.env.DB_URL;

if (!url) {
  console.error("❌ DB_URL 환경 변수가 설정되지 않았습니다!");
  throw new Error("DB_URL environment variable is not set");
}

console.log("🔗 MongoDB 연결 시도 (Vercel 최적화)");

let db;
let client;

// Vercel 서버리스에 최적화된 연결 설정
const connectDB = async () => {
  try {
    if (client && client.topology && client.topology.isConnected()) {
      console.log("✅ 기존 연결 재사용");
      return client;
    }

    console.log("🔄 새로운 MongoDB 연결 생성...");

    client = new MongoClient(url, {
      // Vercel 서버리스 최적화 설정
      serverSelectionTimeoutMS: 30000, // 30초로 증가!!!
      connectTimeoutMS: 30000, // 30초
      socketTimeoutMS: 0, // 무제한
      maxPoolSize: 1, // 서버리스는 1개 연결만
      minPoolSize: 0, // 최소 0개
      maxIdleTimeMS: 30000, // 30초 후 연결 해제
      waitQueueTimeoutMS: 5000, // 5초
      retryWrites: true,
      w: "majority",
    });

    await client.connect();
    console.log("✅ MongoDB 연결 성공!");
    return client;
  } catch (error) {
    console.error("❌ MongoDB 연결 실패:", error.message);
    throw error;
  }
};

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
