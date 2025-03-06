import Redis from "ioredis";

const globalWithRedis = global as typeof globalThis & { _redis?: Redis };

if (!globalWithRedis._redis) {
  globalWithRedis._redis = new Redis({
    host: String(process.env.REDIS_HOST),
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });

  globalWithRedis._redis.on("error", (err) => {
    console.error("Redis error:", err);
  });
}

const redisClient = globalWithRedis._redis;

export default redisClient;