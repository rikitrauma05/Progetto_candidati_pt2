"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

export function useUser() {
    const { isAuthenticated } = useAuthStore();
    const { profilo, loading, error, fetchProfilo } = useUserStore();

    useEffect(() => {
        if (!isAuthenticated) return;

        // Se non abbiamo ancora il profilo, lo carichiamo
        if (!profilo) {
            fetchProfilo();
        }
    }, [isAuthenticated, profilo, fetchProfilo]);

    return {
        profilo,
        loading,
        error,
        reload: fetchProfilo,
    };
}
