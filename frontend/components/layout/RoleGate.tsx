"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/**
 * Controlla il ruolo dell'utente e mostra i contenuti solo se autorizzato.
 * In caso contrario effettua il redirect alla pagina di login.
 */
export default function RoleGate({
                                     roles,
                                     children,
                                 }: {
    roles: string[];
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        if (user && !roles.includes(user.ruolo)) {
            router.push("/");
        }
    }, [isAuthenticated, user, roles, router]);

    if (!isAuthenticated) return null;

    return <>{children}</>;
}
