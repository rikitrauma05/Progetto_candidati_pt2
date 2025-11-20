// frontend/utils/cookies.ts
"use client";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

// durata del cookie: 1 giorno (modificabile)
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24;

function setCookie(name: string, value: string, maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS) {
    document.cookie = `${name}=${encodeURIComponent(
        value
    )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function setAuthCookies(accessToken: string, refreshToken?: string) {
    setCookie(ACCESS_TOKEN_COOKIE, accessToken);
    if (refreshToken) {
        setCookie(REFRESH_TOKEN_COOKIE, refreshToken);
    }
}

export function clearAuthCookies() {
    deleteCookie(ACCESS_TOKEN_COOKIE);
    deleteCookie(REFRESH_TOKEN_COOKIE);
}
