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

/* --- STRUTTURA TEST COMPLETA --- */
export type OpzioneTest = {
    idOpzione: number;
    testoOpzione: string;
    corretta: boolean | null;
};

export interface DomandaTest {
    idDomanda: number;
    testo: string;
    opzioni: {
        idOpzione: number;
        testoOpzione: string;
    }[];
}

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
