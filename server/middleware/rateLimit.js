const buckets = new Map();

const cleanup = () => {
  const now = Date.now();
  for (const [key, timestamps] of buckets) {
    const active = timestamps.filter((timestamp) => timestamp > now);
    if (active.length) buckets.set(key, active);
    else buckets.delete(key);
  }
};

setInterval(cleanup, 5 * 60_000).unref();

export const createRateLimiter = ({ windowMs, max, message, keyPrefix = "route" }) => {
  return (req, res, next) => {
    const key = `${keyPrefix}:${req.ip}`;
    const now = Date.now();
    const timestamps = (buckets.get(key) || []).filter(
      (timestamp) => timestamp > now
    );

    if (timestamps.length >= max) {
      const retryAfter = Math.max(
        1,
        Math.ceil((timestamps[0] - now) / 1000)
      );

      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({
        success: false,
        message: message || "Too many requests. Please try again later.",
      });
    }

    timestamps.push(now + windowMs);
    buckets.set(key, timestamps);
    return next();
  };
};

export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60_000,
  max: 5,
  message: "Too many login attempts. Please try again in 15 minutes.",
});

export const contactRateLimiter = createRateLimiter({
  windowMs: 10 * 60_000,
  max: 5,
  message: "Too many contact submissions. Please try again later.",
});

export const aiRateLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 10,
  keyPrefix: "ai",
  message: "Too many AI requests. Please try again in a minute.",
});
