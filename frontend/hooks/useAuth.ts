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

    const { isAuthenticated, user, hydrated } = useAuthStore();

    useEffect(() => {
        // Finché Zustand NON ha ricaricato i dati, non fare redirect
        if (!hydrated) return;

        if (!pathname) return;

        const isPublic = PUBLIC_ROUTES.some(
            (p) => pathname === p || pathname.startsWith(p + "/")
        );

        // Se la pagina è pubblica, lascia passare
        if (isPublic) return;

        // Se NON autenticato → redirect al login
        if (!isAuthenticated) {
            router.replace("/auth/login");
            return;
        }

        // Controllo ruolo HR
        if (pathname.startsWith("/hr") && user?.ruolo !== "HR") {
            router.replace("/");
            return;
        }

        // Controllo ruolo CANDIDATO
        if (pathname.startsWith("/candidati") && user?.ruolo !== "CANDIDATO") {
            router.replace("/");
            return;
        }
    }, [hydrated, isAuthenticated, user, pathname, router]);
}
