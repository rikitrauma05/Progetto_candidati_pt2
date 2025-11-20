"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/**
 * Rotte accessibili senza autenticazione.
 * Qui lasciamo:
 * - home pubblica
 * - login
 * - registrazione
 */
const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register"];

export function useAuth() {
    return useAuthStore();
}

/**
 * Hook di guardia: impedisce l'accesso alle pagine private
 * se l'utente non è autenticato, e gestisce i ruoli base.
 *
 * Da usare dentro i layout / pagine che vuoi proteggere:
 *
 *   useAuthGuard();
 */
export function useAuthGuard() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (!pathname) return;

        const isPublic = PUBLIC_ROUTES.some((p) =>
            pathname === p || pathname.startsWith(p + "/")
        );

        // Se la rotta è pubblica, non facciamo niente
        if (isPublic) return;

        // Se non è autenticato, lo rimandiamo al login
        if (!isAuthenticated) {
            router.replace("/auth/login");
            return;
        }

        // Se è autenticato, controlliamo i ruoli base:
        // - rotte /hr solo per HR
        // - rotte /candidati solo per CANDIDATO
        if (pathname.startsWith("/hr") && user?.ruolo !== "HR") {
            router.replace("/");
            return;
        }

        if (pathname.startsWith("/candidati") && user?.ruolo !== "CANDIDATO") {
            router.replace("/");
            return;
        }
    }, [isAuthenticated, user, pathname, router]);
}
