// tentativo-test.ts

export type EsitoTentativoCodice =
    | "IN_CORSO"
    | "SUPERATO"
    | "NON_SUPERATO"
    | "SCADUTO";

/* --- LISTA TENTATIVI (solo candidato) --- */
export type TentativoListItem = {
    idTentativo: number;
    idTest: number;
    titoloTest: string;
    durataMinuti: number;
    punteggioTotale: number | null;
    esito: EsitoTentativoCodice;
    completatoAt: string | null;
};

/* --- AVVIO TEST --- */
export type AvviaTestRequest = {
    idPosizione?: number;
};

export type AvviaTestResponse = {
    idTentativo: number;
    idTest: number;
    iniziatoAt: string;
};
/* --- DOMANDE PER L'ESECUZIONE --- */
export type GetDomandeResponse = {
    idTentativo: number;
    idTest: number;
    titoloTest: string;
    durataMinuti: number;
    domande: {
        idDomanda: number;
        testo: string;
        opzioni: {
            idOpzione: number;
            testoOpzione: string;
        }[];
    }[];
};

/* --- INVIA RISPOSTE --- */
export type RispostaDTO = {
    idDomanda: number;
    idOpzione: number | null;
};

export type InviaRisposteRequest = {
    idTentativo: number;
    risposte: RispostaDTO[];
};

export type InviaRisposteResponse = {
    idTentativo: number;
    punteggioTotale: number;
    esito: EsitoTentativoCodice;
};

/* --- RISULTATO FINALE --- */
export type RisultatoTentativoDettaglio = {
    idTentativo: number;
    idTest: number;
    titoloTest: string;
    punteggioTotale: number;
    punteggioMin?: number | null;
    esito: EsitoTentativoCodice;
    completatoAt: string;
    durataUsataMinuti?: number | null;
    numeroDomande: number;
    numeroCorrette: number;
    numeroErrate: number;
    numeroNonRisposte: number;
};
