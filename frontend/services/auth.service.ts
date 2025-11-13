import { getJson, postJson, deleteJson } from "./api";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RefreshTokenResponse,
    MeResponse,
} from "@/types/auth";

/**
 * POST /auth/login
 * body: { email, password }
 * response: { accessToken, refreshToken, user }
 */
export function login(payload: LoginRequest) {
    return postJson<LoginResponse, LoginRequest>("/auth/login", payload);
}

/**
 * POST /auth/register
 * body: { email, password, nome, cognome, ruolo, consensoPrivacy }
 */
export function register(payload: RegisterRequest) {
    return postJson<void, RegisterRequest>("/auth/register", payload);
}

/**
 * POST /auth/refresh
 * usa refreshToken (header/cookie, dipende dal backend)
 */
export function refreshToken() {
    return postJson<RefreshTokenResponse, {}>("/auth/refresh", {});
}

/**
 * GET /auth/me
 * ritorna i dati dell'utente loggato
 */
export function getMe() {
    return getJson<MeResponse>("/auth/me");
}

/**
 * POST o DELETE /auth/logout
 * invalida la sessione / refresh token
 */
export function logout() {
    return deleteJson<void>("/auth/logout");
}
