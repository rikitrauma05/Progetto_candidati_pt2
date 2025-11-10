export type Posizione = {
    idPosizione: number;               // Chiave primaria
    titolo: string;                    // Titolo della posizione
    descrizione?: string | null;       // Testo descrittivo
    sede?: string | null;              // Sede di lavoro
    contratto?: string | null;         // Tipo di contratto
    RAL?: number | null;               // Retribuzione annua lorda
    candidatureRicevute: number;       // Numero di candidature ricevute
    idStatoPosizione: number;          // FK -> STATO_POSIZIONE
    pubblicataAt?: string | null;      // Data pubblicazione
    chiusaAt?: string | null;          // Data chiusura
    createdByHR: number;               // FK -> UTENTE (HR che l’ha creata)
    idSettore: number;                 // FK -> SETTORE
};
