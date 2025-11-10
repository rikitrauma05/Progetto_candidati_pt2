"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Logout() {
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);

    useEffect(() => {
        // TODO: se/quando avrai l'API: await authService.logout();
        logout();                 // pulizia stato globale
        const t = setTimeout(() => {
            router.replace("/auth/login"); // redirect certo alla pagina di login
        }, 300);
        return () => clearTimeout(t);
    }, [logout, router]);

    return (
        <section className="max-w-md mx-auto">
            <div className="rounded-2xl p-8 bg-[var(--surface)] border border-[var(--border)] shadow-sm text-center">
                <h2 className="text-2xl font-semibold mb-2">Uscita in corso…</h2>
                <p className="text-[var(--muted)] mb-6">Attendi qualche istante.</p>

                <div className="flex items-center justify-center gap-3">
                    {/* Link di fallback ASSOLUTI corretti (se l'auto-redirect non partisse) */}
                    <a href="/auth/login" className="rounded-xl border px-4 py-2">Vai al login</a>
                    <a href="/auth/register" className="rounded-xl border px-4 py-2">Crea account</a>
                </div>
            </div>
        </section>
    );
}
