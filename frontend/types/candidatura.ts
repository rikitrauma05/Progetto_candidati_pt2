export type StatoCandidaturaCodice =
    | "INVIATA"
    | "IN_VALUTAZIONE"
    | "SCARTATA"
    | "COLLOQUIO"
    | "ASSUNTO";

export type CandidaturaForCandidate = {
    idCandidatura: number;
    idPosizione: number;
    titoloPosizione: string;
    sede?: string | null;
    contratto?: string | null;
    stato: StatoCandidaturaCodice;
    createdAt: string;
};

export type CandidaturaForHR = {
    idCandidatura: number;
    idCandidato: number;
    nome: string;
    cognome: string;
    email: string;
    stato: StatoCandidaturaCodice;
    createdAt: string;
};

export type CreateCandidaturaRequest = {
    idPosizione: number;
};

export type UpdateStatoCandidaturaRequest = {
    stato: StatoCandidaturaCodice;
    esitoNote?: string | null;
};
