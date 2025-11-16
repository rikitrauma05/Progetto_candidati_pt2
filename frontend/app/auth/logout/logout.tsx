"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout as logoutApi } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export default function Logout() {
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);

    useEffect(() => {
        async function doLogout() {
            try {
                await logoutApi(); // chiama /api/auth/logout se lo implementi
            } catch {
                // possiamo anche ignorare errori qui
            } finally {
                logout(); // svuota lo store
                const t = setTimeout(() => {
                    router.replace("/auth/login");
                }, 300);
                return () => clearTimeout(t);
            }
        }
        void doLogout();
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
