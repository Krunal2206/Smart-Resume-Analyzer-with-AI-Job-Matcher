import redis from "./redis";

interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

const DEFAULT_CACHE_TTL = 60 * 60 * 24; // 24 hours

export class CacheService {
  private static async getCacheKey(key: string): Promise<string | null> {
    try {
      const value = await redis.get(key);
      return value;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  private static async setCacheKey(
    key: string,
    value: string,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const { ttl = DEFAULT_CACHE_TTL } = options;
      await redis.setex(key, ttl, value);
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.getCacheKey(key);
      if (cached) {
        return JSON.parse(cached) as T;
      }

      // If not in cache, fetch and store
      const fresh = await fetchFn();
      await this.setCacheKey(key, JSON.stringify(fresh), options);
      return fresh;
    } catch (error) {
      console.error("Cache getOrSet error:", error);
      // Fallback to direct fetch if cache fails
      return fetchFn();
    }
  }

  static async invalidate(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error("Cache invalidation error:", error);
    }
  }

  static generateKey(parts: string[]): string {
    return parts.join(":");
  }
}
