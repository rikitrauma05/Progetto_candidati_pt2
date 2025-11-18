// /src/types/test.ts
// Tipi condivisi per la gestione dei test e dei tentativi

export type TestType = "SOFT_SKILLS" | "TECNICO";

export type EsitoTentativoCodice =
    | "IN_CORSO"
    | "SUPERATO"
    | "NON_SUPERATO"
    | "SCADUTO";

// ---- LISTE / OVERVIEW ----

// Test mostrati nella lista "test disponibili"
export type TestListItem = {
    idTest: number;
    titolo: string;
    tipo: TestType;
    durataMinuti: number;
    // opzionali, se il backend li espone
    descrizione?: string | null;
    punteggioMax?: number;
};

// Tentativi mostrati nello storico del candidato
export type TentativoListItem = {
    idTentativo: number;
    idTest: number;
    titoloTest: string;
    durataMinuti: number;
    punteggioTotale: number | null;
    punteggioMax: number;
    esito: EsitoTentativoCodice;
    completatoAt: string | null; // ISO datetime o null se in corso
};

// ---- STRUTTURA TEST ----

export type OpzioneTest = {
    idOpzione: number;
    testoOpzione: string;
};

export type DomandaTest = {
    idDomanda: number;
    testo: string;
    opzioni: OpzioneTest[];
};

// DTO usato per la pagina di introduzione (e volendo per il tentativo)
export type StrutturaTestDto = {
    idTest: number;
    titolo: string;
    descrizione?: string | null;
    tipo?: TestType;
    durataMinuti: number;
    numeroDomande: number;
    punteggioMax: number;
    punteggioMin?: number;
    domande: DomandaTest[];
};

// ---- AVVIO TEST / DOMANDE PER TENTATIVO ----

// body per POST /test/{idTest}/tentativi/avvia
export type AvviaTestRequest = {
    // opzionale: se vuoi legare il tentativo a una posizione/candidatura
    idPosizione?: number;
};

// response di avvio tentativo
export type AvviaTestResponse = {
    idTentativo: number;
    idTest: number;
    iniziatoAt: string; // ISO datetime
};

// response per GET /test/tentativi/{idTentativo}/domande
export type GetDomandeResponse = {
    idTentativo: number;
    idTest: number;
    titoloTest: string;
    durataMinuti: number;
    domande: DomandaTest[];
};

// ---- INVIO RISPOSTE ----

// singola risposta a una domanda
export type RispostaDTO = {
    idDomanda: number;
    idOpzione: number | null; // null se non risponde
};

// body per POST /test/tentativi/{idTentativo}/risposte
export type InviaRisposteRequest = {
    idTentativo: number;
    risposte: RispostaDTO[];
};

// response dopo l’invio risposte
export type InviaRisposteResponse = {
    idTentativo: number;
    punteggioTotale: number;
    punteggioMax: number;
    esito: EsitoTentativoCodice;
};

// ---- RISULTATI DETTAGLIATI ----

// GET /test/tentativi/{idTentativo}/risultati
export type RisultatoTentativoDettaglio = {
    idTentativo: number;
    idTest: number;
    titoloTest: string;
    punteggioTotale: number;
    punteggioMax: number;
    punteggioMin?: number;
    esito: EsitoTentativoCodice;
    completatoAt: string;
    durataUsataMinuti?: number | null;

    numeroDomande: number;
    numeroCorrette: number;
    numeroErrate: number;
    numeroNonRisposte: number;
};
