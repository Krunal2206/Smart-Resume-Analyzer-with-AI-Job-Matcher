import Redis from "ioredis";

let redis: Redis;

try {
  redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

  redis.on("error", (error) => {
    console.error("Redis connection error:", error);
  });

  redis.on("connect", () => {
    console.log("Redis connected successfully");
  });
} catch (error) {
  console.error("Failed to initialize Redis:", error);
  // Create a mock Redis client that doesn't crash the app
  redis = {
    get: async () => null,
    set: async () => "OK",
    del: async () => 0,
    on: () => redis,
  } as unknown as Redis;
}

export default redis;
