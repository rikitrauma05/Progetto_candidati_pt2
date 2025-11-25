"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { login as loginService } from "@/services/auth.service";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, user, login: loginStore } = useAuthStore();
    const fetchProfilo = useUserStore((s) => s.fetchProfilo);

    const [form, setForm] = useState<LoginRequest>({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect se già autenticato
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const redirectPath =
            user.ruolo === "HR"
                ? "/hr/dashboard"
                : user.ruolo === "CANDIDATO"
                    ? "/candidati/posizioni"
                    : "/";

        router.replace(redirectPath);
    }, [isAuthenticated, user, router]);

    const handleInputChange = (field: keyof LoginRequest) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const getErrorMessage = (err: any): string => {
        const errorMessage = String(err?.message || "");

        if (
            errorMessage.includes("CREDENZIALI_NON_VALIDE") ||
            errorMessage.includes("401") ||
            errorMessage.includes("Unauthorized")
        ) {
            return "Email o password non corretti.";
        }

        if (errorMessage.includes("UTENTE_NON_TROVATO")) {
            return "Non esiste un account con questa email.";
        }

        return "Si è verificato un errore durante l'accesso. Riprova.";
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response: LoginResponse = await loginService(form);

            // Aggiorna authStore
            loginStore(response.user, {
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            });

            // Aggiorna userStore con il profilo dettagliato
            await fetchProfilo();

            // Redirect in base al ruolo
            const redirectPath =
                response.user.ruolo === "HR"
                    ? "/hr/dashboard"
                    : response.user.ruolo === "CANDIDATO"
                        ? "/candidati/posizioni"
                        : "/";

            router.push(redirectPath);
        } catch (err: any) {
            console.error("Errore login:", err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh flex items-center justify-center px-4">
            <div className="w-full max-w-lg space-y-6">
                <PageHeader
                    title="Accedi a CandidAI"
                    subtitle="Inserisci le tue credenziali per continuare"
                />

                {error && (
                    <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-[var(--foreground)]"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleInputChange("email")}
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow"
                            placeholder="tua@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-[var(--foreground)]"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleInputChange("password")}
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full justify-center"
                            disabled={loading}
                        >
                            {loading ? "Accesso in corso..." : "Accedi"}
                        </Button>
                    </div>
                </form>

                <p className="text-center text-sm text-[var(--muted)]">
                    Non hai un account?{" "}
                    <Link
                        href="/auth/register"
                        className="font-medium text-[var(--accent)] hover:underline"
                    >
                        Registrati
                    </Link>
                </p>
            </div>
        </div>
    );
}
