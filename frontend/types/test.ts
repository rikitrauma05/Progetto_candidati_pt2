export type TestType = "SOFT_SKILLS" | "TECNICO";

export type EsitoTentativoCodice =
    | "IN_CORSO"
    | "SUPERATO"
    | "NON_SUPERATO"
    | "SCADUTO";

export type TestListItem = {
    idTest: number;
    titolo: string;
    tipo: TestType;
    durataMinuti: number;
};

export type TentativoListItem = {
    idTentativo: number;
    idTest: number;
    testTitolo: string;
    tipo: TestType;
    idPosizione?: number | null;
    posizioneTitolo?: string | null;
    punteggioTotale?: number | null;
    esito: EsitoTentativoCodice;
    iniziatoAt: string;
    completatoAt?: string | null;
};

export type AvviaTestRequest = {
    idCandidatura: number;
    idTest: number;
};

export type AvviaTestResponse = {
    idTentativo: number;
    scadeAlle: string;
};

export type DomandaDTO = {
    idDomanda: number;
    testo: string;
    ordine: number;
    opzioni: {
        idOpzione: number;
        testo: string;
    }[];
};

export type GetDomandeResponse = {
    idTest: number;
    titolo: string;
    durataMinuti: number;
    domande: DomandaDTO[];
};

export type RispostaDTO = {
    idDomanda: number;
    idOpzione: number;
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
