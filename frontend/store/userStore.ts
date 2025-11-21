"use client";

import { create } from "zustand";
import { getProfiloCandidato } from "@/services/user.service";

export type UserProfile = {
    idUtente: number;
    nome: string;
    cognome: string;
    email: string;
    ruolo: string;
    telefono?: string;
    citta?: string;
    dataNascita?: string;
};

type UserStoreState = {
    profilo: UserProfile | null;
    loading: boolean;
    error: string | null;
};

type UserStoreActions = {
    fetchProfilo: () => Promise<void>;
    setProfilo: (profilo: UserProfile | null) => void;
    clear: () => void;
};

type UserStore = UserStoreState & UserStoreActions;

export const useUserStore = create<UserStore>((set) => ({
    profilo: null,
    loading: false,
    error: null,

    async fetchProfilo() {
        try {
            set({ loading: true, error: null });
            // chiamata al servizio che dovrai implementare in user.service.ts
            const data = await getProfiloCandidato();
            set({ profilo: data, loading: false, error: null });
        } catch (err: any) {
            console.error("Errore nel caricamento del profilo:", err);
            set({
                loading: false,
                error:
                    err?.message ??
                    "Errore nel recupero del profilo utente.",
                profilo: null,
            });
        }
    },

    setProfilo(profilo) {
        set({ profilo });
    },

    clear() {
        set({ profilo: null, loading: false, error: null });
    },
}));
