import { Redis } from '@upstash/redis';

// ===== Upstash Redis Client =====
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('⚠️  Upstash Redis credentials not found. Caching will be disabled.');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ===== Cache Helpers =====

/**
 * Get cached data or fetch fresh & cache it.
 * Falls through to fetcher if Redis is unavailable — never crashes the app.
 */
export async function getOrSet<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
  } catch (err) {
    console.error(`⚠️  Redis GET error for ${key}:`, err);
  }

  const fresh = await fetcher();

  try {
    await redis.set(key, JSON.stringify(fresh), { ex: ttlSeconds });
  } catch (err) {
    console.error(`⚠️  Redis SET error for ${key}:`, err);
  }

  return fresh;
}

/**
 * Delete specific cache keys.
 */
export async function invalidateCache(...keys: string[]): Promise<void> {
  try {
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    console.error('⚠️  Redis DEL error:', err);
  }
}

/**
 * Delete all cache keys matching a pattern (e.g. "user:5:*").
 */
export async function invalidatePattern(pattern: string): Promise<void> {
  try {
    let cursor = 0;
    do {
      const result = await redis.scan(cursor, { match: pattern, count: 100 });
      cursor = Number(result[0]);
      const keys = result[1] as string[];
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== 0);
  } catch (err) {
    console.error(`⚠️  Redis pattern invalidate error:`, err);
  }
}
