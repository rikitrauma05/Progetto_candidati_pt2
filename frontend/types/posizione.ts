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
 * Tipo principale per le posizioni.
 * Manteniamo sia "idPosizione" (backend) sia "id" (frontend/React keys).
 */
export type Posizione = {
    id: number | string;      // usato dai componenti React (PosizioneCard)
    idPosizione: number;      // PK dal backend
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

    // id del test associato alla posizione (colonna idTest in backend)
    idTest?: number | null;
};
