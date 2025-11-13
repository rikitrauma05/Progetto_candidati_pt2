import type { RuoloCodice } from "./auth";

export type User = {
    idUtente: number;
    email: string;
    nome: string;
    cognome: string;
    ruolo: RuoloCodice;
    dataNascita?: string | null;
    telefono?: string | null;
    citta?: string | null;
    lingua?: string | null;
    consensoPrivacy: boolean;
    cvUrl?: string | null;
};

export type UpdateProfiloCandidatoRequest = {
    nome?: string;
    cognome?: string;
    dataNascita?: string | null;
    telefono?: string | null;
    citta?: string | null;
    lingua?: string | null;
    cvUrl?: string | null;
};

export type UpdatePasswordRequest = {
    oldPassword: string;
    newPassword: string;
};
