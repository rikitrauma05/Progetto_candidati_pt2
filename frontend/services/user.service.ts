// frontend/services/user.service.ts
import { getJson } from "./api";
import type { UserProfile } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";

/**
 * Recupera il profilo dell'utente loggato partendo dallo user salvato
 * nell'authStore (quello che arriva dalla login).
 *
 * Backend:
 *   GET /api/utenti/{id}
 * Frontend (getJson):
 *   chiama "/api" + "/utenti/{id}" -> "/api/utenti/{id}"
 */
export async function getProfiloCandidato(): Promise<UserProfile> {
    const { user } = useAuthStore.getState();

    if (!user) {
        throw new Error("Utente non presente nello stato di autenticazione.");
    }

    // ATTENZIONE:
    // qui assumo che il tipo User abbia un campo "idUtente".
    // Se nel tuo /types/user.ts il campo si chiama in un altro modo
    // (es. "id" o "id_user"), sostituisci "idUtente" con il nome corretto.
    const id = (user as any).idUtente;

    if (!id) {
        throw new Error(
            "ID utente non presente nell'oggetto User. Controlla il tipo User in /types/user.ts."
        );
    }

    return getJson<UserProfile>(`/utenti/${id}`);
}
