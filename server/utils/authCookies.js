import crypto from "node:crypto";

const AUTH_COOKIE = "portfolio_auth";
const CSRF_COOKIE = "portfolio_csrf";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

const isProduction = process.env.NODE_ENV === "production";
const sameSite = isProduction ? "None" : "Lax";
const secure = isProduction;

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${options.path || "/"}`];

  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);

  return parts.join("; ");
}

function appendSetCookie(res, cookie) {
  const current = res.getHeader("Set-Cookie");
  const values = Array.isArray(current) ? current : current ? [current] : [];
  res.setHeader("Set-Cookie", [...values, cookie]);
}

export function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((cookies, part) => {
    const index = part.indexOf("=");
    if (index < 0) return cookies;

    const name = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();

    if (!name) return cookies;

    try {
      cookies[name] = decodeURIComponent(value);
    } catch {
      cookies[name] = value;
    }

    return cookies;
  }, {});
}

export function getAuthToken(req) {
  return parseCookies(req.headers.cookie || "")[AUTH_COOKIE] || null;
}

export function getCsrfToken(req) {
  return parseCookies(req.headers.cookie || "")[CSRF_COOKIE] || null;
}

export function setAuthCookies(res, token) {
  const csrfToken = crypto.randomBytes(32).toString("base64url");

  appendSetCookie(
    res,
    serializeCookie(AUTH_COOKIE, token, {
      maxAge: COOKIE_MAX_AGE_SECONDS,
      httpOnly: true,
      secure,
      sameSite,
    })
  );

  appendSetCookie(
    res,
    serializeCookie(CSRF_COOKIE, csrfToken, {
      maxAge: COOKIE_MAX_AGE_SECONDS,
      httpOnly: false,
      secure,
      sameSite,
    })
  );

  return csrfToken;
}

export function clearAuthCookies(res) {
  appendSetCookie(
    res,
    serializeCookie(AUTH_COOKIE, "", {
      maxAge: 0,
      httpOnly: true,
      secure,
      sameSite,
    })
  );

  appendSetCookie(
    res,
    serializeCookie(CSRF_COOKIE, "", {
      maxAge: 0,
      httpOnly: false,
      secure,
      sameSite,
    })
  );
}

export { AUTH_COOKIE, CSRF_COOKIE };
