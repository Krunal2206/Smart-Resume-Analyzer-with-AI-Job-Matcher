import redis from "./redis";

// Rate limit configurations for different operations
export const RATE_LIMITS = {
  upload: { limit: 3, windowSec: 600 }, // 3 uploads per 10 minutes
  contact: { limit: 5, windowSec: 300 }, // 5 contacts per 5 minutes
  login: { limit: 5, windowSec: 300 }, // 5 login attempts per 5 minutes
  register: { limit: 3, windowSec: 3600 }, // 3 registration attempts per hour
} as const;

export type RateLimitOperation = keyof typeof RATE_LIMITS;

interface RateLimitResult {
  limited: boolean;
  remaining: number;
  ttl: number;
  retryAfter?: number;
}

export async function isRateLimited(
  identifier: string,
  operation: RateLimitOperation,
  ip?: string
): Promise<RateLimitResult> {
  try {
    const { limit, windowSec } = RATE_LIMITS[operation];
    
    // Combine identifier (usually email) with IP if provided for stricter limiting
    const key = ip 
      ? `rate:${operation}:${identifier}:${ip}`
      : `rate:${operation}:${identifier}`;

    // Execute commands sequentially instead of using multi
    const current = await redis.incr(key);
    const ttl = await redis.ttl(key);

    // Set expiration on first request
    if (current === 1) {
      await redis.expire(key, windowSec);
    }

    const remaining = Math.max(limit - current, 0);
    const limited = current > limit;
    const retryAfter = ttl > 0 ? ttl : windowSec;

    return {
      limited,
      remaining,
      ttl: retryAfter,
      retryAfter: limited ? retryAfter : undefined
    };
  } catch (error) {
    console.error(`Rate limiting error for ${operation}:`, error);
    // Fail open - allow the request if Redis is down
    return {
      limited: false,
      remaining: 1,
      ttl: 0
    };
  }
}
