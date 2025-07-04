import redis from "./redis";

export async function isRateLimited(
  userEmail: string,
  limit = 3,
  windowSec = 600
) {
  const key = `rate:upload:${userEmail}`;

  const current = await redis.incr(key);

  if (current === 1) {
    // First upload, set expiration
    await redis.expire(key, windowSec);
  }

  const ttl = await redis.ttl(key); // Time left in window
  const remaining = Math.max(limit - current, 0);

  const limited = current > limit;

  return {
    limited,
    remaining,
    ttl,
  };
}
