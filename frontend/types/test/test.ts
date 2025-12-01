// test.ts

export type TestType = "SOFT_SKILLS" | "TECNICO";

/* --- LISTA TEST --- */
export type TestListItem = {
    idTest: number;
    titolo: string;
    tipo: TestType | string | null | undefined;
    durataMinuti: number;
    descrizione?: string | null;
    punteggioMax?: number | null;
};

/* --- STRUTTURA TEST COMPLETA (per HR) --- */

// Opzione come arriva da /api/test/{id}/struttura
export type StrutturaTestOpzioneDto = {
    idOpzione: number;
    testoOpzione: string;
    isCorretta: boolean; // <- flag di correttezza
};

// Domanda come arriva da /api/test/{id}/struttura
export type StrutturaTestDomandaDto = {
    idDomanda: number;
    testo: string;
    opzioni: StrutturaTestOpzioneDto[];
};

// DTO completo usato da DettaglioTest
export type StrutturaTestDto = {
    idTest: number;
    titolo: string;
    descrizione?: string | null;
    durataMinuti: number;
    numeroDomande: number;
    punteggioMax: number;
    punteggioMin?: number | null;
    tipo?: string | null;
    domande: StrutturaTestDomandaDto[];
};

/* --- CREAZIONE TEST (HR) --- */

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
    codiceTipoTest: TestType;
    domande: DomandaCreateRequest[];
};
