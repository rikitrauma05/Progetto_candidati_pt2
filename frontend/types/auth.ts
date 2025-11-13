import type { User } from "./user";

export type RuoloCodice = "CANDIDATO" | "HR" | "ADMIN";

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    email: string;
    password: string;
    nome: string;
    cognome: string;
    ruolo: RuoloCodice;       // di solito "CANDIDATO" o "HR"
    consensoPrivacy: boolean;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
};

export type RefreshTokenResponse = {
    accessToken: string;
};

export type MeResponse = User;
