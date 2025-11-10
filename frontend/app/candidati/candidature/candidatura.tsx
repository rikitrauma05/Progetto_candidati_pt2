"use client";

import { useMemo, useState } from "react";
// Facoltativo: quando collegheremo il backend useremo i tuoi tipi/services
// import { Candidatura } from "@/types/candidatura";

export default function CandidaturePage() {
    const [q, setQ] = useState("");
    const [stato, setStato] = useState<string>("tutti");

    // Nessun mock: lista vuota in attesa di API/DB
    // const candidature: Candidatura[] = [];
    const candidature: Array<{
        idCandidatura: string;
        titoloPosizione: string;
        stato: string;
        aggiornataIl: string;
    }> = [];

    const stati = useMemo(() => {
        const set = new Set(candidature.map((c) => c.stato));
        return ["tutti", ...Array.from(set)];
    }, [candidature]);

    const filtrate = useMemo(() => {
        return candidature
            .filter((c) => {
                const matchQ =
                    q.trim().length === 0 ||
                    c.titoloPosizione.toLowerCase().includes(q.toLowerCase());
                const matchStato = stato === "tutti" || c.stato === stato;
                return matchQ && matchStato;
            })
            .sort((a, b) => b.aggiornataIl.localeCompare(a.aggiornataIl));
    }, [candidature, q, stato]);

    return (
        <section className="space-y-6">
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                <h2 className="text-2xl font-semibold mb-2">Le mie candidature</h2>
                <p className="text-muted">
                    Qui troverai lo stato e la cronologia delle candidature inviate.
                </p>
            </div>

            <div className="rounded-2xl p-4 bg-surface border border-border shadow-card">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        type="text"
                        placeholder="Cerca per titolo posizione…"
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />

                    <select
                        className="w-full rounded-xl border border-border bg-background px-3 py-2"
                        value={stato}
                        onChange={(e) => setStato(e.target.value)}
                    >
                        {stati.map((s) => (
                            <option key={s} value={s}>
                                {s === "tutti" ? "Tutti gli stati" : s}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center text-sm text-muted">
                        {/* Placeholder per futuri filtri (data, sede, ecc.) */}
                        Filtri aggiuntivi in arrivo
                    </div>
                </div>
            </div>

            {filtrate.length === 0 ? (
                <div className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                    <p className="text-muted">
                        Non hai ancora candidature visibili. Torna qui dopo aver inviato la
                        tua prima candidatura.
                    </p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 gap-4">
                    {filtrate.map((c) => (
                        <li
                            key={c.idCandidatura}
                            className="rounded-2xl p-5 bg-surface border border-border shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{c.titoloPosizione}</h3>
                                <p className="text-xs text-muted">
                                    Ultimo aggiornamento: {c.aggiornataIl}
                                </p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-300">
                {c.stato}
              </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
