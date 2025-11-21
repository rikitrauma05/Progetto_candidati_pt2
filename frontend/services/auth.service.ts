// frontend/services/auth.service.ts
import { getJson, postJson, deleteJson, API_BASE_URL } from "./api";
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
 *
 * NB: questo servizio NON salva nulla nello store.
 * Sarà la pagina di login a chiamare:
 *   const resp = await login(payload);
 *   useAuthStore.getState().login(resp.user, { accessToken: resp.accessToken, refreshToken: resp.refreshToken });
 */
export function login(payload: LoginRequest) {
    return postJson<LoginResponse, LoginRequest>("/auth/login", payload);
}

/**
 * POST /auth/register (multipart/form-data)
 * parts:
 *   - payload: JSON con i dati di registrazione (RegisterRequest)
 *   - cv: file opzionale
 *
 * Backend (AuthController):
 *   @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
 *   public ResponseEntity<?> register(
 *       @Valid @RequestPart("payload") RegisterRequest req,
 *       @RequestPart(value = "cv", required = false) MultipartFile cvFile
 *   )
 */
export async function register(
    payload: RegisterRequest,
    cvFile?: File | null
): Promise<LoginResponse> {
    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
    });
    formData.append("payload", jsonBlob);

    if (cvFile) {
        formData.append("cv", cvFile);
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        body: formData,
        // niente Content-Type: lo imposta il browser con il boundary del multipart
    });

    if (!response.ok) {
        let message = `Errore HTTP ${response.status}`;
        try {
            const data = await response.json();
            if (typeof data === "string") {
                message = data;
            } else if (data?.message) {
                message = data.message;
            }
        } catch {
            // se non è JSON, teniamo il messaggio generico
        }
        throw new Error(message);
    }

    return (await response.json()) as LoginResponse;
}

/**
 * POST /auth/refresh
 * body: { refreshToken }
 * response: { accessToken }
 * (solo se implementato nel backend)
 */
export function refreshToken(refreshToken: string) {
    return postJson<RefreshTokenResponse, { refreshToken: string }>(
        "/auth/refresh",
        { refreshToken }
    );
}

/**
 * GET /auth/me
 * ritorna i dati dell'utente loggato (se implementato nel backend)
 */
export function getMe() {
    return getJson<MeResponse>("/auth/me");
}

/**
 * DELETE /auth/logout
 * invalida la sessione / refresh token (se implementato)
 * NB: lato frontend comunque facciamo sempre logout() sullo store.
 */
export function logout() {
    return deleteJson<void>("/auth/logout");
}
