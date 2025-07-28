const { MongoClient } = require("mongodb");
require("dotenv").config();

const url = process.env.DB_URL;

if (!url) {
  console.error("❌ DB_URL 환경 변수가 설정되지 않았습니다!");
  throw new Error("DB_URL environment variable is not set");
}

console.log("🔗 MongoDB 연결 시도 (Render 서버)");

let db;
let client;

// Render 서버에 최적화된 연결 설정
const connectDB = async () => {
  try {
    if (client && client.topology && client.topology.isConnected()) {
      console.log("✅ 기존 연결 재사용");
      return client;
    }

    console.log("🔄 새로운 MongoDB 연결 생성...");

    client = new MongoClient(url, {
      // Render 서버 최적화 설정
      serverSelectionTimeoutMS: 5000, // 5초
      connectTimeoutMS: 10000, // 10초
      maxPoolSize: 10, // 서버에서는 여러 연결 가능
      minPoolSize: 1, // 최소 1개 연결 유지
      maxIdleTimeMS: 30000, // 30초 후 유휴 연결 해제
      retryWrites: true,
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
