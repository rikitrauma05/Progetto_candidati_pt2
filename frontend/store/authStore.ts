"use client";

import { create } from "zustand";

type User = {
    id: number | string;
    nome: string;
    cognome: string;
    email: string;
    ruolo: "CANDIDATO" | "HR";
};

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    login: (user) =>
        set({
            user,
            isAuthenticated: true,
        }),

    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),
}));
