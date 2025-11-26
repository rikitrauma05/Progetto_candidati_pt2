"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
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

    hydrated: boolean; // nuovo flag

    login: (user: User, tokens?: Tokens) => void;
    logout: () => void;

    setUser: (user: User | null) => void;
    setTokens: (tokens: Partial<Tokens>) => void;

    setHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,

            hydrated: false,

            login: (user, tokens) =>
                set(() => ({
                    user,
                    isAuthenticated: true,
                    accessToken: tokens?.accessToken ?? null,
                    refreshToken: tokens?.refreshToken ?? null,
                })),

            logout: () =>
                set(() => ({
                    user: null,
                    isAuthenticated: false,
                    accessToken: null,
                    refreshToken: null,
                })),

            setUser: (user) =>
                set((state) => ({
                    ...state,
                    user,
                    isAuthenticated: !!user,
                })),

            setTokens: (tokens) =>
                set((state) => ({
                    ...state,
                    accessToken: tokens.accessToken ?? state.accessToken,
                    refreshToken: tokens.refreshToken ?? state.refreshToken,
                })),

            setHydrated: (v) => set({ hydrated: v }),
        }),

        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),

            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHydrated(true);
                }
            },
        }
    )
);
