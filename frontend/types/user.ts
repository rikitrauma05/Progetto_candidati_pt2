export type User = {
    id: number | string;
    nome: string;
    cognome: string;
    email: string;
    ruolo?: "CANDIDATO" | "HR";
    telefono?: string;
    citta?: string;
};
