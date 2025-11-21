// frontend/services/user.service.ts
import { getJson, postJson, putJson } from "./api"; // presuppone che tu abbia queste funzioni
import type { UserProfile } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";

export type Candidato = {
    idUtente: number;
    nome: string;
    cognome: string;
    email: string;
    citta: string;
    dataNascita: string;
    telefono?: string;
    // campi opzionali usati nella lista HR
    ultimaPosizione?: string;
    punteggioTotale?: number;
};

/**
 * Recupera il profilo dell'utente loggato.
 */
export async function getProfiloCandidato(): Promise<UserProfile> {
    const { user } = useAuthStore.getState();

    if (!user) {
        throw new Error(
            "Nessun utente presente nell'authStore. Effettua il login prima di chiamare getProfiloCandidato."
        );
    }

    const id = (user as any).idUtente;
    if (!id) {
        throw new Error(
            "ID utente non presente nell'oggetto user. Controlla il tipo User."
        );
    }

    return getJson<UserProfile>(`/utenti/${id}`);
}

/**
 * Aggiorna i dati del profilo dell'utente loggato.
 *
 * Backend atteso:
 *   PUT /api/utenti/{id}
 */
export async function updateProfiloCandidato(profilo: Partial<UserProfile>): Promise<UserProfile> {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error("Utente non loggato");

    const id = (user as any).idUtente;
    if (!id) throw new Error("ID utente mancante");

    return putJson<UserProfile>(`/utenti/${id}`, profilo);
}

/**
 * Upload del CV dell'utente loggato.
 *
 * Backend atteso:
 *   POST /api/utenti/{id}/cv
 */
/*export async function uploadCv(file: File): Promise<void> {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error("Utente non loggato");

    const id = (user as any).idUtente;
    if (!id) throw new Error("ID utente mancante");

    const formData = new FormData();
    formData.append("cv", file);

    await uploadFile(`/utenti/${id}/cv`, formData);
}*/

/**
 * Restituisce la lista dei candidati visibile all'HR.
 *
 * Backend atteso:
 *   GET /api/hr/candidati
 */
export async function getCandidati(): Promise<Candidato[]> {
    return getJson<Candidato[]>("/hr/candidati");
}
