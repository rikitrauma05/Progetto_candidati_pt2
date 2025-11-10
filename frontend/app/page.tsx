"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/**
 * Home di ingresso del sito.
 * Reindirizza in base allo stato/ruolo:
 * - non autenticato  -> /auth/login
 * - HR               -> /hr/dashboard
 * - CANDIDATO        -> /candidati/profili
 */
export default function HomeRedirect() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/auth/login");
            return;
        }
        if (user?.ruolo === "HR") {
            router.replace("/hr/dashboard");
        } else {
            router.replace("/candidati/profili");
        }
    }, [isAuthenticated, user, router]);

    return (
        <main className="min-h-dvh flex items-center justify-center">
            <p className="text-sm text-[var(--muted)]">Reindirizzamento…</p>
        </main>
    );
}
