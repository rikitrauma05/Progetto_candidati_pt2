"use client";

import { create } from "zustand";
import type { User } from "@/types/user";

type Tokens = {
    accessToken: string;
    refreshToken: string;
};

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;

    // azioni principali
    login: (user: User, tokens?: Tokens) => void;
    logout: () => void;

    // utility, nel caso vengano usate altrove
    setUser: (user: User | null) => void;
    setTokens: (tokens: Partial<Tokens>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,

    /**
     * Login: imposta utente, flag e (se presenti) i token JWT.
     * La seconda argomento è opzionale, così NON rompiamo le chiamate esistenti
     * che usavano solo login(user).
     */
    login: (user, tokens) =>
        set(() => ({
            user,
            isAuthenticated: true,
            accessToken: tokens?.accessToken ?? null,
            refreshToken: tokens?.refreshToken ?? null,
        })),

    /**
     * Logout: pulisce utente e token.
     */
    logout: () =>
        set(() => ({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
        })),

    /**
     * Aggiorna solo l'utente (utile se in futuro fai una pagina "modifica profilo").
     */
    setUser: (user) =>
        set((state) => ({
            ...state,
            user,
            isAuthenticated: !!user,
        })),

    /**
     * Aggiorna solo i token (può essere usato per il refresh).
     */
    setTokens: (tokens) =>
        set((state) => ({
            ...state,
            accessToken: tokens.accessToken ?? state.accessToken,
            refreshToken: tokens.refreshToken ?? state.refreshToken,
        })),
}));
