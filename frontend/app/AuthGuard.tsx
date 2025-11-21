"use client";

import type { ReactNode } from "react";
import { useAuthGuard } from "@/hooks/useAuth";

/**
 * Wrapper globale che applica le regole di accesso:
 * - route pubbliche: "/", "/auth/login", "/auth/register"
 * - route /hr solo per ruolo HR
 * - route /candidati solo per ruolo CANDIDATO
 *
 * La logica è tutta in useAuthGuard; qui ci limitiamo a chiamarlo.
 */
export default function AuthGuard({ children }: { children: ReactNode }) {
    useAuthGuard();
    return <>{children}</>;
}
