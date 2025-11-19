import {getJson, postJson, deleteJson, postFormData} from "./api";
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
 * REGISTER con CV: invia multipart/form-data
 * - payload: RegisterRequest serializzato in JSON
 * - cv: file (opzionale)
 */
export function register(payload: RegisterRequest, cvFile?: File | null) {

    const formData = new FormData();

    // parte "payload" come JSON (Content-Type: application/json)
    const jsonBlob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
    });
    formData.append("payload", jsonBlob);

    // parte "cv" come file (se presente)
    if (cvFile) {
        formData.append("cv", cvFile);
    }

    return postFormData<LoginResponse>("/auth/register", formData);
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
