"use client";

import Link from "next/link";
import { useState } from "react";

export default function HrPosizioni() {
    const [filtro, setFiltro] = useState("");

    // Nessun mock: array vuoto, in attesa di integrazione con DB/API
    const posizioni: Array<{
        idPosizione: string;
        titolo: string;
        stato: "APERTA" | "CHIUSA";
        aggiornataIl: string;
    }> = [];

    const filtrate = posizioni.filter((p) =>
        p.titolo.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <section className="space-y-8">
            {/* Header */}
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Gestione posizioni</h2>
                    <p className="text-muted">
                        Crea, modifica o chiudi le posizioni aperte.
                    </p>
                </div>

                <Link href="/hr/posizioni/nuova" className="btn">
                    + Nuova posizione
                </Link>
            </div>

            {/* Filtri */}
            <div className="rounded-2xl p-4 bg-surface border border-border shadow-card">
                <input
                    type="text"
                    placeholder="Filtra per titolo..."
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>

            {/* Elenco posizioni */}
            {filtrate.length === 0 ? (
                <div className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center text-muted">
                    Nessuna posizione trovata.
                </div>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtrate.map((p) => (
                        <li
                            key={p.idPosizione}
                            className="rounded-2xl p-5 bg-surface border border-border shadow-card flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{p.titolo}</h3>
                                <p className="text-sm text-muted mb-3">
                                    Stato:{" "}
                                    <span
                                        className={`font-semibold ${
                                            p.stato === "APERTA" ? "text-green-600" : "text-gray-600"
                                        }`}
                                    >
                    {p.stato}
                  </span>
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                <span className="text-xs text-muted">
                  Aggiornata il {p.aggiornataIl}
                </span>
                                <Link
                                    href={`/hr/posizioni/${p.idPosizione}`}
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
