// frontend/types/posizione.ts

export type Utente = {
    idUtente: number;
    email: string;
    nome: string;
    cognome: string;
};

export type StatoPosizione = {
    idStatoPosizione: number;
    codice: string;
    descrizione: string;
};

export type Settore = {
    idSettore: number;
    codice: string;
    nome: string;
    descrizione: string;
};

/**
 * Tipo principale di una Posizione lavorativa.
 * Include sia "idPosizione" (come nel backend)
 * sia "id" per compatibilità con i componenti React.
 */
export type Posizione = {
    id: number | string;              // usato dal frontend (PosizioneCard)
    idPosizione: number;              // chiave primaria dal backend
    titolo: string;
    descrizione?: string;
    sede?: string;
    contratto?: string;
    candidatureRicevute?: number;
    pubblicataAt?: string;
    chiusaAt?: string | null;
    ral?: number;
    createdByHR?: Utente;
    idStatoPosizione?: StatoPosizione;
    idSettore?: Settore;
};
