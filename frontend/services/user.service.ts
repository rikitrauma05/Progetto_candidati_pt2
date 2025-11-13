import { getJson, putJson, patchJson } from "./api";
import type {
    User,
    UpdateProfiloCandidatoRequest,
    UpdatePasswordRequest,
} from "@/types/user";

/**
 * GET /user/me
 * Dettaglio profilo candidato/HR.
 */
export function getProfilo() {
    return getJson<User>("/user/me");
}

/**
 * PUT /user/me
 * Aggiorna i dati anagrafici.
 */
export function updateProfilo(payload: UpdateProfiloCandidatoRequest) {
    return putJson<User, UpdateProfiloCandidatoRequest>("/user/me", payload);
}

/**
 * PATCH /user/password
 * Cambio password dato oldPassword + newPassword.
 */
export function updatePassword(payload: UpdatePasswordRequest) {
    return patchJson<void, UpdatePasswordRequest>(
        "/user/password",
        payload
    );
}
