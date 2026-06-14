const WINDOW_MS = 60_000;
const LIMIT = 20;

const memoryStore = new Map<string, number[]>();

export const ratelimit = {
  async limit(identifier: string): Promise<{ success: boolean }> {
    const now = Date.now();
    const windowStart = now - WINDOW_MS;
    const existing = memoryStore.get(identifier) ?? [];
    const recent = existing.filter((t) => t > windowStart);
    const success = recent.length < LIMIT;

    memoryStore.set(identifier, success ? [...recent, now] : recent);

    return { success };
  },
};
