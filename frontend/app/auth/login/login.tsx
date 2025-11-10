"use client";

import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            // TODO: sostituire con services/auth.service.ts (login)
            // await authService.login({ email, password })
            await new Promise((r) => setTimeout(r, 600));
            // redirect/logica dopo login verranno gestiti in seguito
        } catch (err) {
            setError("Credenziali non valide.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="max-w-md mx-auto">
            <div className="rounded-2xl p-8 bg-surface border border-border shadow-card">
                <h2 className="text-2xl font-semibold mb-2">Accesso</h2>
                <p className="text-muted mb-6">
                    Entra per gestire profilo, candidature e test.
                </p>

                <form className="space-y-4" onSubmit={onSubmit} noValidate>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                            placeholder="nome@esempio.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-invalid={!!error}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Password</label>
                        <div className="flex items-stretch gap-2">
                            <input
                                type={showPwd ? "text" : "password"}
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="px-3 rounded-xl border border-border bg-background hover:bg-surface"
                                onClick={() => setShowPwd((s) => !s)}
                                aria-label={showPwd ? "Nascondi password" : "Mostra password"}
                            >
                                {showPwd ? "Nascondi" : "Mostra"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn w-full disabled:opacity-60"
                        disabled={submitting}
                    >
                        {submitting ? "Accesso in corso..." : "Accedi"}
                    </button>
                </form>

                <div className="mt-6 text-sm">
                    <a href="/auth/register/register" className="text-accent hover:underline">
                        Non hai un account? Registrati
                    </a>
                </div>
            </div>
        </section>
    );
}
