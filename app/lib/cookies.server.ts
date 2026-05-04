import { createCookie } from "react-router";

export const MAX_COOKIE_AGE = 60 * 60 * 24 * 14; // 14 days

// About cookies: https://remix.run/docs/en/main/utils/cookies

export const userPrefs = createCookie("user-prefs", {
  maxAge: MAX_COOKIE_AGE,
});

export const authCookie = createCookie("auth", {
  secrets: process.env.COOKIE_SECRET?.split(",") ?? [],
  maxAge: MAX_COOKIE_AGE,
  secure: true,
});
