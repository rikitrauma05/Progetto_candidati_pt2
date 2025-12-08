"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import axios from "axios";

type Tokens = {
    accessToken: string;
    refreshToken: string;
};

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;

    hydrated: boolean;

    login: (user: User, tokens?: Tokens) => void;
    logout: () => void;

    setUser: (user: User | null) => void;
    setTokens: (tokens: Partial<Tokens>) => void;

    refreshAccessToken: () => Promise<string | null>;

    setHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
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

            logout: () => {
                set(() => ({
                    user: null,
                    isAuthenticated: false,
                    accessToken: null,
                    refreshToken: null,
                }));

                try {
                    useAuthStore.persist.clearStorage();
                    localStorage.removeItem("auth-storage");
                } catch (error) {
                    console.error("Errore pulizia storage:", error);
                }
            },

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

            refreshAccessToken: async () => {
                const refreshToken = get().refreshToken;
                if (!refreshToken) return null;

                try {
                    const res = await axios.post(
                        "http://localhost:8080/api/auth/refresh",
                        { refreshToken }
                    );

                    const newAccess = res.data.accessToken;

                    set({ accessToken: newAccess });

                    return newAccess;
                } catch (err) {
                    console.log("Refresh token failed", err);
                    get().logout();
                    return null;
                }
            },

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
                if (state) state.setHydrated(true);
            },
        }
    )
);
