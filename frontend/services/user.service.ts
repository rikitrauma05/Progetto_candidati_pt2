// frontend/services/user.service.ts
import {API_BASE_URL, deleteJson, getJson, postJson, putJson} from "./api"; // presuppone che tu abbia queste funzioni
import type { UserProfile } from "@/store/userStore";
import type { UpdateProfiloCandidatoRequest, UpdatePasswordRequest } from "@/types/user";
import { useAuthStore } from "@/store/authStore";

export type Candidato = {
    idCandidato: number;
    idUtente: {
        idUtente: number;
        nome: string;
        cognome: string;
        email: string;
        telefono?: string | null;
        citta?: string | null;
    };
    active: boolean;
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
export async function updateProfiloCandidato(    payload: UpdateProfiloCandidatoRequest,
                                                 cvFile?: File | null): Promise<UserProfile> {
    const { user, accessToken} = useAuthStore.getState();
    if (!user) throw new Error("Utente non loggato");

    const id = (user as any).idUtente;
    if (!id) throw new Error("ID utente mancante");

    const formData = new FormData();
    formData.append(
        "payload",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (cvFile) {
        formData.append("cv", cvFile);
    }

    const resp = await fetch(`${API_BASE_URL}/utenti/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
    });

    if (!resp.ok) {
        let message = `Errore HTTP ${resp.status}`;
        try {
            const data = await resp.json();
            if ((data as any)?.message) message = (data as any).message;
        } catch {
            // ignore
        }
        throw new Error(message);
    }

    return (await resp.json()) as UserProfile;
}

export async function updatePassword(
    body: UpdatePasswordRequest
): Promise<void> {
    const { user, accessToken } = useAuthStore.getState();
    if (!user) throw new Error("Utente non loggato");

    const id = (user as any).idUtente;
    if (!id) throw new Error("ID utente mancante");

    const resp = await fetch(`${API_BASE_URL}/utenti/${id}/password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
    });

    if (!resp.ok) {
        let message = `Errore HTTP ${resp.status}`;
        try {
            const data = await resp.json();
            if ((data as any)?.message) message = (data as any).message;
        } catch {}
        throw new Error(message);
    }
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

/**
 * Dettaglio singolo candidato HR
 */
export async function getCandidatoById(id: number): Promise<Candidato> {
    return getJson<Candidato>(`/hr/candidati/${id}`);
}

/**
 * Aggiorna un candidato (PUT /api/hr/candidati/{id})
 * Qui passiamo un oggetto Candidato completo.
 */
export async function updateCandidato(
    id: number,
    payload: Candidato
): Promise<Candidato> {
    return putJson<Candidato, Candidato>(`/hr/candidati/${id}`, payload);
}

/**
 * Elimina un candidato (DELETE /api/hr/candidati/{id})
 */
export async function deleteCandidato(id: number): Promise<void> {
    return deleteJson<void>(`/hr/candidati/${id}`);
}
