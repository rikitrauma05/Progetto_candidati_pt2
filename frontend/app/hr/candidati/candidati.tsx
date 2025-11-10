"use client";

import Link from "next/link";
import { useState } from "react";

export default function HrCandidati() {
    const [q, setQ] = useState("");

    // Nessun mock: lista vuota in attesa del backend
    const candidati: Array<{
        idCandidato: string;
        nome: string;
        cognome: string;
        email: string;
        stato: string;
    }> = [];

    const filtrati = candidati.filter(
        (c) =>
            c.nome.toLowerCase().includes(q.toLowerCase()) ||
            c.cognome.toLowerCase().includes(q.toLowerCase()) ||
            c.email.toLowerCase().includes(q.toLowerCase())
    );

    return (
        <section className="space-y-8">
            {/* Header */}
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                <h2 className="text-2xl font-semibold mb-2">Gestione candidati</h2>
                <p className="text-muted">
                    Visualizza e gestisci i profili dei candidati registrati.
                </p>
            </div>

            {/* Ricerca */}
            <div className="rounded-2xl p-4 bg-surface border border-border shadow-card">
                <input
                    type="text"
                    placeholder="Cerca per nome, cognome o email..."
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            {/* Lista candidati */}
            {filtrati.length === 0 ? (
                <div className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center text-muted">
                    Nessun candidato trovato.
                </div>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtrati.map((c) => (
                        <li
                            key={c.idCandidato}
                            className="rounded-2xl p-5 bg-surface border border-border shadow-card flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {c.nome} {c.cognome}
                                </h3>
                                <p className="text-sm text-muted">{c.email}</p>
                                <p className="text-xs text-muted mt-1">Stato: {c.stato}</p>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Link
                                    href={`/hr/candidati/${c.idCandidato}`}
                                    className="rounded-xl border border-border px-3 py-1 text-sm hover:bg-surface"
                                >
                                    Dettagli
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
