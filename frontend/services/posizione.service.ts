// frontend/services/posizione.service.ts

import { getJson, postJson, deleteJson } from "./api";
import type { Posizione } from "@/types/posizione";

/**
 * Lista di tutte le posizioni visibili al candidato.
 */
export async function fetchPosizioni(): Promise<Posizione[]> {
    return getJson<Posizione[]>("/posizioni");
}

/**
 * Dettaglio di una singola posizione.
 */
export async function getPosizioneById(
    idPosizione: number | string
): Promise<Posizione> {
    return getJson<Posizione>(`/posizioni/${idPosizione}`);
}

/**
 * Lista delle posizioni preferite dell'utente loggato.
 */
export async function fetchPosizioniPreferite(): Promise<Posizione[]> {
    return getJson<Posizione[]>("/posizioni/preferite");
}

export type PreferitoStatus = {
    isPreferita: boolean;
};

/**
 * Restituisce se una posizione è nei preferiti dell'utente loggato.
 */
export async function isPosizionePreferita(
    idPosizione: number | string
): Promise<boolean> {
    const res = await getJson<PreferitoStatus>(
        `/posizioni/${idPosizione}/preferiti`
    );
    return !!res.isPreferita;
}

/**
 * Imposta esplicitamente lo stato di preferito/non preferito.
 * Se preferita = true → aggiunge ai preferiti (POST).
 * Se preferita = false → rimuove dai preferiti (DELETE).
 */
export async function setPosizionePreferita(
    idPosizione: number | string,
    preferita: boolean
): Promise<PreferitoStatus> {
    const path = `/posizioni/${idPosizione}/preferiti`;

    if (preferita) {
        // Aggiunge ai preferiti
        return postJson<PreferitoStatus>(path);
    } else {
        // Rimuove dai preferiti
        return deleteJson<PreferitoStatus>(path);
    }
}

/**
 * Comoda funzione per fare toggle lato client:
 * passa lo stato corrente e lo inverte.
 */
export async function togglePosizionePreferita(
    idPosizione: number | string,
    isCurrentlyPreferita: boolean
): Promise<PreferitoStatus> {
    return setPosizionePreferita(idPosizione, !isCurrentlyPreferita);
}
