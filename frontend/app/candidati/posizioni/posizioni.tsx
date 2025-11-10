"use client";

import { useMemo, useState } from "react";
import PosizioneCard from "@/components/cards/posizioneCard";
import { Posizione } from "@/types/posizione";

export default function PosizioniPage() {
    const [q, setQ] = useState("");
    const [sede, setSede] = useState<string>("tutte");
    const [contratto, setContratto] = useState<string>("tutti");
    const [soloAperte, setSoloAperte] = useState(true);

    // Nessun mock: array vuoto in attesa di integrazione API
    const POSIZIONI: Posizione[] = [];

    const sedi = useMemo(() => {
        const set = new Set(POSIZIONI.map((p) => p.sede));
        return ["tutte", ...Array.from(set)];
    }, [POSIZIONI]);

    const contratti = useMemo(() => {
        const set = new Set(POSIZIONI.map((p) => p.contratto));
        return ["tutti", ...Array.from(set)];
    }, [POSIZIONI]);

    const filtrate = useMemo(() => {
        return POSIZIONI.filter((p) => {
            const matchQ =
                q.trim().length === 0 ||
                p.titolo.toLowerCase().includes(q.toLowerCase()) ||
                p.settore.toLowerCase().includes(q.toLowerCase()) ||
                p.sede.toLowerCase().includes(q.toLowerCase());

            const matchSede = sede === "tutte" || p.sede === sede;
            const matchContratto = contratto === "tutti" || p.contratto === contratto;
            const matchStato = !soloAperte || p.stato === "APERTA";

            return matchQ && matchSede && matchContratto && matchStato;
        }).sort((a, b) => b.aggiornataIl.localeCompare(a.aggiornataIl));
    }, [POSIZIONI, q, sede, contratto, soloAperte]);

    return (
        <section className="space-y-6">
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                <h2 className="text-2xl font-semibold mb-2">Posizioni</h2>
                <p className="text-muted">Quando collegheremo il backend, qui comparirà l’elenco.</p>
            </div>

            <div className="rounded-2xl p-4 bg-surface border border-border shadow-card">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                        type="text"
                        placeholder="Cerca per titolo, settore o sede..."
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />

                    <select
                        className="w-full rounded-xl border border-border bg-background px-3 py-2"
                        value={sede}
                        onChange={(e) => setSede(e.target.value)}
                    >
                        {sedi.map((s) => (
                            <option key={s} value={s}>
                                {s === "tutte" ? "Tutte le sedi" : s}
                            </option>
                        ))}
                    </select>

                    <select
                        className="w-full rounded-xl border border-border bg-background px-3 py-2"
                        value={contratto}
                        onChange={(e) => setContratto(e.target.value)}
                    >
                        {contratti.map((c) => (
                            <option key={c} value={c}>
                                {c === "tutti" ? "Tutti i contratti" : c}
                            </option>
                        ))}
                    </select>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={soloAperte}
                            onChange={(e) => setSoloAperte(e.target.checked)}
                        />
                        Mostra solo posizioni aperte
                    </label>
                </div>
            </div>

            {filtrate.length === 0 ? (
                <div className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                    <p className="text-muted">Nessuna posizione disponibile al momento.</p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtrate.map((p) => (
                        <li key={p.id}>
                            <PosizioneCard posizione={p} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
