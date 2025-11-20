"use client";

import { useUser } from "@/hooks/useUser";

export default function ProfiloCandidato() {
    const { profilo, loading, error, reload } = useUser();

    if (loading && !profilo) {
        return (
            <section className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">
                    Il tuo profilo
                </h1>
                <div className="rounded-xl border border-border bg-[var(--card)] p-6">
                    <p className="text-sm text-[var(--muted)]">
                        Caricamento del profilo in corso…
                    </p>
                </div>
            </section>
        );
    }

    if (error && !profilo) {
        return (
            <section className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">
                    Il tuo profilo
                </h1>
                <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6">
                    <p className="text-sm text-destructive mb-4">
                        {error}
                    </p>
                    <button
                        type="button"
                        onClick={reload}
                        className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                    >
                        Riprova a caricare
                    </button>
                </div>
            </section>
        );
    }

    if (!profilo) {
        return (
            <section className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">
                    Il tuo profilo
                </h1>
                <div className="rounded-xl border border-border bg-[var(--card)] p-6">
                    <p className="text-sm text-[var(--muted)]">
                        Nessun profilo trovato per questo account.
                    </p>
                    <button
                        type="button"
                        onClick={reload}
                        className="mt-4 inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                    >
                        Riprova a caricare
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">
                Il tuo profilo
            </h1>

            <div className="rounded-xl border border-border bg-[var(--card)] p-6 space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        {profilo.nome} {profilo.cognome}
                    </h2>
                    <p className="text-sm text-[var(--muted)]">
                        Ruolo: <span className="font-medium">{profilo.ruolo}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                        <p className="text-[var(--muted)]">Email</p>
                        <p className="font-medium break-all">
                            {profilo.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-[var(--muted)]">ID utente</p>
                        <p className="font-mono text-xs">
                            {profilo.idUtente}
                        </p>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="button"
                        onClick={reload}
                        className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                    >
                        Aggiorna dati profilo
                    </button>
                </div>
            </div>
        </section>
    );
}
