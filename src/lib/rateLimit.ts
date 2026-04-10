import { NextRequest, NextResponse } from "next/server";

const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  request: NextRequest,
  options: {
    limit: number;
    windowMs: number;
    message?: string;
  }
) {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const key = ip + ":" + request.nextUrl.pathname;
  const now = Date.now();
  const windowMs = options.windowMs;
  const limit = options.limit;

  const current = requests.get(key);

  if (!current || now > current.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (current.count >= limit) {
    return NextResponse.json(
      {
        error: options.message || "Too many requests. Please try again later.",
        retryAfter: Math.ceil((current.resetAt - now) / 1000),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": current.resetAt.toString(),
          "Retry-After": Math.ceil((current.resetAt - now) / 1000).toString(),
        },
      }
    );
  }

  current.count++;
  return null;
}