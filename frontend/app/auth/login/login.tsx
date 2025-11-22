"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuthStore } from "@/store/authStore";
import { login as loginService } from "@/services/auth.service";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import PageHeader from "@/components/layout/pageHeader";
import Button from "@/components/ui/button";

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, user, login: loginStore } = useAuthStore();

    const [form, setForm] = useState<LoginRequest>({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errore, setErrore] = useState<string | null>(null);

    // Se sei già loggato, manda subito alla pagina giusta
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        if (user.ruolo === "HR") {
            router.replace("/hr/dashboard");
        } else if (user.ruolo === "CANDIDATO") {
            router.replace("/candidati/posizioni");
        } else {
            router.replace("/");
        }
    }, [isAuthenticated, user, router]);

    const handleChange =
        (field: keyof LoginRequest) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setForm((prev) => ({ ...prev, [field]: e.target.value }));
            };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrore(null);
        setLoading(true);

        try {
            // chiamata al backend
            const resp: LoginResponse = await loginService(form);

            // salviamo in Zustand
            loginStore(resp.user, {
                accessToken: resp.accessToken,
                refreshToken: resp.refreshToken,
            });

            // redirect in base al ruolo
            if (resp.user.ruolo === "HR") {
                router.push("/hr/dashboard");
            } else if (resp.user.ruolo === "CANDIDATO") {
                router.push("/candidati/posizioni");
            } else {
                router.push("/");
            }

        } catch (err: any) {
            console.error("Errore login:", err);
            setErrore(err?.message ?? "Errore durante il login.");
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

                {errore && (
                    <div className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errore}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
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
                            onChange={handleChange("email")}
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        />
                    </div>

                    <div className="space-y-1">
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
                            onChange={handleChange("password")}
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full justify-center"
                        disabled={loading}
                    >
                        {loading ? "Accesso in corso..." : "Accedi"}
                    </Button>
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
