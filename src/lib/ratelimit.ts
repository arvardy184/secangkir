import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

const WINDOW_MS = 60_000;
const LIMIT = 20;

const memoryStore = new Map<string, number[]>();

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const upstashRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(LIMIT, "60 s"),
      analytics: false,
      prefix: "secangkir:api",
    })
  : null;

async function memoryLimit(identifier: string): Promise<LimitResult> {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const existing = memoryStore.get(identifier) ?? [];
  const recent = existing.filter((timestamp) => timestamp > windowStart);
  const success = recent.length < LIMIT;
  const next = success ? [...recent, now] : recent;

  memoryStore.set(identifier, next);

  return {
    success,
    limit: LIMIT,
    remaining: Math.max(0, LIMIT - next.length),
    reset: now + WINDOW_MS,
  };
}

export const ratelimit = {
  async limit(identifier: string): Promise<LimitResult> {
    if (upstashRatelimit) {
      const result = await upstashRatelimit.limit(identifier);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    }

    return memoryLimit(identifier);
  },
};
