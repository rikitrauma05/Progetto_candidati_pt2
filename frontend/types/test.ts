// frontend/types/test.ts

export type TestType = "SOFT_SKILLS" | "TECNICO";

export type EsitoTentativoCodice =
    | "IN_CORSO"
    | "SUPERATO"
    | "NON_SUPERATO"
    | "SCADUTO";

export type TestListItem = {
    idTest: number;
    titolo: string;
    tipo: TestType | string | null | undefined;
    durataMinuti: number;
    descrizione?: string | null;
    punteggioMax?: number | null;
};

export type TentativoListItem = {
    idTentativo: number;
    idTest: number;
    titoloTest: string;
    durataMinuti: number;
    punteggioTotale: number | null;
    punteggioMax: number;
    esito: EsitoTentativoCodice;
    completatoAt: string | null;
};

export type OpzioneTest = {
    idOpzione: number;
    testoOpzione: string;
    corretta: boolean | null;
};

export type DomandaTest = {
    idDomanda: number;
    testo: string;
    opzioni: OpzioneTest[];
};

export type StrutturaTestDto = {
    idTest: number;
    titolo: string;
    descrizione?: string | null;
    durataMinuti: number;
    numeroDomande: number;
    punteggioMax: number;
    punteggioMin?: number | null;
    tipo?: string | null;
    domande: DomandaTest[];
};

// ---- CREAZIONE TEST (LATO HR) ----

export type OpzioneCreateRequest = {
    testoOpzione: string;
    corretta: boolean;
};

export type DomandaCreateRequest = {
    testo: string;
    punteggio: number;
    opzioni: OpzioneCreateRequest[];
};

export type TestCreateRequest = {
    titolo: string;
    descrizione?: string | null;
    durataMinuti: number;
    numeroDomande: number;
    punteggioMax: number;
    punteggioMin?: number | null;

    // codice del tipo test: "SOFT_SKILLS", "TECNICO", ...
    codiceTipoTest: TestType;

    domande: DomandaCreateRequest[];
};

// ---- AVVIO / RISPOSTE / RISULTATI (come prima) ----

export type AvviaTestRequest = {
    idPosizione?: number;
};

export type AvviaTestResponse = {
    idTentativo: number;
    idTest: number;
    iniziatoAt: string;
};

export type GetDomandeResponse = {
    idTentativo: number;
    idTest: number;
    titoloTest: string;
    durataMinuti: number;
    domande: DomandaTest[];
};

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
    punteggioMax: number;
    esito: EsitoTentativoCodice;
};

export type RisultatoTentativoDettaglio = {
    idTentativo: number;
    idTest: number;
    titoloTest: string;
    punteggioTotale: number;
    punteggioMax: number;
    punteggioMin?: number | null;
    esito: EsitoTentativoCodice;
    completatoAt: string;
    durataUsataMinuti?: number | null;
    numeroDomande: number;
    numeroCorrette: number;
    numeroErrate: number;
    numeroNonRisposte: number;
};
