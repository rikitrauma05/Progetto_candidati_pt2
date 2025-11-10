import { getJson } from "./api";

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

export type Posizione = {
    idPosizione: number;
    titolo: string;
    descrizione: string;
    sede: string;
    contratto: string;
    candidatureRicevute: number;
    pubblicataAt: string;
    chiusaAt: string | null;
    createdByHR: Utente;
    idStatoPosizione: StatoPosizione;
    idSettore: Settore;
    ral: number;
};

export async function getTopQuattroPosizioni() {
    return getJson<Posizione[]>("/posizioni/topquattro");
}
