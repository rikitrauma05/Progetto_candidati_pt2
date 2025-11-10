"use client";

import { useState } from "react";

export default function ProfiliPage() {
    const [modifica, setModifica] = useState(false);

    // Nessun mock: i dati arriveranno dal DB tramite userService
    const profilo = null;

    if (!profilo) {
        return (
            <section className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center">
                <h2 className="text-xl font-semibold mb-2">Profilo candidato</h2>
                <p className="text-muted">
                    Nessun profilo caricato. Quando collegheremo il database, qui
                    verranno mostrati i tuoi dati personali.
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-8">
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                <h2 className="text-2xl font-semibold mb-2">Il mio profilo</h2>
                <p className="text-muted">
                    Gestisci le informazioni del tuo account candidato.
                </p>
            </div>

            <form className="rounded-2xl p-6 bg-surface border border-border shadow-card space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Nome</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                            disabled={!modifica}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Cognome</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                            disabled={!modifica}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                        disabled={!modifica}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    {!modifica ? (
                        <button
                            type="button"
                            className="btn"
                            onClick={() => setModifica(true)}
                        >
                            Modifica
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="rounded-xl border border-border px-4 py-2 hover:bg-surface"
                                onClick={() => setModifica(false)}
                            >
                                Annulla
                            </button>
                            <button type="submit" className="btn">
                                Salva modifiche
                            </button>
                        </>
                    )}
                </div>
            </form>
        </section>
    );
}
