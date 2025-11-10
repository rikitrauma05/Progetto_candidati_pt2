"use client";

import { useState } from "react";

export default function Register() {
    const [form, setForm] = useState({
        nome: "",
        cognome: "",
        email: "",
        password: "",
        confermaPassword: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (form.password !== form.confermaPassword) {
            setError("Le password non coincidono.");
            return;
        }

        setSubmitting(true);
        try {
            // TODO: collegare al servizio di registrazione API
            await new Promise((r) => setTimeout(r, 700));
            setSuccess(true);
        } catch (err) {
            setError("Errore durante la registrazione.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="max-w-md mx-auto">
            <div className="rounded-2xl p-8 bg-surface border border-border shadow-card">
                <h2 className="text-2xl font-semibold mb-2">Crea un account</h2>
                <p className="text-muted mb-6">
                    Registrati per candidarti alle posizioni aperte.
                </p>

                <form className="space-y-4" onSubmit={onSubmit} noValidate>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium">Nome</label>
                            <input
                                type="text"
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Cognome</label>
                            <input
                                type="text"
                                name="cognome"
                                value={form.cognome}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Conferma password
                        </label>
                        <input
                            type="password"
                            name="confermaPassword"
                            value={form.confermaPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            role="alert"
                            className="rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700"
                        >
                            Registrazione completata con successo!
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn w-full disabled:opacity-60"
                        disabled={submitting}
                    >
                        {submitting ? "Registrazione in corso..." : "Registrati"}
                    </button>
                </form>

                <div className="mt-6 text-sm">
                    <a href="/auth/login/login" className="text-accent hover:underline">
                        Hai già un account? Accedi
                    </a>
                </div>
            </div>
        </section>
    );
}
