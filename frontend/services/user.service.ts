// frontend/services/user.service.ts
import { getJson } from "./api";
import type { UserProfile } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";

export type Candidato = {
    idUtente: number;
    nome: string;
    cognome: string;
    email: string;
    // campi opzionali usati nella lista HR
    ultimaPosizione?: string;
    punteggioTotale?: number;
};

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
        throw new Error(
            "Nessun utente presente nell'authStore. Effettua il login prima di chiamare getProfiloCandidato."
        );
    }

    // ATTENZIONE:
    // qui assumo che il tipo User abbia un campo "idUtente".
    // Se nel tuo tipo User il campo ha un altro nome, cambialo qui.
    const id = (user as any).idUtente;

    if (!id) {
        throw new Error(
            "ID utente non presente nell'oggetto user. Controlla il tipo User in /store/userStore o /types/user.ts."
        );
    }

    return getJson<UserProfile>(`/utenti/${id}`);
}

/**
 * Restituisce la lista dei candidati visibile all'HR.
 *
 * Backend atteso:
 *   GET /api/hr/candidati
 * Frontend (getJson):
 *   chiama "/api" + "/hr/candidati" -> "/api/hr/candidati"
 */
export async function getCandidati(): Promise<Candidato[]> {
    return getJson<Candidato[]>("/hr/candidati");
}
